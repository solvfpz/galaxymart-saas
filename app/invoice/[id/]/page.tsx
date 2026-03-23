'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Clock, Package, Mail, Calendar, DollarSign, ArrowLeft, Download, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InvoicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Invoice Not Found</h1>
        <button onClick={() => router.push('/')} className="px-6 py-2 bg-brand-primary rounded-full transition-all hover:scale-105 active:scale-95">
          Back to Store
        </button>
      </div>
    );
  }

  const product = order.productId;
  const currencySymbol = product?.currency === 'EUR' ? '€' : '$';

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Storefront</span>
          </button>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Invoice Content */}
          <div className="md:col-span-2 space-y-8">
            <Card className="bg-zinc-900/40 border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
              <div className="h-2 bg-gradient-to-r from-brand-primary to-brand-secondary"></div>
              <CardHeader className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl font-black text-white mb-2">INVOICE</CardTitle>
                    <CardDescription className="text-zinc-500 font-mono text-xs">#{order._id.toUpperCase()}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-white tracking-tight">GalaxyMart</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Premium Service Provider</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 border-t border-white/5">
                <div className="grid grid-cols-2 gap-8 mb-12">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Billed To</label>
                      <div className="flex items-center gap-2 text-white">
                        <Mail className="w-3 h-3 text-brand-primary" />
                        <span className="text-sm font-medium">{order.customerEmail}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 text-right">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date Issued</label>
                      <div className="flex items-center justify-end gap-2 text-white">
                        <Calendar className="w-3 h-3 text-brand-primary" />
                        <span className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 overflow-hidden mb-12">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      <tr>
                        <th className="px-6 py-4 text-left">Description</th>
                        <th className="px-6 py-4 text-center">Qty</th>
                        <th className="px-6 py-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="text-white bg-white/[0.02]">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                              <Package className="w-5 h-5 text-brand-primary" />
                            </div>
                            <div>
                              <div className="font-bold">{product?.name || 'Store Item'}</div>
                              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{product?.duration || 'Lifetime'} Access</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center font-mono">1</td>
                        <td className="px-6 py-6 text-right font-mono font-bold text-brand-primary">
                          {currencySymbol}{order.amount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                    <FileText className="w-4 h-4 text-brand-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white">Delivery Instructions</h3>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {product?.instructions || "No specific instructions provided. Your order is being processed and will be delivered shortly."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Sidebar */}
          <div className="space-y-6">
            <Card className="bg-zinc-900/40 border-white/10 backdrop-blur-xl shadow-xl">
              <CardContent className="p-6">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-4">Payment Status</label>
                <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
                  order.status === 'confirmed' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                }`}>
                  {order.status === 'confirmed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  <span className="text-sm font-bold uppercase tracking-widest">
                    {order.status === 'confirmed' ? 'Successfully Paid' : 'Payment Pending'}
                  </span>
                </div>
                
                <div className="pt-6 mt-6 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500 font-medium tracking-wide">Method</span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Direct Checkout</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Total Paid</span>
                    <span className="font-bold text-white font-mono">{currencySymbol}{order.amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 border-white/10 backdrop-blur-xl shadow-xl">
              <CardContent className="p-6 space-y-4">
                <div className="text-center pb-2">
                  <Package className="w-8 h-8 text-brand-primary/40 mx-auto mb-2" />
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Need Support?</p>
                </div>
                <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white hover:bg-brand-primary transition-all hover:border-brand-primary shadow-lg hover:shadow-brand-primary/20">
                  Contact Support
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
