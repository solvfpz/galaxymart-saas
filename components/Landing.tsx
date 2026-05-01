/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Shield, 
  MessageCircle, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  ExternalLink, 
  Twitter, 
  Instagram, 
  User,
  ChevronDown,
  Menu,
  X,
  ShoppingBag,
  Home,
  Star,
  FileText,
  Layout,
  Send,
  Plus,
  Minus,
  CreditCard,
  Wallet,
  Bitcoin,
  ArrowLeft,
  CheckCircle2,
  Command,
  Maximize2,
  Sun,
  Moon,
  Rocket,
  ShieldCheck,
  Gem,
  Headphones,
  Tag,
  Loader2,
  Package,
  Clock,
  Copy,
  XCircle,
  RefreshCw,
  Phone,
  MapPin,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Hero } from './Hero';

// Removed static PRODUCT_DATA to ensure 100% database-driven app.

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none"
      >
        <motion.div 
          className={`
            flex items-center justify-between h-11 rounded-xl px-5 
            border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] 
            w-full max-w-[750px] transition-all duration-500 relative
            pointer-events-auto
            ${isScrolled ? 'bg-zinc-900/80 backdrop-blur-3xl' : 'bg-zinc-900/40 backdrop-blur-2xl'}
          `}
        >
          <div className="flex items-center gap-3 relative z-10">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 via-blue-400 to-cyan-300 shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent)]"></div>
              </div>
              <span className="text-[15px] font-bold tracking-tighter text-white">Galaxy Boosts</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center gap-8 relative z-10">
            <div className="flex items-center gap-6">
              {['Features', 'Products', 'Reviews', 'FAQ', 'TOS'].map((item) => (
                <a 
                  key={item}
                  className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors duration-300 tracking-wide" 
                  href={`#${item.toLowerCase()}`}
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="relative group flex flex-col items-center justify-center">
              {/* Interaction Circle (Customer Support Button) */}
              <button className="w-9 h-9 rounded-full bg-black border border-white/[0.08] flex items-center justify-center shadow-lg hover:bg-[#111] hover:border-white/[0.15] hover:scale-105 cursor-pointer transition-all duration-300 relative z-20 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/>
                  <path d="M21 16v2a4 4 0 0 1-4 4h-5"/>
                </svg>
              </button>

              {/* Popup Menu (Reveals on Hover, Drops Downwards) */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 -translate-y-3 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto z-10">
                {/* Floating Black Panel */}
                <div className="bg-black rounded-xl w-32 p-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,1)] border border-white/[0.08] backdrop-blur-md transition-all duration-300 group-hover:border-white/[0.12] group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,1),0_0_20px_rgba(255,255,255,0.03)]">
                  <div className="flex flex-col gap-3 text-left">
                    <a href="https://discord.gg/galaxymart" className="text-xs font-medium text-zinc-100 tracking-wide transition-colors hover:text-white">Discord</a>
                    <a href="https://t.me/galxymart" className="text-xs font-medium text-zinc-500 tracking-wide transition-colors hover:text-zinc-300">Telegram</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            className="md:hidden p-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-zinc-950 border-l border-white/5 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 via-blue-400 to-cyan-300 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent)]"></div>
                  </div>
                  <span className="font-bold text-lg text-white">GALAXY BOOSTS</span>
                </div>
                <button 
                  className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-8 px-6">
                <div className="flex flex-col space-y-2">
                  {[
                    { name: 'Home', icon: <Home className="w-5 h-5" />, href: '/' },
                    { name: 'Features', icon: <Zap className="w-5 h-5" />, href: '#features' },
                    { name: 'Products', icon: <ShoppingBag className="w-5 h-5" />, href: '#products' },
                    { name: 'Reviews', icon: <Star className="w-5 h-5" />, href: '#reviews' },
                    { name: 'FAQ', icon: <MessageCircle className="w-5 h-5" />, href: '#faq' },
                    { name: 'TOS', icon: <FileText className="w-5 h-5" />, href: '#tos' }
                  ].map((item, i) => (
                    <motion.a 
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 py-4 px-4 rounded-xl hover:bg-white/5 text-lg font-medium text-zinc-400 hover:text-white transition-all duration-200 group" 
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="text-zinc-500 group-hover:text-blue-500 transition-colors">
                        {item.icon}
                      </div>
                      <span className="flex-1">{item.name}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </motion.a>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-zinc-900/50 backdrop-blur-sm">
                <div className="flex flex-col gap-3">
                  <a className="w-full py-3.5 flex items-center justify-center gap-2 font-medium bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20" href="https://discord.gg/WpbDuTcAQH">
                    <MessageCircle className="w-4 h-4" />
                    <span>Join Discord</span>
                  </a>
                  <a className="w-full py-3.5 flex items-center justify-center gap-2 font-medium bg-sky-500 text-white rounded-xl transition-all duration-200 shadow-lg shadow-sky-500/20" href="https://t.me/boosts">
                    <Send className="w-4 h-4" />
                    <span>Join Telegram</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};



const Features = () => {
  const branches = [
    {
      icon: <Rocket className="w-5 h-5" />,
      title: "Instant Delivery",
      desc: "Automated delivery system that works within seconds",
      glowColor: "rgba(34, 211, 238, 0.15)"
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "100% Safe",
      desc: "Fully compliant with Discord's terms of service",
      glowColor: "rgba(16, 185, 129, 0.15)"
    },
    {
      icon: <Gem className="w-5 h-5" />,
      title: "Premium Quality",
      desc: "Real, high-quality boosts from verified sources",
      glowColor: "rgba(139, 92, 246, 0.15)"
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      title: "24/7 Support",
      desc: "Round-the-clock assistance whenever you need help",
      glowColor: "rgba(99, 102, 241, 0.15)"
    }
  ];

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="relative max-w-[1400px] mx-auto px-4 flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-4 z-10">
        {/* Left Node: Main Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-[45%] flex flex-col justify-center relative group"
        >
          <div className="glass-panel rounded-3xl p-8 sm:p-10 relative overflow-hidden h-full flex flex-col justify-center">
            {/* Inner Liquid Glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-brand-primary/20 blur-[50px] rounded-full animate-morph group-hover:bg-brand-primary/30 transition-colors duration-700"></div>

            <div className="flex items-center gap-2 mb-6 relative z-10">
              <div className="h-3 w-px bg-white/10"></div>
              <span className="uppercase text-xs font-normal text-zinc-500 tracking-[0.2em]">Galaxyboosts</span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4 relative z-10 leading-tight">
              Why choose<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">GalaxyBoosts?</span>
            </h2>
            
            <p className="text-zinc-400 text-lg font-light leading-relaxed mb-8 max-w-[90%] relative z-10">
              Experience premium Discord server features with our instant boost delivery system.
            </p>

            <div className="mt-auto relative z-10">
              <a href="#reviews" className="group/btn inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-full text-sm font-normal transition-all duration-300 border border-white/10 hover:border-white/20 shadow-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/0 via-brand-primary/10 to-brand-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                <span>View Reviews</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Mobile Connector */}
        </motion.div>

        {/* Right Node: Bento Branches */}
        <div className="w-full lg:w-[40%] flex flex-col justify-between gap-4 z-10">
          {branches.map((branch, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel glass-panel-hover group rounded-2xl p-5 transition-all duration-500 ease-out cursor-pointer relative overflow-hidden flex items-center gap-5"
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-0 ease-out"
                style={{ background: `linear-gradient(to right, transparent, ${branch.glowColor}, transparent)` }}
              ></div>
              
              <div className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-500">
                {branch.icon}
              </div>
              <div className="flex-1 relative z-10">
                <h3 className="text-base font-medium text-white tracking-tight mb-1">{branch.title}</h3>
                <p className="text-sm font-light text-zinc-500 leading-snug">{branch.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProductCard = ({ product, index }: { product: any, index: number }) => {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stock, setStock] = useState(product.stock || 0);

  useEffect(() => {
    const pollStock = async () => {
      try {
        const res = await fetch(`/api/products/${product._id || product.id}`);
        const data = await res.json();
        if (data.success) setStock(data.product.stock);
      } catch (err) {}
    };
    const interval = setInterval(pollStock, 10000);
    return () => clearInterval(interval);
  }, [product]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const currencySymbol = product.currency === 'EUR' ? '€' : '$';
  const displayPrice = typeof product.price === 'number' ? `${currencySymbol}${product.price.toFixed(2)}` : product.price;
  const displayDuration = product.duration || '1 Month';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative bg-[#080d17] border border-white/5 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 shadow-2xl"
    >
      {/* Interactive Mouse Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08), transparent 80%)`,
        }}
      />

      <div className="relative z-10 p-4 flex flex-col h-full">
        {/* Product Image Section */}
        <div className="relative w-full aspect-[16/10] mb-3 overflow-hidden rounded-xl border border-white/5 bg-[#0a0f1a]">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-zinc-900">
              <Package className="w-10 h-10 text-white/10" />
            </div>
          )}
          
          {/* Stock Badge Overlay */}
          {stock > 0 && stock < 10 && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 backdrop-blur-md">
              <span className="text-[10px] font-black text-red-400 uppercase tracking-wider animate-pulse">
                Only {stock} left!
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="mb-3">
          <h3 className="text-[16px] font-bold text-white mb-1 tracking-tight group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-blue-500 tracking-tight">{displayPrice}</span>
            <span className="text-zinc-500 text-[11px] font-medium uppercase tracking-wider">/ {displayDuration}</span>
          </div>
        </div>
        
        {/* Features List */}
        <ul className="space-y-1.5 mb-5 flex-1">
          {[
            'Quality Product & Fresh',
            'Instant Delivery',
            '24/7 Support'
          ].map((feat, i) => (
            <li key={i} className="flex items-center gap-2 text-[12px] text-zinc-400 font-medium">
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-blue-400" />
              </div>
              {feat}
            </li>
          ))}
        </ul>

        {/* Action Button */}
        <button
          onClick={() => router.push(`/product/${product.id ?? product._id}`)}
          disabled={stock === 0}
          className="w-full h-10 rounded-xl bg-blue-600 text-white text-[12px] font-bold tracking-tight transition-all duration-300 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 disabled:grayscale relative overflow-hidden"
          style={{ boxShadow: '0 4px 20px rgba(37, 99, 235, 0.2)' }}
        >
          {stock === 0 ? 'Out of Stock' : 'Purchase Now'}
        </button>
      </div>
    </motion.div>
  );
};




const Products = ({ dbProducts }: { dbProducts?: any[] }) => {
  const [activeTab, setActiveTab] = useState('all'); // Simplified tab logic for dynamic data

  const displayProducts = dbProducts || [];

  return (
    <section id="products" className="py-24 relative overflow-hidden">
      {/* Background glow behind cards */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(30, 40, 150, 0.12) 0%, transparent 70%)' }} />
      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary mb-6">
            Our Products
          </h2>
          <p className="text-zinc-400 text-lg">
            Choose the perfect package to level up your Discord community
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-16">
          <button
            className="px-8 py-3 rounded-xl font-medium transition-all duration-300 border border-brand-primary bg-brand-primary/10 text-brand-primary shadow-lg shadow-brand-primary/20"
          >
            All Products
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {displayProducts.length > 0 ? (
              displayProducts.map((p: any, i: number) => (
                <ProductCard key={p._id || i} product={p} index={i} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-zinc-500">
                No products available at the moment.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const Timer = ({ expiresAt, onExpire }: { expiresAt: string, onExpire: () => void }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(expiresAt).getTime() - new Date().getTime();
      if (difference <= 0) {
        onExpire();
        return '00:00';
      }
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    setTimeLeft(calculateTime());
    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  return <span className="font-mono tabular-nums">{timeLeft}</span>;
};

const CopyButton = ({ text, label }: { text: string, label: string }) => {
  const copy = () => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, {
      style: { background: 'rgba(24, 24, 27, 0.9)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }
    });
  };
  return (
    <button onClick={copy} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white">
      <Copy size={16} />
    </button>
  );
};

const QRView = ({ address }: { address: string }) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}&bgcolor=18181b&color=ffffff&margin=10`;
  return (
    <div className="relative group p-4 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center">
      <div className="absolute inset-0 bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all rounded-full" />
      <img src={qrUrl} alt="QR Code" className="relative z-10 w-32 h-32 rounded-xl" />
    </div>
  );
};

const InvoiceView = ({ data, onBack, onComplete }: { data: any, onBack: () => void, onComplete: () => void }) => {
  const [status, setStatus] = useState<'pending' | 'paid' | 'manual_paid' | 'confirmed' | 'expired' | 'delivered'>('pending');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orderProduct, setOrderProduct] = useState<any>(null);
  const [deliveredItems, setDeliveredItems] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    setIsSubmitted(true);
    toast.success('Thanks for your feedback!');
  };

  const checkStatus = async () => {
    try {
      const res = await fetch(`/api/payments/verify?paymentId=${data.paymentId}`);
      const result = await res.json();
      
      if (result.status === 'delivered') {
        setStatus('delivered');
        if (result.product) setOrderProduct(result.product);
        if (result.deliveredItems) setDeliveredItems(result.deliveredItems);
      } else if (result.status === 'paid' || result.status === 'manual_paid' || result.status === 'confirmed') {
        setStatus(result.status as any);
        if (result.product) setOrderProduct(result.product);
        if (result.deliveredItems) setDeliveredItems(result.deliveredItems);
      } else if (result.status === 'expired') {
        setStatus('expired');
      } else if (result.status === 'pending') {
        setStatus('pending');
      }
    } catch (err) {
      console.error('Verify error:', err);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [data.paymentId]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await checkStatus();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return { 
          stepIndex: 0, 
          message: 'Waiting for Payment',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10 border-blue-500/30'
        };
      case 'paid':
      case 'manual_paid':
      case 'confirmed':
        return { 
          stepIndex: 2, 
          message: (status === 'manual_paid' || status === 'confirmed') ? 'Manually Verified' : 'Payment Confirmed',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/30'
        };
      case 'delivered':
        return { 
          stepIndex: 4, 
          message: 'Order Delivered!',
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10 border-purple-500/30'
        };
      case 'expired':
        return { 
          stepIndex: -1, 
          message: 'Invoice Expired',
          color: 'text-red-400',
          bgColor: 'bg-red-500/10 border-red-500/30'
        };
      default:
        return { 
          stepIndex: 0, 
          message: 'Waiting for Payment',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10 border-blue-500/30'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const steps = [
    { label: 'Waiting for Payment' },
    { label: 'Transaction Detected' },
    { label: 'Confirming on Blockchain' },
    { label: 'Payment Confirmed' },
    { label: 'Order Delivered' },
  ];

  const getStepState = (idx: number) => {
    if (status === 'delivered') return idx <= 4 ? 'done' : 'idle';
    if (status === 'paid' || status === 'manual_paid' || status === 'confirmed') return idx <= 3 ? 'done' : idx === 3 ? 'active' : 'idle';
    if (status === 'expired') return 'idle';
    if (status === 'pending') return idx === 0 ? 'active' : 'idle';
    return 'idle';
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data.walletAddress || 'ltc1')}&bgcolor=111111&color=ffffff&margin=10`;

  return (
    <div className="w-full max-w-5xl mx-auto px-2 py-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
            <Bitcoin size={20} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Complete Your Payment</p>
            <p className="text-zinc-500 text-xs">Secure crypto checkout</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Secure</span>
        </div>
      </div>

      {/* ── Payment Success Layout ── */}
      {(['paid', 'manual_paid', 'confirmed', 'delivered'].includes(status)) ? (
        <div className="min-h-screen flex flex-col justify-center py-12 animate-in fade-in zoom-in duration-700">
          {/* Payment Verified Header */}
          <div className="flex flex-col items-center text-center px-6 pt-4 pb-6">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)]">
              <CheckCircle2 size={40} className="text-white" />
            </div>
            <h3 className="text-[32px] font-bold text-white mt-5">Payment Verified!</h3>
            <p className="text-[16px] text-white/45 mt-2">Your assets have been successfully provisioned.</p>
          </div>

          {/* Separator */}
          <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)', marginBottom: '28px' }} />

          {/* Two Column Grid */}
          <div className="max-w-[1000px] mx-auto px-6 pb-8" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'stretch' }}>
            {/* Left Column - Delivery Details */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-5">
                <Package className="w-5 h-5 text-blue-400" />
                <span className="text-[13px] font-bold text-white/40 uppercase tracking-[0.16em]">Delivery Details</span>
              </div>
              {deliveredItems && deliveredItems.length > 0 ? (
                <div className="space-y-3">
                  {deliveredItems.map((serial: string, i: number) => (
                    <div key={i} className="flex items-center justify-between bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4">
                      <code className="text-blue-400 font-mono text-[15px]">{serial}</code>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(serial);
                          toast.success('Copied!');
                        }}
                        className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-all"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                  <p className="text-[14px] text-zinc-400 leading-relaxed">Your service is being provisioned. Please check your email for instructions.</p>
                </div>
              )}
              {orderProduct?.instructions && (
                <div className="mt-5 pt-5 border-t border-white/[0.06]">
                  <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Post-Purchase Instructions</p>
                  <p className="text-[15px] leading-[1.7] text-white/50">{orderProduct.instructions}</p>
                </div>
              )}

              {/* Contact Support Button */}
              <a 
                href="https://discord.gg/WpbDuTcAQH"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-auto pt-6 border-t border-white/[0.06]"
              >
                <button className="w-full flex items-center justify-center gap-3 bg-white/[0.05] border border-white/10 rounded-xl px-5 py-4 text-[15px] text-white/60 hover:bg-white/[0.08] hover:text-white transition-all">
                  <MessageCircle size={20} />
                  Contact Support
                </button>
              </a>
            </div>

            {/* Right Column - Rate Your Experience */}
            <AnimatePresence>
              {status === 'delivered' ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl p-8 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-bold text-white/35 uppercase tracking-[0.18em]">Rate your experience</span>
                  </div>

                  {isSubmitted ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-8 space-y-3">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 size={32} className="text-emerald-500" />
                      </div>
                      <p className="text-[13px] font-bold text-white uppercase tracking-widest">Feedback Submitted!</p>
                      <p className="text-[12px] text-zinc-500">Thank you for helping us improve.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitFeedback} className="flex flex-col flex-1">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 group cursor-pointer w-max mb-4">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setRating(s)}
                              onMouseEnter={() => setHoveredRating(s)}
                              onMouseLeave={() => setHoveredRating(0)}
                              className="transition-transform active:scale-90 p-1"
                            >
                              <Star 
                                size={28}
                                className={`transition-all ${
                                  s <= (hoveredRating || rating)
                                    ? 'text-white fill-white drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                                    : 'text-zinc-800'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex-1 mb-4">
                        <p className="text-[12px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Your Comments</p>
                        <textarea 
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="How can we make your experience better?"
                          className="w-full h-[120px] bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 text-[14px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/30 transition-all resize-none"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full h-[50px] rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[14px] font-semibold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                      >
                        Submit Feedback
                      </button>
                    </form>
                  )}
                </motion.div>
              ) : (
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl p-5 flex items-center justify-center">
                  <p className="text-[11px] text-zinc-500">Feedback will appear after delivery</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ════ LEFT COLUMN ════ */}
          <div className="space-y-3">
            {/* Invoice Card */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#0d1117]/80 backdrop-blur-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Invoice</span>
                <span className="text-[10px] font-bold text-blue-400">{data.paymentId || '—'}</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Product',     value: data.productName || '—',              icon: false },
                  { label: 'Email',       value: data.email || data.customerEmail || '—', icon: false },
                  { label: 'Total (USD)', value: `$${data.usdAmount ?? '—'}`,           icon: false },
                  { label: 'Coin',        value: 'Litecoin (LTC)',                      icon: true  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-zinc-500 text-sm">{row.label}</span>
                    <span className="text-white text-sm font-semibold flex items-center gap-1.5">
                      {row.icon && <Bitcoin size={11} className="text-zinc-500" />}
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Send Exactly Card */}
            <div className="rounded-2xl border border-blue-500/25 bg-[#0a1628]/90 backdrop-blur-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Send Exactly</span>
                {data.ltcPriceAtTime && (
                  <span className="text-[10px] text-zinc-500">
                    ● 1 LTC = ${Number(data.ltcPriceAtTime).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[2.4rem] font-black text-white tracking-tighter tabular-nums leading-none">
                  {data.ltcAmount ?? '—'}
                </span>
                <span className="text-blue-400 font-black text-base uppercase">LTC</span>
              </div>
              <p className="text-zinc-500 text-xs mt-2">≈ ${data.usdAmount} USD at current rate</p>
            </div>

            {/* Wallet Address Card */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#0d1117]/80 backdrop-blur-xl p-5">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-3">Wallet Address</span>
              <div className="flex items-center gap-3 bg-zinc-950 border border-white/[0.05] rounded-xl px-4 py-3">
                <span className="text-zinc-300 text-xs font-mono flex-1 truncate">
                  {data.walletAddress || 'No address'}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(data.walletAddress || '');
                    toast.success('Address copied!', {
                      style: { background: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' }
                    });
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white text-xs font-bold transition-all active:scale-95 shrink-0"
                >
                  <Copy size={11} />
                  Copy
                </button>
              </div>
            </div>

            {/* Timer Row - Hide when paid/delivered */}
            {(status === 'pending') && (
              <div className="rounded-2xl border border-white/[0.07] bg-[#0d1117]/80 backdrop-blur-xl px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-blue-400" />
                  <span className="text-zinc-400 text-sm">Payment expires in</span>
                </div>
                <span className="text-base font-black tabular-nums font-mono text-white">
                  {data.expiresAt
                    ? <Timer expiresAt={data.expiresAt} onExpire={() => setStatus('expired')} />
                    : '—'}
                </span>
              </div>
            )}

            {/* Back to Store */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors group pt-2 pl-1"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Store
            </button>
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div className="flex flex-col gap-4">
            {/* QR Code Card */}
            <div className="flex-1 rounded-2xl border border-white/[0.07] bg-[#0d1117]/80 backdrop-blur-xl p-8 flex flex-col items-center justify-center">
              <div className="relative p-4 bg-white rounded-3xl mb-6 shadow-[0_0_40px_rgba(255,255,255,0.05)]">
                <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
                <div className="absolute inset-0 border-4 border-black/10 rounded-3xl" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-widest">Litecoin QR</h3>
              <p className="text-zinc-500 text-xs">Scan with your wallet app</p>
            </div>

            {/* Status Steps Card */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#0d1117]/80 backdrop-blur-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Transaction Status</span>
                <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${statusInfo.bgColor} ${statusInfo.color}`}>
                  {statusInfo.message}
                </div>
              </div>
              
              <div className="space-y-4">
                {steps.map((step, idx) => {
                  const state = getStepState(idx);
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                        state === 'done' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
                        state === 'active' ? 'bg-blue-400 animate-pulse' :
                        'bg-zinc-800'
                      }`} />
                      <span className={`text-xs font-medium transition-colors duration-500 ${
                        state === 'done' ? 'text-zinc-300' :
                        state === 'active' ? 'text-white' :
                        'text-zinc-600'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-full mt-6 py-2.5 rounded-xl border border-white/5 bg-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                {isRefreshing ? 'Syncing...' : 'Refresh Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SuccessPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen pt-32 pb-24 px-4 bg-black flex flex-col items-center justify-center text-center"
    >
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
          className="relative z-10 w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.5)]"
        >
          <CheckCircle2 className="w-16 h-16 text-white" />
        </motion.div>
      </div>
      
      <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white mb-6">Payment Secured</h1>
      <p className="text-zinc-500 text-lg font-medium max-w-md mx-auto mb-12 leading-relaxed">
        Your high-performance boosts are being provisioned. A confirmation protocol has been sent to your terminal.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mx-auto">
        <button 
          onClick={onBack}
          className="px-8 py-4 bg-zinc-900 border border-white/5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-zinc-800 transition-all active:scale-95"
        >
          Back to Store
        </button>
        <button 
          className="px-8 py-4 bg-blue-600 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
        >
          View Dashboard
        </button>
      </div>
    </motion.div>
  );
};

export const ProductDetailPage = ({ dbProducts }: { dbProducts?: any[] }) => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const product = (dbProducts || []).find((p: any) => p._id === id || p.id === id);
  const [liveStock, setLiveStock] = useState(product?.stock || 0);

  useEffect(() => {
    if (!product) return;
    const pollStock = async () => {
      try {
        const res = await fetch(`/api/products/${product?._id || product?.id}`);
        const data = await res.json();
        if (data.success) setLiveStock(data.product.stock);
      } catch (err) {}
    };
    const interval = setInterval(pollStock, 5000);
    return () => clearInterval(interval);
  }, [product]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setAppliedCoupon(data.coupon);
        setCouponCode('');
        toast.success(`Coupon applied: ${data.coupon.discount}% off!`);
      } else {
        setCouponError(data.message || 'Invalid coupon code');
        toast.error(data.message || 'Invalid coupon code');
      }
    } catch (err) {
      setCouponError('Failed to validate coupon');
      toast.error('Validation error');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!customerEmail || !customerEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsProcessingOrder(true);
    
    const payload = {
      productId: product?._id || product?.id,
      productDetails: {
        quantity: quantity,
        email: customerEmail,
        coupon: appliedCoupon?.code || ''
      }
    };

    console.log('Payment Request:', JSON.stringify(payload, null, 2));

    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log('Payment Response:', JSON.stringify(data, null, 2));

      if (res.ok && data.success) {
        setInvoiceData(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.success('Invoice created successfully!');
      } else {
        toast.error(data.message || 'Failed to initialize payment');
      }
    } catch (err) {
      console.error('Payment Error:', err);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-brand-bg">
        <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
        <button onClick={() => router.push('/')} className="px-6 py-2 bg-brand-primary rounded-full text-white">Go Back</button>
      </div>
    );
  }

  if (isSuccess) {
    return <SuccessPage onBack={() => { setIsSuccess(false); setInvoiceData(null); router.push('/'); }} />;
  }

  const currencySymbol = product.currency === 'EUR' ? '€' : '$';
  const numericPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price.replace(/[^\d.]/g, ''));
  const subtotal = numericPrice * quantity;
  const discountAmount = appliedCoupon ? (subtotal * (appliedCoupon.discount / 100)) : 0;
  const totalPrice = (subtotal - discountAmount).toFixed(2);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen overflow-hidden bg-[#060607] flex items-center"
    >
      {/* Back / Continue Shopping Button at Top Left */}
      <button 
        onClick={() => {
          if (invoiceData) setInvoiceData(null);
          else router.push('/');
        }}
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all group z-50 backdrop-blur-md"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-medium">{invoiceData ? 'Cancel Payment' : 'Continue Shopping'}</span>
      </button>

      <main className="mx-auto w-full py-16 px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between max-w-[1080px] mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="text-xs font-bold tracking-tight text-white">GB</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{invoiceData ? 'Payment Invoice' : 'Checkout'}</div>
              <div className="text-[11px] text-zinc-500">{invoiceData ? 'Secure Litecoin Gateway' : 'Secure purchase'}</div>
            </div>
          </div>
        </div>

        {invoiceData ? (
          <InvoiceView 
            data={invoiceData} 
            onBack={() => setInvoiceData(null)} 
            onComplete={() => setIsSuccess(true)}
          />
        ) : (
          <section className="grid gap-5 max-w-[1080px] mx-auto w-full" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
            {/* Left: Product Info */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl overflow-hidden flex flex-col w-full" style={{ backdropFilter: 'blur(10px)' }}>
              <div className="p-7 flex flex-col flex-1">
                {/* Product Header */}
                <div className="mb-5">
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="font-display text-[24px] font-bold tracking-tight text-white">{product.name}</h1>
                    <div className="flex items-baseline gap-2 shrink-0 ml-4">
                      <span className="text-[22px] font-bold text-white">
                        {typeof product.price === 'number' ? `${currencySymbol}${product.price.toFixed(2)}` : product.price}
                      </span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">incl. taxes</span>
                    </div>
                  </div>
                  <p className="text-[14px] text-white/50 leading-[1.7]">
                    {(product.perks || [product.description]).join(" • ")}. High-quality service with instant delivery.
                  </p>
                </div>

                {/* Product Image - Full width */}
                <div className="relative w-full rounded-xl overflow-hidden mb-4" style={{ height: 'clamp(240px, 32vh, 340px)' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Stock Badge */}
                <div className="mt-4">
                  {liveStock === 0 ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest">Out of Stock</span>
                    </div>
                  ) : liveStock < 10 ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/10 px-4 py-2">
                      <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
                      <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest">Only {liveStock} left!</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-4 py-2">
                      <span className="h-2 w-2 rounded-full bg-zinc-400"></span>
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{liveStock} items in stock</span>
                    </div>
                  )}
                </div>

                {/* Trust Row */}
                <div className="mt-auto pt-5">
                  <div className="pt-5 border-t border-white/[0.06]">
                    <div className="flex items-center justify-center gap-8 text-[12px] text-white/35">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        <span>Secure</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span>Instant Delivery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>24/7 Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Checkout Panel */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl overflow-hidden flex flex-col w-full" style={{ backdropFilter: 'blur(10px)' }}>
              <div className="p-6 flex flex-col flex-1 justify-between h-full">
                {/* Order Summary Header */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
                  <h2 className="text-[11px] font-bold text-white/40 uppercase tracking-[0.12em]">Order Summary</h2>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    <Lock className="w-3 h-3" />
                    Secure
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-[0.12em]">Quantity</label>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Max 10</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 py-2 px-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 active:scale-90 transition-all disabled:opacity-40"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="text-sm font-bold text-white">{quantity}</div>
                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 active:scale-90 transition-all disabled:opacity-40"
                      disabled={quantity >= 10}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-4">
                  <div className="flex items-center justify-center rounded-xl border border-brand-primary/30 bg-brand-primary/10 py-3">
                    <div className="flex items-center gap-2">
                      <Bitcoin className="w-4 h-4 text-brand-primary" />
                      <span className="text-[11px] font-bold text-brand-primary uppercase tracking-widest">Crypto Payment</span>
                    </div>
                  </div>
                </div>

                {/* Customer Email */}
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-white/40 uppercase tracking-[0.12em] mb-2.5">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand-primary transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/[0.06] text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-primary/50 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="mb-5">
                  <label className="block text-[11px] font-bold text-white/40 uppercase tracking-[0.12em] mb-2.5">Coupon Code</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1 group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-brand-primary transition-colors">
                        <Tag className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/[0.06] text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-primary/50 transition-all text-sm"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode}
                      className="px-6 rounded-xl bg-white/5 border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 disabled:opacity-40"
                    >
                      {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-3 flex items-center justify-between px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                        "{appliedCoupon.code}" applied - {appliedCoupon.discount}% off!
                      </span>
                      <button 
                        onClick={() => setAppliedCoupon(null)}
                        className="text-emerald-400 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {couponError && (
                    <div className="mt-3 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[11px] font-bold text-red-400 uppercase tracking-widest">
                      {couponError}
                    </div>
                  )}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Pricing Breakdown */}
                <div className="mb-4 pt-4 border-t border-white/[0.06]">
                  <div className="flex justify-between text-sm text-white/50 mb-2">
                    <span>Subtotal</span>
                    <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-emerald-400 mb-2">
                      <span>Discount ({appliedCoupon.discount}%)</span>
                      <span>-{currencySymbol}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-3">
                    <span className="text-[11px] font-bold text-white/60 uppercase tracking-[0.12em]">Total</span>
                    <div className="text-right">
                      <span className="text-[26px] font-bold text-white">{currencySymbol}{totalPrice}</span>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Secure Checkout</div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCreateOrder}
                  disabled={isProcessingOrder || liveStock === 0}
                  className="w-full h-[50px] rounded-[2rem] bg-brand-primary text-white text-sm font-bold uppercase tracking-[0.15em] shadow-xl shadow-brand-primary/25 hover:bg-blue-500 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:grayscale relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10 flex items-center justify-center gap-2.5">
                    {isProcessingOrder ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Initialize Payment
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </motion.div>
  );
};


const Magnetic = ({ children }: { children: React.ReactNode; key?: React.Key }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const Footer = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const sections = [
    {
      title: "Support",
      links: ["Help Center", "Terms of Service", "Privacy Policy", "Refund Policy", "Status"]
    },
    {
      title: "Community",
      links: ["Discord Server", "Twitter", "Reviews", "FAQ", "Partners"]
    }
  ];

  return (
    <footer 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative bg-black pt-24 pb-10 overflow-hidden border-t border-white/5 w-full"
    >
      {/* Sheryians-style Large Text Effect */}
      <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none">
        <div className="relative text-center">
          {/* Outlined Background Text */}
          <div className="flex flex-col leading-[0.75]">
            <h1 
              className="text-[16vw] font-black tracking-tighter opacity-10"
              style={{ 
                WebkitTextStroke: '1px rgba(255, 255, 255, 0.5)',
                color: 'transparent'
              }}
            >
              GALAXY
            </h1>
            <h1 
              className="text-[16vw] font-black tracking-tighter opacity-10"
              style={{ 
                WebkitTextStroke: '1px rgba(255, 255, 255, 0.5)',
                color: 'transparent'
              }}
            >
              BOOSTS
            </h1>
          </div>
          
          {/* Reveal Text with Mouse Mask */}
          <div className="absolute inset-0 flex flex-col leading-[0.75]">
            <h1 
              className="text-[16vw] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400"
              style={{ 
                maskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                WebkitMaskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`
              }}
            >
              GALAXY
            </h1>
            <h1 
              className="text-[16vw] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400"
              style={{ 
                maskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
                WebkitMaskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`
              }}
            >
              BOOSTS
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-8 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-24">
          <div className="lg:col-span-1">
            <Magnetic>
              <a className="text-3xl font-bold text-white tracking-tighter mb-6 block" href="/">
                GalaxyBoosts
              </a>
            </Magnetic>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[200px]">
              The leading provider for premium Discord enhancement products and accounts.
            </p>
          </div>

          <div className="lg:col-span-3 flex gap-12 lg:justify-end">
            {sections.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-white font-bold mb-8 uppercase text-[10px] tracking-[0.3em] opacity-30">{s.title}</h3>
              <ul className="space-y-4">
                {s.links.map((link, j) => (
                  <li key={j}>
                    <a className="text-zinc-500 hover:text-white transition-all duration-300 text-sm font-medium flex items-center group" href="#">
                      <span className="w-0 group-hover:w-2 h-[1px] bg-blue-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
          </div>
        </div>

        <div className="pt-12 border-t border-white/5"></div>
      </div>
    </footer>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`rounded-xl transition-all duration-300 border ${
        isOpen ? 'bg-[#18181b] border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]' : 'bg-[#0a0a0a] border-white/[0.03] hover:bg-[#111] hover:border-white/10'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
      >
        <span className={`font-bold tracking-tight transition-colors duration-300 ${isOpen ? 'text-blue-400' : 'text-white'} text-base sm:text-lg`}>{question}</span>
        <div className={`shrink-0 ml-4 p-2 rounded-lg transition-all duration-300 ${isOpen ? 'bg-blue-500/10' : 'bg-white/5'}`}>
          {isOpen ? (
            <Minus className="w-4 h-4 text-blue-500 transition-transform duration-300" />
          ) : (
            <Plus className="w-4 h-4 text-blue-500 transition-transform duration-300" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-zinc-500 text-sm sm:text-base leading-relaxed font-medium">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { formatDistanceToNow } from 'date-fns';

const ReviewCard = React.memo(({ review }: { review: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = review.reviewText.length > 150;
  
  return (
    <div 
      className="w-[300px] sm:w-[350px] shrink-0 bg-zinc-900/60 rounded-xl p-5 border border-white/10 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300 will-change-transform"
    >
      <div>
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < review.starRating ? 'text-white fill-white' : 'text-zinc-700 fill-zinc-700'}`} />
          ))}
        </div>
        
        {/* Comment */}
        <div className="relative">
          <p className={`text-zinc-300 text-sm leading-relaxed font-medium transition-all duration-300 ${!isExpanded && isLong ? 'line-clamp-3' : ''}`}>
            "{review.reviewText}"
          </p>
          {isLong && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="text-blue-400 text-[11px] font-bold mt-1 hover:underline uppercase tracking-wider"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-zinc-500 text-[11px] font-mono">{review.email}</span>
        <span className="text-zinc-600 text-[11px] font-medium">
          {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : 'Recently'}
        </span>
      </div>
    </div>
  );
});

ReviewCard.displayName = 'ReviewCard';

const ReviewSkeleton = () => (
  <div className="w-[300px] sm:w-[350px] shrink-0 bg-zinc-900/40 rounded-xl p-5 border border-white/5 animate-pulse">
    <div className="flex gap-1 mb-4">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-3 h-3 bg-white/5 rounded-full" />)}
    </div>
    <div className="space-y-2 mb-6">
      <div className="h-3 bg-white/5 rounded w-full" />
      <div className="h-3 bg-white/5 rounded w-5/6" />
      <div className="h-3 bg-white/5 rounded w-4/6" />
    </div>
    <div className="flex justify-between border-t border-white/5 pt-4">
      <div className="h-2 bg-white/5 rounded w-20" />
      <div className="h-2 bg-white/5 rounded w-12" />
    </div>
  </div>
);

const Marquee = ({ items }: { items: any[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const displayItems = [...items, ...items, ...items, ...items];

  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();
    
    const scroll = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (containerRef.current && !isHovered && !isDragging) {
        containerRef.current.scrollLeft += (delta * 0.06); 
        
        const singleSetWidth = containerRef.current.scrollWidth / 4;
        if (containerRef.current.scrollLeft >= singleSetWidth * 2) {
           containerRef.current.scrollLeft -= singleSetWidth;
        } else if (containerRef.current.scrollLeft <= 0) {
           containerRef.current.scrollLeft += singleSetWidth;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setScrollLeft(containerRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5; 
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex gap-5 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing w-full py-4 select-none scroll-smooth will-change-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
    >
      {displayItems.map((review, idx) => (
        <ReviewCard key={`${review._id || idx}-${idx}`} review={review} />
      ))}
    </div>
  );
};

const ReviewsSection = () => {
  const [reviewsData, setReviewsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        const data = await res.json();
        if (data.success) {
          setReviewsData(data);
        }
      } catch (e) {
        console.error('Failed to fetch reviews:', e);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  return (
    <section id="reviews" className="py-16 bg-black relative overflow-hidden w-full border-y border-white/5">
      <div className="max-w-[1400px] mx-auto relative px-4 sm:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full relative"
        >
          {loading ? (
            <div className="flex gap-5 overflow-hidden py-4">
              {[1, 2, 3, 4].map(i => <ReviewSkeleton key={i} />)}
            </div>
          ) : reviewsData?.reviews?.length > 0 ? (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none hidden sm:block" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none hidden sm:block" />
              <Marquee items={reviewsData.reviews} />
            </>
          ) : (
            <div className="py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Star className="w-6 h-6 text-zinc-600" />
              </div>
              <p className="text-zinc-500 font-medium tracking-tight">No reviews yet. Be the first to leave one!</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default function Landing({ dbProducts }: { dbProducts?: any[] }) {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);


  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-brand-primary/30 selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <Products dbProducts={dbProducts} />
      
      <ReviewsSection />

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-black relative overflow-hidden w-full">
        <div className="max-w-[1200px] mx-auto px-8 relative">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="h-1 w-16 bg-blue-600 rounded-full mx-auto"></div>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-2">
            {[
              { q: "Is it safe for my server?", a: "Yes, our boosts are 100% safe and follow Discord's Terms of Service. We use high-quality accounts and safe delivery methods." },
              { q: "How long does it take?", a: "Our delivery system is fully automated and usually takes less than 5 minutes from payment confirmation." },
              { q: "What is your refund policy?", a: "We offer full refunds if we are unable to fulfill your order within 24 hours. Customer satisfaction is our priority." },
              { q: "Do you offer bulk discounts?", a: "Yes, we have custom pricing for large orders. Please join our Discord server to discuss bulk requirements." },
              { q: "What payment methods do you accept?", a: "We currently prioritize Litecoin (LTC) for its speed and low fees, ensuring your order is processed instantly." }
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
