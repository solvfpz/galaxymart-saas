import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import crypto from 'crypto';
import axios from 'axios';

function trunc(s: string, n: number): string {
  return s.length <= n ? s : s.slice(0, n) + '...';
}

export async function POST(req: Request) {
  const debug: any = {
    steps: [],
    errors: [],
    warnings: [],
    requestBody: null,
    npRequest: null,
    npResponse: null,
    orderBeforeSave: null,
  };

  const step = (label: string, data?: any) => {
    debug.steps.push({ label, data: data ?? '✓' });
    if (data !== undefined) console.log(`[PaymentCreate] ${label}:`, data);
    else console.log(`[PaymentCreate] ${label}`);
  };

  const errLog = (label: string, detail: any) => {
    debug.errors.push({ label, detail: trunc(String(detail), 500) });
    console.error(`[PaymentCreate] ERROR ${label}:`, detail);
  };

  const warn = (label: string, detail: any) => {
    debug.warnings.push({ label, detail: trunc(String(detail), 300) });
    console.warn(`[PaymentCreate] WARN ${label}:`, detail);
  };

  try {
    // ── 1. Parse request ──────────────────────────────────────────────────
    step('Parsing request body');
    const body = await req.json().catch(() => ({}));
    debug.requestBody = body;
    step('Raw request body', JSON.stringify(body));

    const { productId, productDetails } = body;

    if (!productId || !productDetails || !productDetails.email) {
      errLog('Validation', 'Missing required fields: productId, productDetails, or email');
      return NextResponse.json({ success: false, message: 'Missing required fields', debug }, { status: 400 });
    }

    // ── 2. Connect + load product ─────────────────────────────────────────
    step('Connecting to MongoDB');
    await dbConnect();

    step('Looking up product', productId);
    const product = await Product.findById(productId);
    if (!product) {
      errLog('Product not found', productId);
      return NextResponse.json({ success: false, message: 'Product not found', debug }, { status: 404 });
    }
    step('Product found', { name: product.name, price: product.price, stock: product.stock });

    const priceValue = typeof product.price === 'string'
      ? parseFloat(product.price.replace('$', ''))
      : product.price;
    step('Price parsed', priceValue);

    const quantity = parseInt(productDetails.quantity) || 1;
    step('Quantity', quantity);

    if (product.stock < quantity) {
      errLog('Insufficient stock', { available: product.stock, requested: quantity });
      return NextResponse.json({ success: false, message: 'Not enough stock available', debug }, { status: 400 });
    }

    // ── 3. Calculate price (with coupon) ──────────────────────────────────
    let totalPrice = priceValue * quantity;
    step('Total price (before coupon)', totalPrice);

    if (productDetails.coupon) {
      step('Applying coupon', productDetails.coupon);
      const coupon = await Coupon.findOne({ code: productDetails.coupon.toUpperCase(), active: true });
      if (coupon && new Date(coupon.expiryDate) > new Date()) {
        totalPrice -= (totalPrice * coupon.discount) / 100;
        step('Coupon applied', { discount: coupon.discount, newTotal: totalPrice });
      } else {
        warn('Coupon invalid or expired', productDetails.coupon);
      }
    }

    const finalUsdAmount = parseFloat(totalPrice.toFixed(2));
    step('Final USD amount', finalUsdAmount);

    if (finalUsdAmount <= 0) {
      errLog('Validation', 'Price must be greater than 0');
      return NextResponse.json({ success: false, message: 'Invalid price amount', debug }, { status: 400 });
    }

    // ── 4. Generate identifiers ───────────────────────────────────────────
    const paymentId = `INV-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    step('Generated paymentId (used as NOWPayments order_id)', paymentId);

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    step('Expires at', expiresAt.toISOString());

    // ── 5. Check NOWPayments API key ──────────────────────────────────────
    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || 'http://localhost:3000';

    step('NOWPayments API key present', apiKey ? `Yes (prefix: ${apiKey?.slice(0, 6) || ''}...)` : 'NO — NOT SET');
    step('Site URL for IPN callback', siteUrl);

    if (!apiKey) {
      errLog('NOWPayments API key missing', 'NOWPAYMENTS_API_KEY env var is not set');
      return NextResponse.json({ success: false, message: 'NOWPayments not configured. Missing API key.', debug }, { status: 500 });
    }

    // ── 6. Call NOWPayments FIRST to get pay_address ──────────────────────
    const npPayload = {
      price_amount: finalUsdAmount,
      price_currency: 'usd',
      pay_currency: 'ltc',
      ipn_callback_url: `${siteUrl}/api/payments/nowpayments-webhook`,
      order_id: paymentId,
      order_description: product.name,
    };
    debug.npRequest = npPayload;
    step('NOWPayments request payload', JSON.stringify(npPayload, null, 2));
    step('NOWPayments request URL', 'https://api.nowpayments.io/v1/payment');

    let npData: any;
    try {
      step('Sending request to NOWPayments...');
      const npRes = await axios.post(
        'https://api.nowpayments.io/v1/payment',
        npPayload,
        {
          headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' },
          timeout: 15000,
        }
      );
      npData = npRes.data;
      debug.npResponse = {
        status: npRes.status,
        statusText: npRes.statusText,
        data: npData,
      };
      step('NOWPayments response status', npRes.status);
      step('NOWPayments response body', JSON.stringify(npData, null, 2));
    } catch (npErr: any) {
      const detail = {
        message: npErr.message,
        status: npErr.response?.status ?? 'N/A',
        statusText: npErr.response?.statusText ?? 'N/A',
        responseData: npErr.response?.data ?? 'N/A',
      };
      errLog('NOWPayments HTTP call failed', JSON.stringify(detail, null, 2));
      debug.npResponse = detail;
      return NextResponse.json({
        success: false,
        message: `NOWPayments error: ${npErr.response?.data?.message || npErr.response?.data?.error || npErr.message}`,
        nowpayments_response: npErr.response?.data || npErr.message,
        debug,
      }, { status: npErr.response?.status || 502 });
    }

    // ── 7. Validate NOWPayments response ──────────────────────────────────
    const nowPayId = npData?.payment_id;
    const payAddress = npData?.pay_address;
    const payAmount = parseFloat(npData?.pay_amount) || 0;
    const ltcPriceAtTime = payAmount > 0 ? finalUsdAmount / payAmount : 0;

    step('Validating NOWPayments response', {
      has_payment_id: !!nowPayId,
      has_pay_address: !!payAddress,
      pay_address_value: payAddress || '(empty)',
      pay_amount: payAmount,
      ltcPriceAtTime,
    });

    if (!nowPayId || !payAddress || payAmount <= 0) {
      errLog('NOWPayments returned incomplete payment data', {
        payment_id: nowPayId,
        pay_address: payAddress,
        pay_amount: payAmount,
      });
      return NextResponse.json({
        success: false,
        message: 'NOWPayments returned incomplete payment data',
        nowpayments_response: npData,
        debug,
      }, { status: 502 });
    }

    step('NOWPayments wallet address received', payAddress);

    // ── 8. Create Order in MongoDB with ALL data populated ────────────────
    step('Preparing order object for MongoDB');
    const orderData = {
      productId,
      customerEmail: productDetails.email,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentProvider: 'nowpayments',
      quantity,
      amount: finalUsdAmount,
      usdAmount: finalUsdAmount,
      ltcAmount: payAmount,
      ltcPriceAtTime,
      paymentId,
      walletAddress: payAddress,
      payAddress,
      payAmount,
      payCurrency: 'ltc',
      nowPaymentId: String(nowPayId),
      expiresAt,
    };
    debug.orderBeforeSave = orderData;
    step('Order object before save', JSON.stringify(orderData, null, 2));
    step('walletAddress value', orderData.walletAddress);
    step('paymentId value', orderData.paymentId);
    step('nowPaymentId value', orderData.nowPaymentId);
    step('payAddress value', orderData.payAddress);
    step('payAmount value', orderData.payAmount);
    step('payCurrency value', orderData.payCurrency);
    step('paymentProvider value', orderData.paymentProvider);

    step('Saving order to MongoDB...');
    let order;
    try {
      order = await Order.create(orderData);
      step('Order saved successfully', { _id: String(order._id) });
    } catch (saveErr: any) {
      errLog('MongoDB Order.create failed', {
        message: saveErr.message,
        errors: saveErr.errors ? Object.keys(saveErr.errors).map((k) => ({
          field: k,
          message: saveErr.errors[k]?.message,
          value: saveErr.errors[k]?.value,
        })) : 'N/A',
        stack: saveErr.stack?.split('\n').slice(0, 5).join('\n'),
      });
      return NextResponse.json({
        success: false,
        message: `Order validation failed: ${saveErr.message}`,
        validation_errors: saveErr.errors,
        debug,
      }, { status: 500 });
    }

    // ── 9. Return invoice response ────────────────────────────────────────
    const response = {
      success: true,
      orderId: String(order._id),
      paymentId: order.paymentId,
      payAddress: order.payAddress,
      payAmount: order.payAmount,
      nowPaymentId: order.nowPaymentId,
      usdAmount: order.usdAmount,
      priceAmount: finalUsdAmount,
      priceCurrency: 'usd',
      payCurrency: order.payCurrency || 'ltc',
      ltcPriceAtTime: order.ltcPriceAtTime,
      walletAddress: order.walletAddress,
      ltcAmount: order.ltcAmount,
      expiresAt: order.expiresAt,
      crypto: 'LTC',
      productName: product.name,
      productImage: product.image,
    };
    step('Returning success response', JSON.stringify(response, null, 2));

    return NextResponse.json(response, { status: 201 });

  } catch (error: any) {
    errLog('Unhandled exception', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5).join('\n'),
      responseData: error.response?.data,
      responseStatus: error.response?.status,
    });

    return NextResponse.json({
      success: false,
      message: error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create NOWPayments payment',
      nowpayments_response: error.response?.data || null,
      debug,
    }, { status: error.response?.status || 500 });
  }
}
