'use client';

import { useState, useEffect } from 'react';
import { Loader2, ShoppingCart, CheckCircle, MoreVertical, Search, Truck, RefreshCw, XCircle, Eye, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Order {
  _id: string;
  customerEmail: string;
  productId?: { name?: string; _id?: string };
  amount: number;
  usdAmount: number;
  ltcAmount: number;
  paymentStatus?: 'unpaid' | 'paid';
  status: 'pending' | 'confirmed' | 'delivered' | 'expired' | 'manual';
  quantity: number;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/10' },
  confirmed: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/10' },
  delivered: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', glow: 'shadow-green-500/10' },
  expired: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-red-500/10' },
  manual: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-purple-500/10' },
};

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'manual', label: 'Manual' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'expired', label: 'Expired' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const toggleMenu = (id: string | null) => {
    setOpenMenuId(prev => prev === id ? null : id);
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    let filtered = orders;

    if (activeTab !== 'all') {
      filtered = filtered.filter(o => o.status === activeTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.customerEmail.toLowerCase().includes(query) ||
        o._id.toLowerCase().includes(query) ||
        o.paymentId.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, activeTab, searchQuery]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenuId(null);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const prevOrders = [...orders];

    setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus as Order['status'] } : o));
    setOpenMenuId(null);

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Order marked as ${newStatus}`);
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (err) {
      setOrders(prevOrders);
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getEmailInitial = (email: string) => email.charAt(0).toUpperCase();

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

    return (
      <span className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-sm backdrop-blur-md',
        config.bg, config.text, config.border, config.glow
      )}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Orders
          </h2>
          <p className="text-sm text-zinc-400 mt-0.5">Manage your customer transactions.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="px-2.5 py-1 rounded-full bg-zinc-800/50 border border-white/10 text-xs">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 p-1 rounded-lg bg-zinc-900/60 border border-white/10 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap',
                activeTab === tab.key
                  ? 'bg-zinc-700/60 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by email or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-zinc-900/60 border border-white/10 text-sm text-foreground placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingCart className="h-12 w-12 text-zinc-600 mb-4" />
          <h3 className="text-base font-medium text-foreground mb-1">No orders found</h3>
          <p className="text-sm text-zinc-500 max-w-sm">
            {searchQuery ? 'Try adjusting your search or filter criteria.' : 'Orders will appear here once customers make purchases.'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-zinc-900/40 overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto_auto] items-center gap-3 px-4 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider border-b border-white/5">
            <span className="w-7"></span>
            <span>Customer</span>
            <span className="hidden md:block">Product</span>
            <span className="text-right">Amount</span>
            <span>Status</span>
            <span className="hidden sm:block">Date</span>
            <span className="w-28"></span>
          </div>

          <div className="divide-y divide-white/5">
            {filteredOrders.map((order) => {
              const date = formatDate(order.createdAt);
              const isUpdating = updatingId === order._id;
              const isMenuOpen = openMenuId === order._id;

              return (
                <div
                  key={order._id}
                  className={cn(
                    'grid grid-cols-[auto_1fr_1fr_auto_auto_auto_auto] items-center gap-3 px-4 py-2.5',
                    'hover:bg-white/5 transition-colors duration-150',
                    isUpdating && 'opacity-50 pointer-events-none'
                  )}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {getEmailInitial(order.customerEmail)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{order.customerEmail}</p>
                  </div>

                  <div className="min-w-0 hidden md:block">
                    <p className="text-xs text-zinc-400 truncate">
                      {order.productId?.name || <span className="italic">Deleted Product</span>}
                      <span className="text-zinc-600 ml-1">×{order.quantity}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">${order.usdAmount?.toFixed(2) || order.amount.toFixed(2)}</p>
                    <p className="text-xs text-zinc-500 hidden lg:block">{order.ltcAmount?.toFixed(8)} LTC</p>
                  </div>

                  <div>{getStatusBadge(order.status)}</div>

                  <div className="hidden sm:block">
                    <p className="text-xs text-zinc-500">{date}</p>
                  </div>

                  <div className="relative flex items-center justify-end w-28">
                    <div className="flex items-center gap-0.5">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(order._id, 'confirmed')}
                          disabled={isUpdating}
                          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-green-400 disabled:opacity-30"
                          title="Confirm"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}

                      {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'manual') && (
                        <button
                          onClick={() => updateStatus(order._id, 'delivered')}
                          disabled={isUpdating}
                          className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-blue-400 disabled:opacity-30"
                          title="Deliver"
                        >
                          <Truck className="h-4 w-4" />
                        </button>
                      )}

                      <button
                        onClick={() => toggleMenu(order._id)}
                        className={cn(
                          'p-1.5 rounded-lg hover:bg-white/5 transition-colors',
                          isMenuOpen ? 'text-zinc-200 bg-white/5' : 'text-zinc-500 hover:text-zinc-300'
                        )}
                        title="More actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {isMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-[60] bg-black/40" onClick={() => setOpenMenuId(null)} />
                        <div
                          className="absolute right-0 top-10 z-[70] w-52 rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-md shadow-2xl py-1 overflow-hidden"
                          style={{ animation: 'dropdownIn 150ms ease-out' }}
                        >
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(order._id, 'confirmed')}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2.5 text-zinc-300"
                            >
                              <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                              Mark as Confirmed
                            </button>
                          )}

                          <button
                            onClick={() => updateStatus(order._id, 'manual')}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2.5 text-zinc-300"
                          >
                            <Zap className="h-3.5 w-3.5 text-purple-400" />
                            Mark as Manual
                          </button>

                          {(order.status === 'pending' || order.status === 'confirmed') && (
                            <button
                              onClick={() => updateStatus(order._id, 'delivered')}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2.5 text-zinc-300"
                            >
                              <Truck className="h-3.5 w-3.5 text-blue-400" />
                              Mark as Delivered
                            </button>
                          )}

                          {order.status !== 'pending' && order.status !== 'expired' && (
                            <button
                              onClick={() => updateStatus(order._id, 'pending')}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2.5 text-zinc-300"
                            >
                              <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
                              Reset to Pending
                            </button>
                          )}

                          {order.status !== 'expired' && (
                            <button
                              onClick={() => updateStatus(order._id, 'expired')}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2.5 text-zinc-300"
                            >
                              <XCircle className="h-3.5 w-3.5 text-red-400" />
                              Mark as Expired
                            </button>
                          )}

                          <div className="border-t border-white/5 my-1" />

                          <button
                            onClick={() => window.open(`/invoice/${order._id}`, '_blank')}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors flex items-center gap-2.5 text-zinc-400"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Invoice
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
