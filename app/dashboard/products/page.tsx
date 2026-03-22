'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Loader2, Package } from 'lucide-react';
import { toast } from 'sonner';

const DURATION_OPTIONS = ['1 Month', '3 Months', 'Lifetime'];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [duration, setDuration] = useState('Lifetime');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const openForm = (product: any = null) => {
    if (product) {
      setEditingId(product._id);
      setName(product.name);
      setPrice(product.price.toString());
      setDescription(product.description);
      setImage(product.image);
      setDuration(product.duration || 'Lifetime');
    } else {
      setEditingId(null);
      setName('');
      setPrice('');
      setDescription('');
      setImage('');
      setDuration('Lifetime');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name, price: Number(price), description, image, duration };

    try {
      const res = await fetch(editingId ? `/api/products/${editingId}` : '/api/products', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Product ${editingId ? 'updated' : 'created'} successfully!`);
        setIsModalOpen(false);
        fetchProducts();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Operation failed');
      }
    } catch {
      toast.error('Connection error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
        fetchProducts();
      }
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your storefront items.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalog</CardTitle>
          <CardDescription>All products in your store — {products.length} total.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Package className="mb-4 h-12 w-12 opacity-20" />
              <p>No products found. Add one to get started.</p>
            </div>
          ) : (
            <div className="relative overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm text-muted-foreground">
                <thead className="bg-muted text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Added</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b border-border bg-card hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-6 w-6 m-2 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span>{p.name}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">{p.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium">
                          {p.duration || 'Lifetime'}
                        </span>
                      </td>
                      <td className="px-6 py-4">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => openForm(p)} className="p-2 text-muted-foreground hover:text-foreground">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 text-destructive/70 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Product' : 'New Product'}</CardTitle>
              <CardDescription>Fill in the details below to save.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="e.g. Discord Nitro"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="9.99"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {DURATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Image URL</label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="https://example.com/image.png"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full min-h-[72px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Short product description..."
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-border">
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
                    {editingId ? 'Update' : 'Create'}
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
