'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare, Star, CheckCircle2, Clock, Search,
  MoreVertical, Check, EyeOff, Trash2, Maximize2,
  ChevronDown, ChevronUp, RefreshCw, X, ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

// ── Types ────────────────────────────────────────────────────────────────────
interface Review {
  _id: string;
  email: string;
  productName: string;
  orderId: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'hidden';
  createdAt: string;
}
interface Stats {
  total: number;
  approved: number;
  pending: number;
  avgRating: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${
            s <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'
          }`}
        />
      ))}
    </span>
  );
}

function StatusBadge({ status }: { status: Review['status'] }) {
  const map = {
    pending:  'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    approved: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    hidden:   'bg-zinc-700/60 text-zinc-400 border border-zinc-600/40',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${map[status]}`}>
      {status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
      {status === 'pending'  && <Clock        className="h-3 w-3" />}
      {status === 'hidden'   && <EyeOff       className="h-3 w-3" />}
      {status}
    </span>
  );
}

function SentimentDot({ rating }: { rating: number }) {
  if (rating >= 4) return <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" title="Positive" />;
  if (rating === 3) return <span className="h-2 w-2 rounded-full bg-amber-400  inline-block" title="Neutral"  />;
  return                   <span className="h-2 w-2 rounded-full bg-red-400    inline-block" title="Negative" />;
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteModal({
  reviewId,
  onCancel,
  onConfirm,
}: {
  reviewId: string;
  onCancel: () => void;
  onConfirm: (id: string, permanent: boolean) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
        style={{ animation: 'fadeInScale .18s ease' }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/15">
            <Trash2 className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-white">Delete Feedback</p>
            <p className="text-xs text-zinc-400">Choose how to remove this review.</p>
          </div>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => onConfirm(reviewId, false)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition hover:bg-white/10 text-left"
          >
            <span className="font-medium">Soft Delete</span>
            <span className="block text-xs text-zinc-400">Hidden from lists but recoverable</span>
          </button>
          <button
            onClick={() => onConfirm(reviewId, true)}
            className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/20 text-left"
          >
            <span className="font-medium">Permanent Delete</span>
            <span className="block text-xs text-red-400/70">Cannot be undone</span>
          </button>
        </div>
        <button
          onClick={onCancel}
          className="mt-4 w-full rounded-xl border border-white/10 py-2 text-sm text-zinc-400 hover:text-white transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Full Review Modal ─────────────────────────────────────────────────────────
function FullReviewModal({ review, onClose }: { review: Review; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
        style={{ animation: 'fadeInScale .18s ease' }}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-white">{review.email}</p>
            <p className="text-xs text-zinc-400">
              {review.productName || '—'} · Order #{review.orderId || '—'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-3 flex items-center gap-3">
          <StarRating rating={review.rating} />
          <StatusBadge status={review.status} />
          <span className="ml-auto text-xs text-zinc-500">
            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        <p className="rounded-xl bg-white/5 p-4 text-sm text-zinc-200 leading-relaxed border border-white/5">
          {review.comment}
        </p>
      </div>
    </div>
  );
}

// ── Dropdown Menu ─────────────────────────────────────────────────────────────
function ActionMenu({
  review,
  onAction,
}: {
  review: Review;
  onAction: (action: string, review: Review) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        suppressHydrationWarning
        onClick={() => setOpen((p) => !p)}
        className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div
          className="absolute right-0 z-30 mt-1 w-48 rounded-xl border border-white/10 bg-zinc-900/95 py-1 shadow-2xl backdrop-blur-xl"
          style={{ animation: 'fadeInScale .15s ease' }}
        >
          <MenuItem icon={<Maximize2 className="h-3.5 w-3.5" />}  label="View Full Review"  onClick={() => { onAction('view', review);    setOpen(false); }} />
          {review.status !== 'approved' && (
            <MenuItem icon={<Check    className="h-3.5 w-3.5 text-emerald-400" />} label="Approve" onClick={() => { onAction('approve', review); setOpen(false); }} />
          )}
          {review.status !== 'hidden' && (
            <MenuItem icon={<EyeOff   className="h-3.5 w-3.5 text-amber-400"   />} label="Hide"    onClick={() => { onAction('hide',    review); setOpen(false); }} />
          )}
          {review.status !== 'pending' && (
            <MenuItem icon={<Clock    className="h-3.5 w-3.5 text-zinc-400"    />} label="Set Pending" onClick={() => { onAction('pending', review); setOpen(false); }} />
          )}
          <div className="my-1 border-t border-white/10" />
          <MenuItem
            icon={<Trash2 className="h-3.5 w-3.5 text-red-400" />}
            label="Delete"
            className="text-red-400 hover:bg-red-500/10"
            onClick={() => { onAction('delete', review); setOpen(false); }}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon, label, onClick, className = '',
}: {
  icon: React.ReactNode; label: string; onClick: () => void; className?: string;
}) {
  return (
    <button
      suppressHydrationWarning
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors ${className}`}
    >
      {icon} {label}
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FeedbackPage() {
  const [reviews, setReviews]         = useState<Review[]>([]);
  const [stats, setStats]             = useState<Stats>({ total: 0, approved: 0, pending: 0, avgRating: '0.0' });
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('');
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [viewTarget, setViewTarget]   = useState<Review | null>(null);
  const [refreshing, setRefreshing]   = useState(false);

  const fetchFeedback = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (search)       params.set('search', search);
      if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
      if (ratingFilter) params.set('rating', ratingFilter);

      const res  = await fetch(`/api/admin/feedback?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
        setStats(data.stats);
      }
    } catch {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter, ratingFilter]);

  // Initial + filter-driven fetch
  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  // Auto-refresh every 15 s
  useEffect(() => {
    const id = setInterval(() => fetchFeedback(true), 15000);
    return () => clearInterval(id);
  }, [fetchFeedback]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleAction = (action: string, review: Review) => {
    if (action === 'view')   { setViewTarget(review);   return; }
    if (action === 'delete') { setDeleteTarget(review); return; }
    const statusMap: Record<string, string> = { approve: 'approved', hide: 'hidden', pending: 'pending' };
    patchStatus(review._id, statusMap[action]);
  };

  const patchStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Feedback marked as ${status}`);
        fetchFeedback(true);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch {
      toast.error('Connection error');
    }
  };

  const confirmDelete = async (id: string, permanent: boolean) => {
    setDeleteTarget(null);
    try {
      const url = permanent
        ? `/api/admin/feedback/${id}?permanent=true`
        : `/api/admin/feedback/${id}`;
      const res  = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success(permanent ? 'Feedback permanently deleted' : 'Feedback soft-deleted');
        fetchFeedback(true);
      } else {
        toast.error('Delete failed');
      }
    } catch {
      toast.error('Connection error');
    }
  };

  // ── Stat Cards ─────────────────────────────────────────────────────────────
  const statCards = [
    {
      label: 'Total Feedback',
      value: stats.total,
      icon: <MessageSquare className="h-5 w-5 text-violet-400" />,
      color: 'from-violet-500/10 to-transparent border-violet-500/20',
    },
    {
      label: 'Avg Rating',
      value: stats.avgRating,
      icon: <Star className="h-5 w-5 text-amber-400 fill-amber-400" />,
      color: 'from-amber-500/10 to-transparent border-amber-500/20',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: <Clock className="h-5 w-5 text-orange-400" />,
      color: 'from-orange-500/10 to-transparent border-orange-500/20',
    },
    {
      label: 'Approved',
      value: stats.approved,
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
      color: 'from-emerald-500/10 to-transparent border-emerald-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Feedback</h2>
          <p className="text-sm text-muted-foreground">
            Manage customer reviews and ratings.
          </p>
        </div>
        <button
          suppressHydrationWarning
          onClick={() => fetchFeedback(true)}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 hover:bg-white/10 transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((c) => (
          <div
            key={c.label}
            className={`rounded-xl border bg-gradient-to-br p-4 ${c.color}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">{c.label}</span>
              {c.icon}
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            suppressHydrationWarning
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, product, order…"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition"
          />
        </div>

        {/* Status filter */}
        <select
          suppressHydrationWarning
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 outline-none focus:border-violet-500/50 transition cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="hidden">Hidden</option>
        </select>

        {/* Rating filter */}
        <select
          suppressHydrationWarning
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 outline-none focus:border-violet-500/50 transition cursor-pointer"
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{'★'.repeat(r)} ({r} star{r !== 1 ? 's' : ''})</option>
          ))}
        </select>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl border border-white/10 bg-card">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="text-sm">Loading feedback…</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted-foreground">
            <MessageSquare className="h-12 w-12 opacity-20" />
            <p className="font-medium">No feedback found</p>
            <p className="text-xs">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-4 py-3 text-left font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold">Product / Order</th>
                  <th className="px-4 py-3 text-left font-semibold">Rating</th>
                  <th className="px-4 py-3 text-left font-semibold">Review</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r, idx) => {
                  const expanded = expandedId === r._id;
                  const isLong   = r.comment.length > 80;
                  return (
                    <tr
                      key={r._id}
                      className={`border-b border-white/5 transition-colors hover:bg-white/[0.03] ${
                        idx % 2 === 0 ? '' : 'bg-white/[0.015]'
                      }`}
                    >
                      {/* Email */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <SentimentDot rating={r.rating} />
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-white">{r.email}</span>
                            <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" aria-label="Verified Purchase" />
                          </div>
                        </div>
                      </td>

                      {/* Product / Order */}
                      <td className="px-4 py-3">
                        <p className="font-medium text-white truncate max-w-[140px]">{r.productName || '—'}</p>
                        <p className="text-xs text-zinc-500 font-mono">{r.orderId ? `#${r.orderId.slice(-8)}` : '—'}</p>
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StarRating rating={r.rating} />
                      </td>

                      {/* Review */}
                      <td className="px-4 py-3 max-w-[240px]">
                        <p className={`text-zinc-300 text-xs leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
                          {r.comment}
                        </p>
                        {isLong && (
                          <button
                            onClick={() => setExpandedId(expanded ? null : r._id)}
                            className="mt-1 flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 transition"
                          >
                            {expanded
                              ? <><ChevronUp className="h-3 w-3" /> Collapse</>
                              : <><ChevronDown className="h-3 w-3" /> Expand</>
                            }
                          </button>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-zinc-500">
                        {new Date(r.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={r.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <ActionMenu review={r} onAction={handleAction} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {deleteTarget && (
        <DeleteModal
          reviewId={deleteTarget._id}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
      {viewTarget && (
        <FullReviewModal review={viewTarget} onClose={() => setViewTarget(null)} />
      )}

      <style jsx global>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(.96); }
          to   { opacity: 1; transform: scale(1);   }
        }
      `}</style>
    </div>
  );
}
