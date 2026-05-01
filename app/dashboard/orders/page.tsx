'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, ShoppingCart, CheckCircle, Clock, MoreVertical, Search, Filter, ExternalLink, CreditCard, Truck, RefreshCw, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Order {
  _id: string;
  customerEmail: string;
  productId?: { name?: string; _id?: string };
  amount: number;
  usdAmount: number;
  ltcAmount: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'expired' | 'manual_paid' | 'paid';
  quantity: number;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG = {
  pending: { color: 'yellow', glow: 'shadow-yellow-500/20', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: Clock },
  confirmed: { color: 'blue', glow: 'shadow-blue-500/20', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', icon: CheckCircle },
  delivered: { color: 'emerald', glow: 'shadow-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle },
  expired: { color: 'red', glow: 'shadow-red-500/20', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', icon: XCircle },
  manual_paid: { color: 'blue', glow: 'shadow-blue-400/20', bg: 'bg-blue-400/10', text: 'text-blue-400', border: 'border-blue-400/30', icon: CreditCard },
  paid: { color: 'green', glow: 'shadow-green-500/20', bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', icon: CheckCircle },
};

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Paid' },
  { key: 'manual_paid', label: 'Manual' },
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

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const prevOrders = [...orders];

    setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus as Order['status'] } : o));
    setOpenMenuId(null);

    try {
      const endpoint = newStatus === 'manual_paid'
        ? `/api/orders/${id}/manual`
        : `/api/orders/${id}`;

      const method = newStatus === 'manual_paid' ? 'PATCH' : 'PUT';
      const body = newStatus === 'manual_paid' ? undefined : JSON.stringify({ status: newStatus });

      const res = await fetch(endpoint, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body,
      });

      if (res.ok) {
        toast.success(`Order marked as ${newStatus.replace('_', ' ')}`);
      } else {
        throw new Error('Update failed');
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
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    const glowClass = `status-glow-${config.color}`;

    return (
      <span className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border',
        config.bg, config.text, config.border,
        'shadow-lg', config.glow, glowClass
      )}>
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Orders
          </h2>
          <p className="text-muted-foreground mt-1">Manage your customer transactions with manual controls.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="px-3 py-1 rounded-full bg-card border border-border">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-1 p-1 rounded-xl bg-card/50 backdrop-blur-sm border border-border">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by email or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-3xl rounded-full" />
            <ShoppingCart className="relative h-24 w-24 text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No orders found</h3>
          <p className="text-muted-foreground max-w-sm">
            {searchQuery ? 'Try adjusting your search or filter criteria.' : 'Orders will appear here once customers make purchases.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => {
            const { date, time } = formatDate(order.createdAt);
            const isUpdating = updatingId === order._id;

            return (
              <div
                key={order._id}
                className={cn(
                  'group relative rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl p-6',
                  'transition-all duration-300 hover:scale-[1.02] hover:border-border hover:shadow-2xl hover:shadow-primary/5',
                  'before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-primary/5 before:to-blue-500/5 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100',
                  isUpdating && 'opacity-70 pointer-events-none'
                )}
              >
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground font-bold text-lg flex-shrink-0 shadow-lg shadow-primary/20">
                      {getEmailInitial(order.customerEmail)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{order.customerEmail}</h3>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {order.productId?.name || <span className="italic">Deleted Product</span>}
                        </span>
                        <span>×{order.quantity}</span>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-semibold text-foreground">${order.usdAmount?.toFixed(2) || order.amount.toFixed(2)}</span>
                        {order.ltcAmount && (
                          <span className="text-xs text-muted-foreground">
                            {order.ltcAmount.toFixed(8)} LTC
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{date}</p>
                      <p className="text-xs text-muted-foreground/70">{time}</p>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === order._id ? null : order._id)}
                        className="p-2 rounded-lg hover:bg-muted/50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </button>

                      {openMenuId === order._id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-10 z-50 w-48 rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl py-1 overflow-hidden">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => updateStatus(order._id, 'manual_paid')}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-500/10 transition-colors flex items-center gap-2 text-blue-400"
                              >
                                <CreditCard className="h-4 w-4" />
                                Mark as Paid (Manual)
                              </button>
                            )}

                            {(order.status === 'pending' || order.status === 'confirmed') && (
                              <button
                                onClick={() => updateStatus(order._id, 'confirmed')}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-500/10 transition-colors flex items-center gap-2 text-blue-400"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Mark as Confirmed
                              </button>
                            )}

                            {(order.status === 'pending' || order.status === 'confirmed') && (
                              <button
                                onClick={() => updateStatus(order._id, 'delivered')}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-500/10 transition-colors flex items-center gap-2 text-emerald-400"
                              >
                                <Truck className="h-4 w-4" />
                                Mark as Delivered
                              </button>
                            )}

                            {order.status !== 'pending' && (
                              <button
                                onClick={() => updateStatus(order._id, 'pending')}
                                className="w-full text-left px-4 py-2.5 text-sm hover:bg-yellow-500/10 transition-colors flex items-center gap-2 text-yellow-400"
                              >
                                <RefreshCw className="h-4 w-4" />
                                Mark as Pending
                              </button>
                            )}

                            <button
                              onClick={() => updateStatus(order._id, 'expired')}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-500/10 transition-colors flex items-center gap-2 text-red-400"
                            >
                              <XCircle className="h-4 w-4" />
                              Mark as Expired
                            </button>

                            <div className="border-t border-border my-1" />

                            <button
                              onClick={() => window.open(`/invoice/${order._id}`, '_blank')}
                              className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors flex items-center gap-2 text-muted-foreground"
                            >
                              <Eye className="h-4 w-4" />
                              View Invoice
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {isUpdating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-2xl">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
