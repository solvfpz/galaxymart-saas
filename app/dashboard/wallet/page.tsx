'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Copy, RefreshCw, ArrowUpRight, ArrowDownLeft, ExternalLink, DollarSign, Clock, Bitcoin, TrendingUp, QrCode } from 'lucide-react';

import { toast } from 'sonner';

export default function WalletDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState('');

  const fetchWallet = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const res = await fetch('/api/dashboard/wallet');
      const walletData = await res.json();
      if (walletData.success) {
        setData(walletData);
        setAddress(walletData.address || '');
      } else {
        setError(walletData.message || 'Failed to load wallet data');
      }
    } catch (err) {
      setError('Failed to connect to wallet service');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchWallet(true);
    const interval = setInterval(() => fetchWallet(false), 60000);
    return () => clearInterval(interval);
  }, [fetchWallet]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (!mounted || loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 bg-muted rounded" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-muted rounded-xl" />)}
          </div>
          <div className="h-80 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  const balanceLtc = data?.balance_ltc ?? 0;
  const balanceUsd = data?.balance_usd ?? 0;
  const ltcPrice = data?.ltc_usd_price ?? 0;
  const totalReceived = data?.total_received_ltc ?? 0;
  const totalSent = data?.total_sent_ltc ?? 0;
  const unconfirmed = data?.unconfirmed_ltc ?? 0;
  const transactions = data?.transactions ?? [];
  const balanceSource = data?.balance_source ?? '';
  const priceSource = data?.price_source ?? '';
  const updatedAt = data?.updated_at ? new Date(data.updated_at).toLocaleString() : 'N/A';

  const overviewCards = [
    { title: 'LTC Balance', value: `${balanceLtc.toFixed(8)} LTC`, sub: `≈ $${balanceUsd.toFixed(2)} USD`, icon: Bitcoin, color: 'text-blue-400' },
    { title: 'USD Value', value: `$${balanceUsd.toFixed(2)}`, sub: `@ $${ltcPrice.toFixed(2)}/LTC`, icon: DollarSign, color: 'text-green-400' },
    { title: 'Total Received', value: `${totalReceived.toFixed(8)} LTC`, sub: `≈ $${(totalReceived * ltcPrice).toFixed(2)}`, icon: ArrowDownLeft, color: 'text-emerald-400' },
    { title: 'Total Sent', value: `${totalSent.toFixed(8)} LTC`, sub: `≈ $${(totalSent * ltcPrice).toFixed(2)}`, icon: ArrowUpRight, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-400" />
            Wallet Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor your Litecoin wallet balance and transactions.
          </p>
        </div>
        <button
          onClick={() => fetchWallet(false)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Wallet Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              Wallet Information
            </CardTitle>
            <CardDescription>
              Your receiving wallet details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Main LTC Address</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 rounded-lg bg-secondary px-3 py-2 text-xs font-mono truncate">
                  {address || 'N/A'}
                </code>
                <button
                  onClick={() => handleCopy(address, 'Address')}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title="Copy Address"
                >
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">Connected Provider</span>
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <Bitcoin className="w-3.5 h-3.5 text-orange-400" />
                NOWPayments
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Last Updated
              </span>
              <span className="text-xs font-mono">{updatedAt}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <span className="text-sm text-muted-foreground">LTC/USD Price</span>
              <span className="text-sm font-semibold text-green-400">
                ${ltcPrice.toFixed(2)}
              </span>
            </div>

            {/* QR Code */}
            {address && (
              <div className="flex justify-center pt-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(address)}&bgcolor=18181b&color=ffffff&margin=10`}
                  alt="Wallet QR Code"
                  className="rounded-xl border border-white/10"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Latest {transactions.length} payment transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No transactions found.
              </div>
            ) : (
              <div className="space-y-1">
                {transactions.slice(0, 15).map((tx: any, i: number) => {
                  const isReceive = tx.type === 'receive' || tx.type === 'paid' || tx.type === 'confirmed' || tx.type === 'delivered';
                  const statusLabel = tx.status && tx.status !== 'receive' && tx.status !== 'send'
                    ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1)
                    : isReceive ? 'Received' : 'Payment';
                  return (
                    <div key={tx.tx_hash || i} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <div className={`p-1.5 rounded-full shrink-0 ${isReceive ? 'bg-emerald-500/10' : 'bg-yellow-500/10'}`}>
                          {isReceive
                            ? <ArrowDownLeft className={`w-3.5 h-3.5 text-emerald-400`} />
                            : <Clock className={`w-3.5 h-3.5 text-yellow-400`} />
                          }
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {statusLabel}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono truncate">
                            {tx.tx_hash?.substring(0, 12)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2 sm:ml-4">
                        <p className={`text-xs sm:text-sm font-semibold ${isReceive ? 'text-emerald-400' : 'text-yellow-400'}`}>
                          {isReceive ? '+' : ''}{tx.amount_ltc?.toFixed(4)} LTC
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          ~${(tx.amount_usd || 0).toFixed(2)}
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 ml-3 shrink-0">
                        {tx.confirmed_at && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(tx.confirmed_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Balance History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Balance History</CardTitle>
          <CardDescription>Live LTC balance (updated every 30s)</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px]">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="text-2xl font-bold">{balanceLtc.toFixed(8)} LTC</p>
              <p className="text-sm mt-1">≈ ${balanceUsd.toFixed(2)} USD</p>
              {unconfirmed > 0 && (
                <p className="text-xs text-yellow-400 mt-1">
                  +{unconfirmed.toFixed(8)} unconfirmed
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
          <CardDescription>Where wallet data is fetched from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-xl bg-secondary/30 border border-white/5">
              <p className="text-sm font-medium">Balance</p>
              <p className="text-xs text-muted-foreground mt-1">
                {balanceSource === 'bitaps' ? 'bitaps.com (LTC)' :
                 balanceSource === 'blockcypher' ? 'BlockCypher' : 'Unavailable'}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className={`w-2 h-2 rounded-full ${balanceSource !== 'none' ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className={`text-xs ${balanceSource !== 'none' ? 'text-green-400' : 'text-red-400'}`}>
                  {balanceSource !== 'none' ? 'Connected' : 'Failed'}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-white/5">
              <p className="text-sm font-medium">LTC/USD Price</p>
              <p className="text-xs text-muted-foreground mt-1">
                {priceSource === 'coingecko' ? 'CoinGecko (live)' :
                 priceSource === 'cached' ? 'CoinGecko (cached)' : 'Unavailable'}
              </p>
              {ltcPrice > 0 && (
                <p className="text-xs font-mono mt-1 text-green-400">${ltcPrice.toFixed(2)}</p>
              )}
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 border border-white/5">
              <p className="text-sm font-medium">Transactions</p>
              <p className="text-xs text-muted-foreground mt-1">{transactions.length} payments from MongoDB</p>
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs text-green-400">Local Database</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
