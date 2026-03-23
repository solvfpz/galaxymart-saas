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
  Tag,
  Loader2,
  Package
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
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none"
      >
        <motion.div 
          className={`
            flex items-center justify-between h-12 rounded-xl px-4 
            border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] 
            w-full max-w-[900px] transition-all duration-500 relative
            pointer-events-auto
            ${isScrolled ? 'bg-zinc-900/80 backdrop-blur-2xl' : 'bg-zinc-900/40 backdrop-blur-xl'}
          `}
        >
          <div className="flex items-center gap-2.5 relative z-10">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 via-blue-400 to-cyan-300 shadow-inner relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent)]"></div>
              </div>
              <span className="font-bold text-[14px] tracking-tight text-white">GALAXY BOOSTS</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              {['Features', 'Products', 'Reviews', 'TOS'].map((item) => (
                <a 
                  key={item}
                  className="text-[12px] font-medium text-zinc-400 hover:text-white transition-colors duration-300" 
                  href={`#${item.toLowerCase()}`}
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="relative group flex flex-col items-center justify-center">
              {/* Interaction Circle (Customer Support Button) */}
              <button className="w-8 h-8 rounded-full bg-black border border-white/[0.08] flex items-center justify-center shadow-lg hover:bg-[#111] hover:border-white/[0.15] hover:scale-105 cursor-pointer transition-all duration-300 relative z-20 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/>
                  <path d="M21 16v2a4 4 0 0 1-4 4h-5"/>
                </svg>
              </button>

              {/* Popup Menu (Reveals on Hover, Drops Downwards) */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 -translate-y-3 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto z-10">
                {/* Floating Black Panel */}
                <div className="bg-black rounded-xl w-32 p-4 shadow-[0_20px_40px_-10px_rgba(0,0,0,1)] border border-white/[0.08] backdrop-blur-md transition-all duration-300 group-hover:border-white/[0.12] group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,1),0_0_20px_rgba(255,255,255,0.03)]">
                  <div className="flex flex-col gap-3 text-left">
                    <a href="https://discord.gg/WpbDuTcAQH" className="text-xs font-medium text-zinc-100 tracking-wide transition-colors hover:text-white">Discord</a>
                    <a href="https://t.me/boosts" className="text-xs font-medium text-zinc-500 tracking-wide transition-colors hover:text-zinc-300">Telegram</a>
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
      icon: <Zap className="w-5 h-5" />,
      title: "Instant Delivery",
      desc: "Automated delivery system that works within seconds",
      glowColor: "rgba(34, 211, 238, 0.1)" // Cyan
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "100% Safe",
      desc: "Fully compliant with Discord's terms of service",
      glowColor: "rgba(16, 185, 129, 0.1)" // Emerald
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Premium Quality",
      desc: "Real, high-quality boosts from verified sources",
      glowColor: "rgba(139, 92, 246, 0.1)" // Purple
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "24/7 Support",
      desc: "Round-the-clock assistance whenever you need help",
      glowColor: "rgba(99, 102, 241, 0.1)" // Brand Primary
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden">
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
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">boosts.to?</span>
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
              
              <div className="shrink-0 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-brand-primary group-hover:border-brand-primary/20 group-hover:bg-brand-primary/10 transition-all duration-300">
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

const ProductCard = ({ product, index }: any) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const currencySymbol = product.currency === 'EUR' ? '€' : '$';
  const displayPrice = typeof product.price === 'number'
    ? `${currencySymbol}${product.price.toFixed(2)}`
    : product.price;
  const displayDuration = product.duration || 'Lifetime';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl bg-zinc-900/40 border border-white/5 p-6 hover:border-brand-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-brand-primary/10 overflow-hidden flex flex-col h-full backdrop-blur-sm"
    >
      {/* Gradient Hover Effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 80%)`,
        }}
      />

      {/* Large Background Graphic */}
      <div className="absolute -right-4 -top-4 text-8xl font-black text-white/[0.02] select-none pointer-events-none group-hover:text-brand-primary/[0.05] transition-colors duration-500">
        {product.name.split(' ')[0]}
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-brand-primary">{displayPrice}</span>
              <span className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider">/ {displayDuration}</span>
            </div>
            {stock > 0 && (
              stock < 10 ? (
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest animate-pulse">Only {stock} left!</span>
              ) : (
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stock} items left</span>
              )
            )}
          </div>
        </div>
        
        <ul className="space-y-3 mb-8 flex-1">
          {(product.perks || [product.description || 'High Quality', 'Instant Delivery', '24/7 Support']).slice(0, 3).map((perk: string, j: number) => (
            <li key={j} className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-1 h-1 rounded-full bg-brand-primary/60" />
              {perk}
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-4 text-center">
          <button
            onClick={() => router.push(`/product/${product.id ?? product._id}`)}
            disabled={stock === 0}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-brand-primary text-white text-[12px] font-bold transition-all duration-300 border border-white/10 hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/20 disabled:opacity-30 disabled:grayscale disabled:hover:bg-white/5 disabled:hover:border-white/10"
          >
            {stock === 0 ? 'Not Available' : 'Purchase Now'}
          </button>
          
          <AnimatePresence>
            {stock === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]"
              >
                Out of Stock
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-center pt-4 border-t border-white/5">
            <div className="flex gap-1.5 opacity-50">
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
              <div className={`w-1 h-1 rounded-full ${stock === 0 ? 'bg-red-500/40' : 'bg-brand-primary/40'}`} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};




const Products = ({ dbProducts }: { dbProducts?: any[] }) => {
  const [activeTab, setActiveTab] = useState('all'); // Simplified tab logic for dynamic data

  const displayProducts = dbProducts || [];

  return (
    <section id="products" className="py-24 relative overflow-hidden">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

export const ProductDetailPage = ({ dbProducts }: { dbProducts?: any[] }) => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [showToast, setShowToast] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  
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

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

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
      } else {
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (err) {
      setCouponError('Failed to validate coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handlePurchase = async () => {
    if (!customerEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsProcessingOrder(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id || product.id,
          customerEmail,
          amount: Number(totalPrice),
          status: 'confirmed' // Simulate successful payment for now
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Order placed successfully!');
        setLiveStock((prev: number) => Math.max(0, prev - 1));
        const orderId = data._id || data.id;
        router.push(`/invoice/${orderId}`);
      } else {
        toast.error('Failed to create order');
      }
    } catch (err) {
      toast.error('Transaction failed');
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
      className="relative min-h-screen pt-24 pb-20 px-4"
    >
      {/* Back / Continue Shopping Button at Top Left */}
      <button 
        onClick={() => router.push('/')}
        className="absolute top-6 left-4 sm:top-8 sm:left-8 flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition-all group backdrop-blur-md z-50 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Continue Shopping</span>
      </button>

      <main className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/50 shadow-sm backdrop-blur-xl">
              <span className="text-sm font-bold tracking-tight text-white">GB</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Checkout</div>
              <div className="text-xs text-zinc-500">Secure purchase</div>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-xs text-zinc-500 sm:flex">
            <Shield className="w-4 h-4 text-brand-primary" />
            <span>Encrypted Connection</span>
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left: Product Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 shadow-sm backdrop-blur-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
                  <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-white">{product.name}</h1>
                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                      {(product.perks || [product.description]).join(" • ")}. High-quality service with instant delivery guaranteed.
                    </p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold tracking-tight text-white">
                      {typeof product.price === 'number' ? `${currencySymbol}${product.price.toFixed(2)}` : product.price}
                    </div>
                    <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">incl. taxes</div>
                  </div>
                </div>

                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/5 bg-white/5 group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent"></div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-8 relative z-10 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-brand-primary/10 blur-[60px] rounded-full"></div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {liveStock === 0 ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-500/10 bg-red-500/5 px-4 py-2 backdrop-blur-xl">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Out of Stock</span>
                    </div>
                  ) : liveStock < 10 ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-red-400/10 bg-red-400/5 px-4 py-2 backdrop-blur-xl">
                      <span className="h-2 w-2 rounded-full bg-red-400"></span>
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Only {liveStock} left!</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-500/10 bg-zinc-500/5 px-4 py-2 backdrop-blur-xl">
                      <span className="h-2 w-2 rounded-full bg-zinc-500"></span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{liveStock} items left</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Right: Checkout Panel */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-white/10 bg-zinc-900/40 shadow-sm backdrop-blur-xl">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest opacity-50">Order Summary</h2>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    <Lock className="w-3 h-3" />
                    Secure
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-bold text-white uppercase tracking-widest">Quantity</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Max 10</div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-white hover:bg-zinc-800 active:scale-90 transition-all disabled:opacity-50 shadow-sm"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <div className="text-sm font-bold text-white">{quantity}</div>

                    <button
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-white hover:bg-zinc-800 active:scale-90 transition-all disabled:opacity-50 shadow-sm"
                      disabled={quantity >= 10}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <label className="block text-xs font-bold text-white uppercase tracking-widest mb-4">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'crypto', icon: <Bitcoin className="w-4 h-4" />, label: 'Crypto' },
                      { id: 'card', icon: <CreditCard className="w-4 h-4" />, label: 'Card' },
                      { id: 'wallet', icon: <Wallet className="w-4 h-4" />, label: 'Wallet' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-300 ${
                          paymentMethod === method.id 
                            ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-lg shadow-brand-primary/10' 
                            : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                        }`}
                      >
                        {method.icon}
                        <span className="text-[8px] font-bold uppercase tracking-wider">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="mb-8">
                  <label className="block text-xs font-bold text-white uppercase tracking-widest mb-4">Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors"
                      disabled={isApplyingCoupon || !!appliedCoupon}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim() || !!appliedCoupon}
                      className="px-4 py-2 rounded-xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                      {isApplyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="mt-2 text-[10px] text-red-400 font-medium">{couponError}</p>}
                  {appliedCoupon && (
                    <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {appliedCoupon.code} applied! (-{appliedCoupon.discount}%)
                        </span>
                      </div>
                      <button 
                        onClick={() => setAppliedCoupon(null)}
                        className="p-1 hover:bg-white/5 rounded-full transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Summary Rows */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-zinc-500 font-medium">Subtotal</div>
                    <div className="font-bold text-white">{currencySymbol}{subtotal.toFixed(2)}</div>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-emerald-400 font-medium">Discount ({appliedCoupon.discount}%)</div>
                      <div className="font-bold text-emerald-400">-{currencySymbol}{discountAmount.toFixed(2)}</div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-zinc-500 font-medium">Processing Fee</div>
                    <div className="font-bold text-emerald-400">Free</div>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">Total</div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Taxes included</div>
                    </div>
                    <div className="text-xl font-bold tracking-tight text-white">{currencySymbol}{totalPrice}</div>
                  </div>
                </div>

                {/* Email Section */}
                <div className="mb-8">
                  <label className="block text-xs font-bold text-white uppercase tracking-widest mb-4">Customer Email</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors mb-2"
                  />
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-1">Delivery details will be sent here</p>
                </div>

                {/* Buy Button */}
                <button
                  onClick={handlePurchase}
                  disabled={isProcessingOrder || liveStock === 0}
                  className="group relative w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary px-4 py-4 text-sm font-bold text-white shadow-xl shadow-brand-primary/20 transition-all duration-300 hover:bg-brand-secondary active:scale-[0.98] overflow-hidden disabled:opacity-50 disabled:grayscale"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isProcessingOrder ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : liveStock === 0 ? (
                      <>
                        <Package className="w-4 h-4 opacity-50" />
                        Out of Stock
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Buy Now
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>

                <div className="mt-4 text-center text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                  By continuing, you agree to our <span className="text-zinc-300">Terms of Service</span>.
                </div>

                {/* Toast Notification */}
                <AnimatePresence>
                  {showToast && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="mt-6 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 border border-emerald-400/20">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">Ready to pay</div>
                          <div className="mt-1 text-xs text-zinc-400">Redirecting to secure {paymentMethod} gateway...</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
};
const Stats = () => {
  const stats = [
    { icon: <MessageCircle className="w-6 h-6" />, value: "10,000", label: "Positive Reviews" },
    { icon: <Zap className="w-6 h-6" />, value: "50,000", label: "Boosts Delivered" },
    { icon: <Shield className="w-6 h-6" />, value: "5,000", label: "Happy Customers" }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary mb-6">
            Trusted by many clients
          </h2>
          <p className="text-zinc-400 text-lg">
            Join thousands of satisfied customers who trust our services
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-white/5 p-8 hover:border-brand-primary/20 hover:bg-zinc-900/60 transition-all duration-300 shadow-sm backdrop-blur-sm"
            >
              <div className="relative z-10">
                <div className="mb-6 p-3.5 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/10 w-fit">
                  <div className="text-brand-primary group-hover:text-brand-accent transition-colors duration-300">
                    {s.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary mb-2">
                  {s.value}+
                </div>
                <div className="text-zinc-400 text-lg group-hover:text-white transition-colors duration-300">
                  {s.label}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How fast is the delivery?",
      a: "Our delivery is instant and automated through our Discord bot integration. Once your payment is confirmed, your boosts will be applied to your server within seconds."
    },
    {
      q: "Are the boosts permanent?",
      a: "Boosts last for the duration specified in the package (1 or 3 months). You'll receive a notification before they expire, and you can easily renew them through your dashboard."
    },
    {
      q: "Is this service safe to use?",
      a: "Yes, our service is completely safe and compliant with Discord's terms of service. We use secure payment processing and protect your personal information with industry-standard encryption."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards, PayPal, and various cryptocurrency options. All payments are processed securely through our trusted payment partners."
    },
    {
      q: "What if I need help with my order?",
      a: "Our 24/7 support team is always ready to help! You can reach us through our Discord server or contact form, and we typically respond within minutes."
    }
  ];

  return (
    <section id="faq" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 text-lg">
            Got questions? We've got answers! If you can't find what you're looking for, reach out to our support team.
          </p>
        </motion.div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-white/5 transition-all duration-300 shadow-sm backdrop-blur-sm"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left p-6 focus:outline-none hover:bg-white/5 transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white group-hover:text-brand-primary transition-colors duration-300">
                    {faq.q}
                  </h3>
                  <div className="ml-4 flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 group-hover:bg-brand-primary/10 transition-all duration-300">
                      <ChevronDown className={`h-4 w-4 text-brand-primary transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>
              </button>
              <div className={`faq-content overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-40' : 'max-h-0'}`}>
                <div className="p-6 pt-0">
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
      title: "Products",
      links: ["Discord Boosts", "Nitro", "Lifetime Boosts", "Reseller Program", "Boost Bots"]
    },
    {
      title: "Company",
      links: ["About Us", "Contact", "Careers", "Blog", "Press Kit"]
    },
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
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-24">
          <div className="col-span-2 lg:col-span-1">
            <Magnetic>
              <a className="text-3xl font-bold text-white tracking-tighter mb-6 block" href="/">
                boosts<span className="text-blue-500">.to</span>
              </a>
            </Magnetic>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-[200px]">
              The leading provider for premium Discord enhancement products and accounts.
            </p>
            <div className="flex items-center gap-4 mt-8">
              {[Twitter, MessageCircle, Instagram].map((Icon, i) => (
                <Magnetic key={i}>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

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

        <div className="pt-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-8 text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
              <span>© 2026 GALAXY BOOSTS</span>
              <div className="hidden md:flex items-center gap-6">
                <a className="hover:text-white transition-colors" href="#">Terms</a>
                <a className="hover:text-white transition-colors" href="#">Privacy</a>
                <a className="hover:text-white transition-colors" href="#">Cookies</a>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.1em]">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Landing({ dbProducts }: { dbProducts?: any[] }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-white selection:bg-brand-primary/20 relative">
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <Products dbProducts={dbProducts} />
        
        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 relative">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-left"
              >
                <h2 className="font-display text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-accent mb-6">
                  Ready to boost your Discord server?
                </h2>
                <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                  Join thousands of satisfied customers who have already enhanced their Discord experience. Get started in minutes with our instant delivery system.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/login" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl text-base font-medium relative overflow-hidden hover:shadow-xl hover:shadow-brand-primary/40 transition-all duration-300">
                    <span>Admin Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a href="https://discord.gg/WpbDuTcAQH" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900/40 hover:bg-brand-primary/20 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300 text-base font-medium hover:border-brand-primary/30">
                    <MessageCircle className="w-5 h-5" />
                    Join Discord
                  </a>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-2xl blur-3xl"></div>
                <div className="relative rounded-2xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Why choose us?</h3>
                  <div className="space-y-4">
                    {[
                      { icon: <Zap className="w-5 h-5" />, title: "Instant Delivery", desc: "Get your boosts within seconds of purchase" },
                      { icon: <Shield className="w-5 h-5" />, title: "Secure & Safe", desc: "100% compliant with Discord's terms" },
                      { icon: <MessageCircle className="w-5 h-5" />, title: "24/7 Support", desc: "Our team is always here to help you" },
                      { icon: <Lock className="w-5 h-5" />, title: "Money-Back Guarantee", desc: "Full refund if you're not satisfied" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4 group">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary group-hover:text-brand-accent transition-colors">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="text-zinc-100 font-medium mb-1 group-hover:text-white transition-colors">{item.title}</h4>
                          <p className="text-zinc-400 text-sm group-hover:text-zinc-300 transition-colors">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Stats />
        <section id="reviews" className="py-24 relative">
          <div className="max-w-[1400px] mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="font-display text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary mb-6">
                What our customers say
              </h2>
              <p className="text-zinc-400 text-lg">
                Join thousands of satisfied customers who trust our services
              </p>
            </motion.div>
            <div className="max-w-3xl mx-auto mb-12">
              <div className="text-center py-8">
                <div className="animate-pulse flex flex-col items-center space-y-4">
                  <div className="rounded-full bg-brand-primary/20 h-12 w-12 flex items-center justify-center">
                    <User className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div className="h-4 bg-brand-primary/20 rounded w-3/4 max-w-xs"></div>
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-5 w-5 bg-brand-primary/30 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
