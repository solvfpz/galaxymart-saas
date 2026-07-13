import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Settings from '@/models/Settings';

// ── Logging helper ──────────────────────────────────────────────────────────
function log(type: string, url: string, status: number | string, body: any) {
  const preview = typeof body === 'string'
    ? body.slice(0, 300)
    : JSON.stringify(body).slice(0, 300);
  console.log(`[WalletAPI] ${type} | ${status} | ${url} | ${preview}`);
}

function logError(type: string, source: string, err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`[WalletAPI] ERROR ${type} from ${source}: ${msg}`);
}

// ── CoinGecko price with retry + last-known-good cache ──────────────────────
let lastKnownPrice = 0;

async function fetchLtcUsdPrice(): Promise<{ price: number; source: string }> {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd';

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      log('COINGECKO', url, res.status, '[attempt ' + attempt + ']');

      if (!res.ok) {
        logError('COINGECKO', `attempt ${attempt}`, `HTTP ${res.status}`);
        if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
        continue;
      }

      const data = await res.json();
      const price = data.litecoin?.usd;

      if (price && price > 0) {
        lastKnownPrice = price;
        return { price, source: 'coingecko' };
      }

      logError('COINGECKO', `attempt ${attempt}`, `zero/empty response`);
    } catch (err) {
      logError('COINGECKO', `fetch error (attempt ${attempt})`, err);
    }

    if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
  }

  // All retries exhausted — return last known good price, or 0
  if (lastKnownPrice > 0) {
    console.log('[WalletAPI] COINGECKO using cached price:', lastKnownPrice);
    return { price: lastKnownPrice, source: 'cached' };
  }

  console.error('[WalletAPI] COINGECKO all 3 retries failed, no cached price');
  return { price: 0, source: 'none' };
}

// ── bitaps.com balance (confirmed working with LTC bech32) ──────────────────
async function fetchBitapsBalance(address: string) {
  const url = `https://api.bitaps.com/ltc/v1/blockchain/address/state/${address}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  log('BITAPS', url, res.status, res.status === 200 ? 'OK' : await res.text().catch(() => ''));

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`bitaps HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  const data = json.data || json;

  return {
    balance: (data.balance ?? 0) / 1e8,
    total_received: (data.receivedAmount ?? 0) / 1e8,
    total_sent: (data.sentAmount ?? 0) / 1e8,
    unconfirmed_balance: (data.pendingReceivedAmount ?? 0) / 1e8,
  };
}

// ── BlockCypher balance (fallback, broken for LTC bech32) ───────────────────
async function fetchBlockCypherBalance(address: string) {
  const token = process.env.BLOCKCYPHER_TOKEN;
  let url = `https://api.blockcypher.com/v1/ltc/main/addrs/${address}/balance`;
  if (token) url += `?token=${token}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const body = await res.text().catch(() => '');
  log('BLOCKCYPHER', url, res.status, body);

  if (!res.ok) {
    throw new Error(`BlockCypher HTTP ${res.status}: ${body.slice(0, 300)}`);
  }

  const json = JSON.parse(body);
  return json;
}

// ── Transactions from local MongoDB (NOWPayments orders) ────────────────────
async function fetchLocalTransactions(ltcPrice: number) {
  try {
    await dbConnect();
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(30)
      .select('paymentId ltcAmount usdAmount status createdAt payAddress txId')
      .lean();

    return orders.map((o: any) => {
      const isReceive = o.status === 'paid' || o.status === 'confirmed' || o.status === 'delivered';
      return {
        tx_hash: o.paymentId || o.txId || '',
        amount_ltc: o.ltcAmount || 0,
        amount_usd: o.usdAmount || (o.ltcAmount || 0) * ltcPrice,
        type: isReceive ? 'receive' : 'pending',
        status: o.status || 'unknown',
        confirmed_at: o.createdAt?.toISOString?.() || o.createdAt || null,
      };
    });
  } catch (err) {
    logError('MONGODB', 'fetchLocalTransactions', err);
    return [];
  }
}

// ── Wallet address source ────────────────────────────────────────────────────
async function getWalletAddress(): Promise<string> {
  const envAddr = process.env.MAIN_LTC_ADDRESS || '';
  if (envAddr) return envAddr;

  try {
    await dbConnect();
    const settings = await Settings.findOne().sort({ createdAt: -1 }).lean();
    if (settings?.ltcWalletAddress) return settings.ltcWalletAddress;
  } catch (err) {
    logError('MONGODB', 'getWalletAddress', err);
  }

  return '';
}

// ── GET handler ──────────────────────────────────────────────────────────────
export async function GET() {
  const address = await getWalletAddress();
  console.log('[WalletAPI] address from env/settings:', address || '(empty)');

  if (!address) {
    console.error('[WalletAPI] No wallet address found in env or MongoDB settings');
    return NextResponse.json({
      success: false,
      message: 'No wallet address configured. Set MAIN_LTC_ADDRESS in .env or add address in admin settings.',
    }, { status: 500 });
  }

  // Fetch all data independently (any failure is isolated)
  const [ltcPriceResult, bitapsResult, blockCypherResult, transactions] = await Promise.all([
    fetchLtcUsdPrice(),
    fetchBitapsBalance(address).catch((err) => {
      logError('BITAPS', 'fetchBitapsBalance', err);
      return null;
    }),
    fetchBlockCypherBalance(address).catch((err) => {
      logError('BLOCKCYPHER', 'fetchBlockCypherBalance', err);
      return null;
    }),
    fetchLocalTransactions(0),
  ]);

  const ltcPrice = ltcPriceResult.price;
  const priceSource = ltcPriceResult.source;

  // Prefer bitaps, fallback to BlockCypher
  let balanceLtc = 0;
  let unconfirmedLtc = 0;
  let totalReceivedLtc = 0;
  let totalSentLtc = 0;
  let balanceSource = 'none';

  if (bitapsResult) {
    balanceLtc = bitapsResult.balance;
    unconfirmedLtc = bitapsResult.unconfirmed_balance;
    totalReceivedLtc = bitapsResult.total_received;
    totalSentLtc = bitapsResult.total_sent;
    balanceSource = 'bitaps';
  } else if (blockCypherResult) {
    balanceLtc = (blockCypherResult.balance || 0) / 1e8;
    unconfirmedLtc = (blockCypherResult.unconfirmed_balance || 0) / 1e8;
    totalReceivedLtc = (blockCypherResult.total_received || 0) / 1e8;
    totalSentLtc = (blockCypherResult.total_sent || 0) / 1e8;
    balanceSource = 'blockcypher';
  }

  // Enrich transactions with current LTC price
  const enrichedTxs = transactions.map((tx: any) => ({
    ...tx,
    amount_usd: tx.amount_ltc * ltcPrice,
  }));

  console.log('[WalletAPI] response prepared', {
    address,
    balanceLtc,
    balanceSource,
    ltcPrice,
    priceSource,
    transactionsCount: enrichedTxs.length,
  });

  return NextResponse.json({
    success: true,
    address,
    balance_ltc: balanceLtc,
    unconfirmed_ltc: unconfirmedLtc,
    total_received_ltc: totalReceivedLtc,
    total_sent_ltc: totalSentLtc,
    ltc_usd_price: ltcPrice,
    price_source: priceSource,
    balance_source: balanceSource,
    balance_usd: balanceLtc * ltcPrice,
    transactions: enrichedTxs,
    updated_at: new Date().toISOString(),
  });
}
