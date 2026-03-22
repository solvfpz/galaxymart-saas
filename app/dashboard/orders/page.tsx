'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShoppingCart, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Order marked as ${newStatus}`);
        fetchOrders();
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Connection error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Manage your customer transactions.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>A list of all recent purchases.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <ShoppingCart className="mb-4 h-12 w-12 opacity-20" />
              <p>No orders found yet.</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="bg-muted text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-b border-border bg-card hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {o.customerEmail}
                      </td>
                      <td className="px-6 py-4">
                        {o.productId?.name || <span className="text-muted-foreground italic">Deleted Product</span>}
                      </td>
                      <td className="px-6 py-4">${o.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        {o.status === 'confirmed' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">
                            <CheckCircle className="h-3.5 w-3.5" /> Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-500">
                            <Clock className="h-3.5 w-3.5" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        {o.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(o._id, 'confirmed')}
                            className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            Mark Confirmed
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
