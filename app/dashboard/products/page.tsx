'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, Pencil, Trash2, Loader2, Package, Globe, Lock, EyeOff, 
  PauseCircle, Settings2, Database, Share2, DollarSign, 
  ChevronDown, Check, Upload, ImageIcon 
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const DURATION_OPTIONS = ['1 Month', '3 Months', 'Lifetime'];
const DELIVERABLE_TYPES = ['Serials', 'Service', 'Dynamic'];
const DELIVERY_METHODS = ['First', 'Last', 'Random'];
const VISIBILITY_OPTIONS = ['Public', 'Private', 'Unlisted', 'Onhold'];
const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' }
];

const CustomSelect = ({ value, onChange, options, label, placeholder }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt: any) => (typeof opt === 'string' ? opt : opt.value) === value);
  const displayLabel = typeof selectedOption === 'string' ? selectedOption : (selectedOption?.label || selectedOption?.value);

  return (
    <div className="relative space-y-1.5 w-full">
      {label && <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm transition-all duration-200 hover:bg-muted/50 ${isOpen ? 'ring-1 ring-primary border-primary' : ''}`}
        >
          <span className={value ? 'text-foreground font-medium' : 'text-muted-foreground'}>
            {displayLabel || placeholder}
          </span>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-xl border border-border bg-card/80 p-1 shadow-2xl backdrop-blur-xl"
              >
                <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                  {options.map((option: any) => {
                    const optValue = typeof option === 'string' ? option : option.value;
                    const optLabel = typeof option === 'string' ? option : option.label;
                    const isSelected = optValue === value;

                    return (
                      <button
                        key={optValue}
                        type="button"
                        onClick={() => {
                          onChange(optValue);
                          setIsOpen(false);
                        }}
                        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          isSelected 
                            ? 'bg-primary/10 text-primary font-bold' 
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span>{optLabel}</span>
                        </div>
                        {isSelected && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState('');
  const [duration, setDuration] = useState('Lifetime');
  const [deliverableType, setDeliverableType] = useState('Serials');
  const [serialsStr, setSerialsStr] = useState(''); // Textarea for mass serial entry
  const [webhookUrl, setWebhookUrl] = useState('');
  const [stock, setStock] = useState('0');
  const [deliveryMethod, setDeliveryMethod] = useState('Random');
  const [visibility, setVisibility] = useState('Public');
  const [currency, setCurrency] = useState('USD');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large (max 5MB)');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.error || 'Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

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
      setInstructions(product.instructions || '');
      setImage(product.image);
      setDuration(product.duration || 'Lifetime');
      setDeliverableType(product.deliverableType || 'Serials');
      setSerialsStr(product.serials?.join('\n') || '');
      setWebhookUrl(product.webhookUrl || '');
      setStock((product.deliverableType === 'Serials' ? product.serials?.length : product.stock)?.toString() || '0');
      setDeliveryMethod(product.deliveryMethod || 'Random');
      setVisibility(product.visibility || 'Public');
      setCurrency(product.currency || 'USD');
    } else {
      setEditingId(null);
      setName('');
      setPrice('');
      setDescription('');
      setInstructions('');
      setImage('');
      setDuration('Lifetime');
      setDeliverableType('Serials');
      setSerialsStr('');
      setWebhookUrl('');
      setStock('0');
      setDeliveryMethod('Random');
      setVisibility('Public');
      setCurrency('USD');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process serials into array
    const serials = serialsStr.split('\n').map(s => s.trim()).filter(s => s !== '');
    
    const payload = { 
      name, 
      price: Number(price), 
      description, 
      instructions,
      image, 
      duration,
      deliverableType,
      serials,
      webhookUrl,
      stock: deliverableType === 'Serials' ? serials.length : Number(stock),
      deliveryMethod,
      visibility,
      currency
    };

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

  const getVisibilityIcon = (v: string) => {
    switch (v) {
      case 'Public': return <Globe className="h-3 w-3" />;
      case 'Private': return <Lock className="h-3 w-3" />;
      case 'Unlisted': return <Share2 className="h-3 w-3" />;
      case 'Onhold': return <PauseCircle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Advanced product management and delivery configuration.</p>
        </div>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle>Catalog</CardTitle>
          <CardDescription>Manage inventory, delivery types, and visibility — {products.length} total.</CardDescription>
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
                <thead className="bg-muted text-xs uppercase text-muted-foreground tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Visibility</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {products.map((p) => (
                    <tr key={p._id} className="bg-card hover:bg-muted/50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-6 w-6 m-2 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold">{p.name}</span>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest">{p.duration}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium">
                        {CURRENCIES.find(c => c.code === (p.currency || 'USD'))?.symbol}{p.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold font-mono ${p.stock > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">
                          {p.deliverableType || 'Serials'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                          p.visibility === 'Public' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' : 
                          p.visibility === 'Onhold' ? 'bg-yellow-500/5 text-yellow-500 border-yellow-500/20' :
                          'bg-zinc-500/5 text-zinc-500 border-zinc-500/20'
                        }`}>
                          {getVisibilityIcon(p.visibility || 'Public')}
                          {p.visibility || 'Public'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openForm(p)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(p._id)} className="p-2 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
          <Card className="w-full max-w-4xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="border-b border-border/50 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{editingId ? 'Edit Product' : 'Create Product'}</CardTitle>
                  <CardDescription>Configure your product delivery and storefront options.</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                    Product #10{editingId?.slice(-2) || 'NEW'}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                      <Settings2 className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-bold uppercase tracking-widest">General Settings</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Name</label>
                        <input
                          type="text" required value={name} onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="e.g. Discord Nitro Monthly"
                        />
                      </div>
                      
                      <CustomSelect
                        label="Currency"
                        value={currency}
                        onChange={setCurrency}
                        options={CURRENCIES.map(c => ({ value: c.code, label: `${c.code} (${c.symbol})` }))}
                      />

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-muted-foreground text-sm">{CURRENCIES.find(c => c.code === currency)?.symbol}</span>
                          <input
                            type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)}
                            className="w-full rounded-lg border border-border bg-muted/30 pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="9.99"
                          />
                        </div>
                      </div>

                      <CustomSelect
                        label="Duration"
                        value={duration}
                        onChange={setDuration}
                        options={DURATION_OPTIONS}
                      />

                      <CustomSelect
                        label="Visibility"
                        value={visibility}
                        onChange={setVisibility}
                        options={[
                          { value: 'Public', label: 'Public', icon: <Globe className="h-3 w-3" /> },
                          { value: 'Private', label: 'Private', icon: <Lock className="h-3 w-3" /> },
                          { value: 'Unlisted', label: 'Unlisted', icon: <Share2 className="h-3 w-3" /> },
                          { value: 'Onhold', label: 'Onhold', icon: <PauseCircle className="h-3 w-3" /> },
                        ]}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Image</label>
                        {image && (
                          <button 
                            type="button" 
                            onClick={() => setImage('')}
                            className="text-[10px] font-bold text-destructive uppercase tracking-widest hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {/* URL Input */}
                        <div className="space-y-1.5">
                          <input
                            type="text" value={image} onChange={(e) => setImage(e.target.value)}
                            className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono text-[11px]"
                            placeholder="Paste image URL here..."
                          />
                        </div>

                        {/* File Upload Area */}
                        <div className="relative group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={isUploading}
                          />
                          <div className={`flex flex-col items-center justify-center gap-3 py-6 rounded-xl border-2 border-dashed transition-all duration-200 ${
                            isUploading ? 'bg-muted border-border' : 'bg-muted/10 border-border/50 group-hover:border-primary group-hover:bg-primary/5'
                          }`}>
                            {isUploading ? (
                              <>
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Uploading...</span>
                              </>
                            ) : image ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="h-16 w-16 rounded-lg overflow-hidden border border-border shadow-md">
                                  <img src={image} alt="Preview" className="h-full w-full object-cover" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Change Image</span>
                              </div>
                            ) : (
                              <>
                                <div className="p-3 rounded-full bg-primary/10 text-primary">
                                  <Upload className="h-5 w-5" />
                                </div>
                                <div className="text-center">
                                  <p className="text-[11px] font-bold text-foreground uppercase tracking-widest">Click or Drag to Upload</p>
                                  <p className="text-[9px] text-muted-foreground mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Short Description</label>
                      <textarea
                        required value={description} onChange={(e) => setDescription(e.target.value)}
                        className="w-full min-h-[80px] rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Explain what the customer is buying..."
                      />
                    </div>
                  </div>

                  {/* Delivery & Advanced */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                      <Database className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-bold uppercase tracking-widest">Delivery Engine</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <CustomSelect
                        label="Deliverable Type"
                        value={deliverableType}
                        onChange={setDeliverableType}
                        options={DELIVERABLE_TYPES}
                      />

                      <CustomSelect
                        label="Delivery Method"
                        value={deliveryMethod}
                        onChange={setDeliveryMethod}
                        options={DELIVERY_METHODS}
                      />
                    </div>

                    {deliverableType === 'Serials' && (
                      <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Serials (One per line)</label>
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">Stock: {serialsStr.split('\n').filter(s => s.trim()).length}</span>
                        </div>
                        <textarea
                          value={serialsStr} onChange={(e) => setSerialsStr(e.target.value)}
                          className="w-full min-h-[120px] rounded-lg border border-border bg-zinc-950 font-mono text-xs px-3 py-2 text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                          placeholder="SERIAL-123&#10;SERIAL-456&#10;SERIAL-789"
                        />
                      </div>
                    )}

                    {deliverableType === 'Dynamic' && (
                      <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Webhook URL</label>
                        <input
                          type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)}
                          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono text-xs"
                          placeholder="https://api.yoursite.com/delivery"
                        />
                        <p className="text-[10px] text-muted-foreground italic">Content will be fetched from this URL upon purchase.</p>
                      </div>
                    )}

                    {(deliverableType === 'Service' || deliverableType === 'Dynamic') && (
                      <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Manual Stock Count</label>
                        <input
                          type="number" value={stock} onChange={(e) => setStock(e.target.value)}
                          className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="99"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5 pt-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        Post-Purchase Instructions
                      </label>
                      <textarea
                        value={instructions} onChange={(e) => setInstructions(e.target.value)}
                        className="w-full min-h-[100px] rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Thank you for your purchase! Here is how to use it..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-8 border-t border-border mt-12 bg-card">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest bg-muted text-muted-foreground hover:bg-muted/80 transition-all active:scale-95"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                  >
                    {editingId ? 'Save ' : 'Release Product'}
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
