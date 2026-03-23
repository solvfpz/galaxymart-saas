'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, Tag, Percent } from 'lucide-react';
import { toast } from 'sonner';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code,
      discount: Number(discount),
      expiryDate,
      active: true,
    };

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success('Coupon created successfully!');
        setIsModalOpen(false);
        setCode('');
        setDiscount('');
        setExpiryDate('');
        fetchCoupons();
      } else {
        const error = await res.json();
        toast.error(error.message || 'Operation failed');
      }
    } catch (err) {
      toast.error('Connection error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Coupon deleted');
        fetchCoupons();
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Coupons</h2>
          <p className="text-muted-foreground">Create promotional codes for your store.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Promotions</CardTitle>
          <CardDescription>A list of all generated discount codes.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Tag className="mb-4 h-12 w-12 opacity-20" />
              <p>No coupons found. Give your customers a discount!</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="bg-muted text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3">Code</th>
                    <th className="px-6 py-3">Discount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Expiry Date</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => {
                    const isExpired = new Date(c.expiryDate) < new Date();
                    return (
                      <tr key={c._id} className="border-b border-border bg-card hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 font-mono text-xs">
                            {c.code}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                            {c.discount} <Percent className="h-3 w-3" />
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {isExpired ? (
                            <span className="text-destructive font-medium">Expired</span>
                          ) : c.active ? (
                            <span className="text-emerald-500 font-medium">Active</span>
                          ) : (
                            <span className="text-muted-foreground font-medium">Disabled</span>
                          )}
                        </td>
                        <td className="px-6 py-4">{new Date(c.expiryDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDelete(c._id)} className="p-2 text-destructive/70 hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tailwind modal for Create */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95">
            <CardHeader>
              <CardTitle>New Coupon</CardTitle>
              <CardDescription>Generate a new discount code.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="SUMMER20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Discount amount (Percentage or Flat)</label>
                  <input
                    type="number"
                    required
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-4 border-t border-border mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Create
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
