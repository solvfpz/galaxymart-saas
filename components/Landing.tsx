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
import { Hero } from './Hero';
import AnimatedLogo from './AnimatedLogo';

// Removed static PRODUCT_DATA to ensure 100% database-driven app.

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
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
            w-[calc(100vw-32px)] sm:w-full sm:max-w-[750px] transition-all duration-500 relative
            pointer-events-auto
            ${isScrolled ? 'bg-zinc-900/80 backdrop-blur-3xl' : 'bg-zinc-900/40 backdrop-blur-2xl'}
          `}
        >
          <div className="flex items-center gap-3 relative z-10">
            <a href="/" className="flex items-center gap-2.5 group">
              <AnimatedLogo className="h-9 w-9" />
              <span className="text-[15px] font-bold tracking-tighter text-white">Galaxy Boosts</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center gap-8 relative z-10">
            <div className="flex items-center gap-6">
              {['Features', 'Products', 'Reviews', 'FAQ', 'TOS'].map((item) => (
                item === 'TOS' ? (
                  <a
                    key={item}
                    className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors duration-300 tracking-wide"
                    href="#tos"
                  >
                    {item}
                  </a>
                ) : (
                  <button
                    key={item}
                    onClick={() => {
                      const section = document.getElementById(item.toLowerCase());
                      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="text-[13px] font-medium text-zinc-400 hover:text-white transition-colors duration-300 tracking-wide bg-transparent border-none cursor-pointer"
                  >
                    {item}
                  </button>
                )
              ))}
            </div>

            <button
              onClick={() => window.open('https://t.me/galxymart', '_blank')}
              className="flex items-center gap-1 bg-white/[0.08] border border-white/[0.15] rounded-full px-2.5 py-1 text-white text-[12px] font-medium hover:bg-white/[0.14] transition-colors duration-300 cursor-pointer"
              style={{ gap: '5px' }}
            >
              <img
                src="https://img.icons8.com/color/48/telegram-app--v1.png"
                alt="Telegram"
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  objectFit: 'contain',
                  marginLeft: '-2px',
                  flexShrink: 0,
                }}
              />
              Chat
            </button>
          </div>

          <button 
            className="md:hidden p-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu - Premium Glass Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: '100%', opacity: 0, scale: 0.96 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: '100%', opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="fixed z-50 md:hidden flex flex-col overflow-hidden"
              style={{
                width: 'calc(100vw - 32px)',
                maxWidth: '400px',
                height: 'calc(100vh - 32px)',
                top: '16px',
                right: '16px',
                borderRadius: '20px',
                background: 'rgba(12,12,16,0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 25px 60px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(59,130,246,0.06)',
              }}
            >
              {/* Radial glow behind logo */}
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

              {/* Header */}
              <div className="relative flex items-center justify-between p-5 pb-3 shrink-0">
                <div className="flex items-center gap-3">
                  <AnimatedLogo className="h-11 w-11" />
                  <div>
                    <span className="font-bold text-base text-white tracking-tight block leading-tight">Galaxy Boosts</span>
                    <span className="text-[10px] text-zinc-500 font-medium tracking-wide">Premium Digital Services</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200 active:scale-90 shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Divider */}
              <div className="relative mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent shrink-0" />

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto py-3 px-4 space-y-0.5 scrollbar-none">
                {[
                  { name: 'Home', icon: Home, href: '/' },
                  { name: 'Features', icon: Zap, href: '#features' },
                  { name: 'Products', icon: ShoppingBag, href: '#products' },
                  { name: 'Reviews', icon: Star, href: '#reviews' },
                  { name: 'FAQ', icon: MessageCircle, href: '#faq' },
                  { name: 'TOS', icon: FileText, href: '#tos' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <motion.a
                      key={item.name}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      transition={{ delay: i * 0.06, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      whileTap={{ scale: 0.97 }}
                      className={`relative flex items-center gap-3.5 h-[54px] px-3.5 rounded-[14px] text-sm font-medium transition-all duration-200 group overflow-hidden ${
                        isActive
                          ? 'text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {/* Hover/Active background glow */}
                      <div className={`absolute inset-0 rounded-[14px] transition-all duration-300 ${
                        isActive
                          ? 'bg-blue-500/10 border border-blue-500/20'
                          : 'opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-500/5 to-transparent'
                      }`} />

                      {/* Left active indicator */}
                      <div className={`absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full transition-all duration-300 ${
                        isActive
                          ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                          : 'bg-transparent group-hover:bg-blue-500/50'
                      }`} />

                      {/* Icon container */}
                      <div className={`relative z-10 w-9 h-9 rounded-[10px] flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-blue-500/15 border border-blue-500/25 text-blue-400 scale-110'
                          : 'bg-white/[0.03] border border-white/[0.04] text-zinc-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 group-hover:scale-110 group-hover:text-blue-400'
                      }`}>
                        <Icon size={18} />
                      </div>

                      {/* Label */}
                      <span className={`relative z-10 flex-1 tracking-tight ${
                        isActive ? 'font-bold' : 'font-medium'
                      }`}>
                        {item.name}
                      </span>

                      {/* Arrow */}
                      <ArrowRight className={`relative z-10 w-3.5 h-3.5 transition-all duration-300 ${
                        isActive
                          ? 'opacity-100 translate-x-0 text-blue-400'
                          : 'opacity-0 -translate-x-2 text-blue-400 group-hover:opacity-100 group-hover:translate-x-0'
                      }`} />
                    </motion.a>
                  );
                })}
              </div>

              {/* Bottom Section */}
              <div className="relative px-4 pb-5 shrink-0">
                {/* Thin divider */}
                <div className="relative mx-1 mb-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                <div className="space-y-2.5">
                  {/* Discord Card */}
                  <motion.a
                    href="https://discord.gg/WpbDuTcAQH"
                    whileTap={{ scale: 0.97 }}
                    className="relative flex items-center gap-3.5 p-3.5 rounded-[14px] border border-white/[0.06] bg-white/[0.02] overflow-hidden group cursor-pointer transition-all duration-300 hover:border-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.06)]"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[14px]" />

                    <div className="w-9 h-9 rounded-[10px] bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center shrink-0 relative z-10">
                      <MessageCircle size={18} className="text-[#5865F2]" />
                    </div>

                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white">Join Discord</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-medium">24,000+ Members</p>
                    </div>

                    <ArrowRight size={16} className="text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-300 relative z-10 shrink-0" />
                  </motion.a>

                  {/* Telegram Card */}
                  <motion.a
                    href="https://t.me/boosts"
                    whileTap={{ scale: 0.97 }}
                    className="relative flex items-center gap-3.5 p-3.5 rounded-[14px] border border-white/[0.06] bg-white/[0.02] overflow-hidden group cursor-pointer transition-all duration-300 hover:border-sky-500/20 hover:shadow-[0_0_20px_rgba(14,165,233,0.06)]"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[14px]" />

                    <div className="w-9 h-9 rounded-[10px] bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0 relative z-10">
                      <Send size={18} className="text-sky-400" />
                    </div>

                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white">Telegram</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-medium">Live Updates & Support</p>
                    </div>

                    <ArrowRight size={16} className="text-zinc-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition-all duration-300 relative z-10 shrink-0" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </>
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

            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4 relative z-10 leading-tight">
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
        if (data.success) setStock(data.product.stock || 0);
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
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Products
          </h2>
          <div className="h-1 w-16 bg-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-white/60 text-base max-w-xl mx-auto">
            Premium digital services trusted by thousands of satisfied customers.
          </p>
        </motion.div>

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
  const [status, setStatus] = useState<'pending' | 'detected' | 'paid' | 'manual' | 'confirmed' | 'expired' | 'delivered'>('pending');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deliveredItems, setDeliveredItems] = useState<string[]>([]);
  const [instructions, setInstructions] = useState('');
  const [orderId, setOrderId] = useState('');
  const [productId, setProductId] = useState('');
  const [customerEmail, setCustomerEmail] = useState(data.email || data.customerEmail || '');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFinalizedRef = useRef(false);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a rating'); return; }
    if (feedback.length < 10) { toast.error('Review must be at least 10 characters'); return; }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, orderId, email: customerEmail, rating, comment: feedback }),
      });
      const result = await res.json();
      if (result.success) { setIsSubmitted(true); toast.success('Thank you for your review!'); }
      else { toast.error(result.message || 'Failed to submit review'); }
    } catch { toast.error('Failed to submit review'); }
    finally { setIsSubmitting(false); }
  };

  const checkStatus = async () => {
    if (isFinalizedRef.current) return;

    try {
      const orderIdentifier = data.orderId || data.paymentId;
      if (!orderIdentifier) return;

      const res = await fetch(`/api/orders/${orderIdentifier}/status`);
      const result = await res.json();
      if (!result.success) return;

      if (result.orderId) setOrderId(result.orderId);
      if (result.productName) setProductId(result.productName);
      if (result.customerEmail) setCustomerEmail(result.customerEmail);

      if (result.isFinal || ['paid', 'manual', 'confirmed', 'delivered'].includes(result.status)) {
        console.log('InvoiceView: Payment finalized, stopping poll');
        isFinalizedRef.current = true;
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        setStatus(result.status as any);
        if (result.deliveredItems && result.deliveredItems.length > 0) {
          setDeliveredItems(result.deliveredItems);
        }
        if (result.instructions) setInstructions(result.instructions);
      } else if (result.status === 'detected' || result.status === 'confirming' || result.status === 'waiting') {
        setStatus('detected');
      } else if (result.isTerminal || result.status === 'expired' || result.status === 'failed') {
        setStatus('expired');
        isFinalizedRef.current = true;
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      } else {
        setStatus('pending');
      }
    } catch (err) { console.error('Verify error:', err); }
  };

  useEffect(() => {
    checkStatus();
    pollIntervalRef.current = setInterval(checkStatus, 10000);
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [data.orderId, data.paymentId]);

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
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10 border-yellow-500/30'
        };
      case 'detected':
        return { 
          stepIndex: 1, 
          message: 'Transaction Detected',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10 border-blue-500/30'
        };
      case 'paid':
      case 'manual':
      case 'confirmed':
        return { 
          stepIndex: 2, 
          message: 'Payment Confirmed',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10 border-blue-500/30'
        };
      case 'delivered':
        return { 
          stepIndex: 3, 
          message: 'Order Delivered!',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/30'
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
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10 border-yellow-500/30'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const steps = [
    { label: 'Waiting for Payment' },
    { label: 'Transaction Detected' },
    { label: 'Payment Confirmed' },
    { label: 'Order Delivered' },
  ];

  const getStepState = (idx: number) => {
    if (status === 'delivered') return idx <= 3 ? 'done' : 'idle';
    if (status === 'paid' || status === 'manual' || status === 'confirmed') return idx <= 2 ? 'done' : idx === 3 ? 'active' : 'idle';
    if (status === 'detected') return idx === 0 ? 'done' : idx === 1 ? 'active' : 'idle';
    if (status === 'expired') return 'idle';
    if (status === 'pending') return idx === 0 ? 'active' : 'idle';
    return 'idle';
  };

  const displayAddress = data.payAddress || data.walletAddress || 'ltc1';
  const displayAmount = data.payAmount ?? data.ltcAmount ?? '—';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(displayAddress)}&bgcolor=111111&color=ffffff&margin=10`;

  return (
    <div className="w-full max-w-5xl mx-auto px-2 py-1 flex-1 flex flex-col overflow-hidden min-h-0">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40">
            <Bitcoin size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-xs leading-tight">Complete Your Payment</p>
            <p className="text-zinc-500 text-[10px]">Secure crypto checkout</p>
          </div>
        </div>
      </div>

      {/* ── Payment Success Layout ── */}
      {(['paid', 'manual', 'confirmed', 'delivered'].includes(status)) ? (
        <div className="fixed inset-0 z-50 w-screen h-screen overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 100%)' }}>
          {/* Subtle Hexagonal / Network Pattern Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.4) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />
          
          <div className="relative z-10 w-full h-full flex flex-col justify-center animate-in fade-in zoom-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col items-center text-center px-4 mb-10 shrink-0">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] ring-1 ring-emerald-400/50 mb-5 relative">
                <div className="absolute inset-0 rounded-full border border-emerald-300/30 animate-ping" style={{ animationDuration: '3s' }} />
                <CheckCircle2 size={32} className="text-white drop-shadow-md" />
              </div>
              <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Payment Verified!</h3>
              <p className="text-[13px] text-zinc-400 mt-2 font-medium">Your assets have been successfully provisioned.</p>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-[900px] mx-auto px-6 flex flex-col gap-8">
              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                
                {/* Left Card - Delivery Details */}
                <div className="rounded-[16px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-[12px] p-6 relative overflow-hidden flex flex-col shadow-2xl">
                  {/* Top Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  
                  <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Delivery Details</h4>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    {deliveredItems && deliveredItems.length > 0 ? (
                      <div className="space-y-3">
                        {deliveredItems.map((serial: string, i: number) => (
                          <div key={i} className="flex items-center justify-between bg-black/20 border border-white/5 rounded-xl px-4 py-3">
                            <code className="text-blue-400 font-mono text-[13px] truncate flex-1 mr-3">{serial}</code>
                            <button 
                              type="button"
                              onClick={() => { navigator.clipboard.writeText(serial); toast.success('Copied!'); }}
                              className="p-2 rounded-lg hover:bg-white/10 text-zinc-500 hover:text-white transition-all shrink-0"
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                        ))}
                        {instructions && (
                          <div className="mt-4 pt-4 border-t border-white/[0.06]">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Instructions</p>
                            <p className="text-[13px] leading-relaxed text-zinc-300">{instructions}</p>
                          </div>
                        )}
                      </div>
                    ) : instructions ? (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                        <p className="text-[13px] text-zinc-300 leading-relaxed whitespace-pre-line">{instructions}</p>
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                        <p className="text-[13px] text-amber-200/90 leading-relaxed">
                          Your order is confirmed! Contact us on <span className="font-bold text-amber-400">Discord</span> with your payment ID <span className="font-mono text-white/60">{data.paymentId}</span> to receive your delivery.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Contact Support Button inside Left Card */}
                  <div className="mt-6 pt-6 border-t border-white/[0.06] mt-auto flex justify-center">
                    <a 
                      href="https://discord.gg/WpbDuTcAQH" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="h-[30px] px-4 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-center gap-1.5 text-[11px] font-semibold text-white transition-all active:scale-[0.98]"
                    >
                      <Headphones size={12} className="text-zinc-400" />
                      Contact Support
                    </a>
                  </div>
                </div>

                {/* Right Card - Rate Experience */}
                <div className="rounded-[16px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-[12px] p-6 flex flex-col shadow-2xl">
                  <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Rate Your Experience</h4>
                  
                  {isSubmitted ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-6 space-y-3">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <CheckCircle2 size={28} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      </div>
                      <p className="text-[13px] font-bold text-white uppercase tracking-widest">Thank you for your review!</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitFeedback} className="flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-5 justify-center">
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
                              className={`transition-all duration-300 ${s <= (hoveredRating || rating) ? 'text-[#FFD700] fill-[#FFD700] drop-shadow-[0_0_12px_rgba(255,215,0,0.6)]' : 'text-zinc-700 hover:text-zinc-500'}`} 
                            />
                          </button>
                        ))}
                      </div>

                      <div className="flex-1 flex flex-col">
                        <textarea 
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          rows={3}
                          placeholder="Share your experience..."
                          className="w-full flex-1 bg-black/20 border border-white/[0.05] rounded-xl p-4 text-[13px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-all resize-none shadow-inner mb-4"
                        />
                      </div>
                      
                      {/* Submit Button inside Right Card */}
                      <div className="flex justify-end">
                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className="h-[30px] px-6 rounded-lg bg-white text-black text-[11px] font-bold hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center shadow-lg"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
                
              </div>
            </div>
            
            {/* Top Right Exit Button for the fixed overlay */}
            <button 
              onClick={onBack}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all z-50 backdrop-blur-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 overflow-hidden min-h-0">
          {/* ════ LEFT COLUMN ════ */}
          <div className="flex flex-col gap-2.5 overflow-auto">
            {/* Invoice Card */}
            <div className="rounded-xl border border-white/[0.07] bg-[#0d1117]/80 backdrop-blur-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Invoice</span>
                <span className="text-[10px] font-bold text-blue-400">{data.paymentId || '—'}</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Product',     value: data.productName || '—',              icon: false },
                  { label: 'Email',       value: data.email || data.customerEmail || '—', icon: false },
                  { label: 'Total (USD)', value: `$${data.usdAmount ?? '—'}`,           icon: false },
                  { label: 'Coin',        value: 'Litecoin (LTC)',                      icon: true  },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-zinc-500 text-xs">{row.label}</span>
                    <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                      {row.icon && <Bitcoin size={10} className="text-zinc-500" />}
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Send Exactly Card */}
            <div className="rounded-xl border border-blue-500/25 bg-[#0a1628]/90 backdrop-blur-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Send Exactly</span>
                {data.ltcPriceAtTime && (
                  <span className="text-[10px] text-zinc-500">
                    ● 1 LTC = ${Number(data.ltcPriceAtTime).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[1.8rem] font-black text-white tracking-tighter tabular-nums leading-none">
                  {displayAmount}
                </span>
                <span className="text-blue-400 font-black text-sm uppercase">LTC</span>
              </div>
              <p className="text-zinc-500 text-[11px] mt-1">≈ ${data.usdAmount} USD at current rate</p>
            </div>

            {/* Wallet Address Card */}
            {status === 'expired' ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
                <p className="text-red-400 font-bold text-sm text-center">
                  This invoice has expired. Please go back and create a new order.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.07] bg-[#0d1117]/80 backdrop-blur-xl p-4">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-2">Wallet Address</span>
                <div className="flex items-center gap-2 bg-zinc-950 border border-white/[0.05] rounded-lg px-3 py-2.5">
                  <span className="text-zinc-300 text-xs font-mono flex-1 truncate">
                    {displayAddress}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(displayAddress);
                      toast.success('Address copied!', { style: { background: '#18181b', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' } });
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white text-[11px] font-bold transition-all active:scale-95 shrink-0"
                  >
                    <Copy size={10} />
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Timer Row */}
            {(status === 'pending') && (
              <div className="rounded-xl border border-white/[0.07] bg-[#0d1117]/80 backdrop-blur-xl px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-blue-400" />
                  <span className="text-zinc-400 text-xs">Payment expires in</span>
                </div>
                <span className="text-sm font-black tabular-nums font-mono text-white">
                  {data.expiresAt
                    ? <Timer expiresAt={data.expiresAt} onExpire={() => setStatus('expired')} />
                    : '—'}
                </span>
              </div>
            )}

            {/* Back to Store */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-zinc-500 hover:text-white text-xs transition-colors group pt-1 pl-1"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Store
            </button>
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div className="flex flex-col gap-3">
            {/* QR Code Card */}
            {status !== 'expired' && (
              <div className="flex-1 rounded-xl border border-white/[0.07] bg-[#0d1117]/80 backdrop-blur-xl p-4 flex flex-col items-center justify-center">
                <div className="relative p-3 bg-white rounded-2xl mb-3 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <img src={qrUrl} alt="QR Code" className="w-36 h-36" />
                  <div className="absolute inset-0 border-3 border-black/10 rounded-2xl" />
                </div>
                <h3 className="text-white font-bold text-xs mb-0.5 uppercase tracking-widest">Litecoin QR</h3>
                <p className="text-zinc-500 text-[10px]">Scan with your wallet app</p>
              </div>
            )}

            {/* Status Steps Card */}
            <div className="rounded-xl border border-white/[0.07] bg-[#0d1117]/80 backdrop-blur-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Transaction Status</span>
                <div className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${statusInfo.bgColor} ${statusInfo.color}`}>
                  {statusInfo.message}
                </div>
              </div>
              
              <div className="space-y-2.5">
                {steps.map((step, idx) => {
                  const state = getStepState(idx);
                  return (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                        state === 'done' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
                        state === 'active' ? 'bg-blue-400 animate-pulse' :
                        'bg-zinc-800'
                      }`} />
                      <span className={`text-[11px] font-medium transition-colors duration-500 ${
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
                className="w-full mt-4 py-2 rounded-lg border border-white/5 bg-white/5 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RefreshCw size={11} className={isRefreshing ? 'animate-spin' : ''} />
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
  const isCouponLocked = useRef(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const isOrderLocked = useRef(false);
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
        if (data.success) setLiveStock(data.product.stock || 0);
      } catch (err) {}
    };
    const interval = setInterval(pollStock, 5000);
    return () => clearInterval(interval);
  }, [product]);

  const handleApplyCoupon = async () => {
    if (isCouponLocked.current) return;
    if (!couponCode.trim()) return;
    isCouponLocked.current = true;
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
      isCouponLocked.current = false;
    }
  };

  const handleCreateOrder = async () => {
    if (isOrderLocked.current) return;

    if (!customerEmail || !customerEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    isOrderLocked.current = true;
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
      const res = await fetch('/api/payments/create-nowpayment', {
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
      isOrderLocked.current = false;
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
      className="relative bg-[#060607]"
      style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
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

      <main className="mx-auto w-full flex-1 overflow-hidden flex flex-col px-4 pt-12 pb-0">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between max-w-[1080px] mx-auto w-full shrink-0">
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
          <section className="grid gap-5 max-w-[1080px] mx-auto w-full lg:grid-cols-[1.4fr_1fr]">
            {/* Left: Product Info */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-xl overflow-hidden flex flex-col w-full" style={{ backdropFilter: 'blur(10px)' }}>
              <div className="p-4 sm:p-7 flex flex-col flex-1">
                {/* Product Header */}
                <div className="mb-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-1 sm:gap-0">
                    <h1 className="font-display text-[20px] sm:text-[24px] font-bold tracking-tight text-white">{product.name}</h1>
                    <div className="flex items-baseline gap-2 shrink-0">
                      <span className="text-[18px] sm:text-[22px] font-bold text-white">
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
                    <div className="flex items-center justify-center gap-4 sm:gap-8 text-[11px] sm:text-[12px] text-white/35 flex-wrap">
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
              <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between h-full">
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
      className="relative bg-black overflow-hidden border-t border-white/5 w-full"
      style={isMobile ? { padding: '40px 20px 30px' } : { paddingTop: 96, paddingBottom: 40 }}
    >
      {/* Sheryians-style Large Text Effect — hidden on mobile */}
      {!isMobile && (
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
      )}

      <div className="max-w-[1200px] mx-auto relative z-10"
        style={isMobile ? { padding: '0' } : { paddingLeft: 32, paddingRight: 32 }}
      >
        <div className={isMobile ? '' : 'grid grid-cols-1 lg:grid-cols-4 gap-8 sm:gap-12 mb-16 sm:mb-24'}>
          {isMobile ? (
            <>
              {/* Mobile layout */}
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
                  <AnimatedLogo className="h-10 w-10" />
                  <span className="text-2xl font-bold text-white tracking-tighter">GalaxyBoosts</span>
                </div>
                <p style={{ fontSize: 13, maxWidth: 260, margin: '8px auto 0', lineHeight: 1.5, color: 'rgba(255,255,255,0.5)' }}>
                  The leading provider for premium Discord enhancement products and accounts.
                </p>
              </div>
              <div className="footer-links-wrapper" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', width: '100%', padding: '0 10px' }}>
                {sections.map((s, i) => (
                  <div key={s.title} style={i === 1 ? { justifySelf: 'end', textAlign: 'right' } : {}}>
                    <h4 style={{ fontSize: 11, letterSpacing: '1.5px', marginBottom: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 700 }}>{s.title}</h4>
                    {s.links.map((link) => (
                      <a key={link} href="#" style={{ display: 'block', fontSize: 13, marginBottom: 10, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>{link}</a>
                    ))}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="lg:col-span-1">
                <Magnetic>
                  <a className="flex items-center gap-3 text-2xl sm:text-3xl font-bold text-white tracking-tighter mb-6" href="/">
                    <AnimatedLogo className="h-10 w-10" />
                    GalaxyBoosts
                  </a>
                </Magnetic>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-[200px]">
                  The leading provider for premium Discord enhancement products and accounts.
                </p>
              </div>

              <div className="lg:col-span-3 flex flex-col sm:flex-row gap-8 sm:gap-12 lg:justify-end">
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
            </>
          )}
        </div>

        <div style={isMobile ? { textAlign: 'center', fontSize: 11, marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' } : { paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {isMobile ? (
            <>&copy; {new Date().getFullYear()} Galaxy Boosts. All rights reserved.</>
          ) : (
            <div className="max-w-[1200px] mx-auto px-8 sm:px-12" />
          )}
        </div>
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
  return (
    <div
      className="relative shrink-0 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl transition-all duration-300 hover:border-white/[0.15] hover:shadow-[0_0_24px_rgba(59,130,246,0.12)] will-change-transform group"
      style={{
        minWidth: 280,
        maxWidth: 280,
        width: 280,
        height: 'auto',
        minHeight: 140,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 16,
        gap: 8,
        overflow: 'hidden',
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent pointer-events-none rounded-xl" />
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/[0.03] rounded-full blur-xl pointer-events-none" />
      <div className="relative z-0 flex flex-col gap-2">
        <div className="flex items-center gap-0.5" style={{ fontSize: 14, marginBottom: 6 }}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < review.starRating ? 'text-white fill-white' : 'text-zinc-700 fill-zinc-700'}`} />
          ))}
        </div>
        <p
          className="font-medium"
          style={{
            fontSize: 13,
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.85)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          &ldquo;{review.reviewText}&rdquo;
        </p>
      </div>
      <div
        className="relative z-0 flex items-center justify-between border-t border-white/[0.04] pt-2.5"
        style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 'auto' }}
      >
        <span className="font-mono truncate max-w-[140px]">{review.email}</span>
        <span className="font-medium whitespace-nowrap ml-2">
          {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : 'Recently'}
        </span>
      </div>
    </div>
  );
});

ReviewCard.displayName = 'ReviewCard';

const ReviewSkeleton = () => (
  <div className="w-[210px] sm:w-[240px] shrink-0 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 animate-pulse">
    <div className="flex gap-1 mb-3">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-3 h-3 bg-white/5 rounded-full" />)}
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-2.5 bg-white/5 rounded w-full" />
      <div className="h-2.5 bg-white/5 rounded w-4/5" />
    </div>
    <div className="flex justify-between border-t border-white/[0.04] pt-2.5">
      <div className="h-2 bg-white/5 rounded w-16" />
      <div className="h-2 bg-white/5 rounded w-10" />
    </div>
  </div>
);

const MarqueeRow = ({ items, direction = 'left' }: { items: any[]; direction?: 'left' | 'right' }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const singleWidthRef = useRef(0);
  const displayItems = [...items, ...items, ...items, ...items];

  const SPEED = direction === 'left' ? 0.5 : 0.5;

  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length === 0) return;

    singleWidthRef.current = el.scrollWidth / 4;
    const singleWidth = singleWidthRef.current;

    let pos = direction === 'right' ? -singleWidth : 0;
    let raf: number;

    const tick = () => {
      if (direction === 'left') {
        pos -= SPEED;
        if (Math.abs(pos) >= singleWidth) pos = 0;
      } else {
        pos += SPEED;
        if (pos >= 0) pos = -singleWidth;
      }
      el.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [direction, items.length]);

  if (items.length === 0) return null;

  return (
    <div
      className="overflow-hidden w-full"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div
        ref={trackRef}
        className="flex items-start gap-3 will-change-transform"
        style={{ width: 'max-content' }}
      >
        {displayItems.map((review, idx) => (
          <ReviewCard key={`${review._id || idx}-${idx}`} review={review} />
        ))}
      </div>
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

  const reviews = reviewsData?.reviews || [];
  const shuffled = [...reviews].sort(() => Math.random() - 0.5);

  return (
    <section id="reviews" className="bg-black relative overflow-hidden border-y border-white/5">
      <div className="py-16 px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-3">
            Voices of the Community
          </h2>
          <div className="h-1 w-16 bg-blue-600 rounded-full mx-auto mb-4" />
          <p className="text-white/60 text-base max-w-xl mx-auto">
            Real feedback from thousands of satisfied members across the galaxy.
          </p>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-hidden py-2 px-4 sm:px-8">
          {[1, 2, 3, 4, 5].map(i => <ReviewSkeleton key={i} />)}
        </div>
      ) : reviews.length > 0 ? (
        <div className="w-full overflow-hidden relative">
          <div className="mb-3 overflow-hidden w-full">
            <MarqueeRow items={reviews} direction="left" />
          </div>
          <div className="overflow-hidden w-full">
            <MarqueeRow items={shuffled} direction="right" />
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 border border-white/10">
            <Star className="w-5 h-5 text-zinc-600" />
          </div>
          <p className="text-zinc-500 font-medium tracking-tight text-sm">No reviews yet. Be the first to leave one!</p>
        </div>
      )}
    </section>
  );
};

export default function Landing({ dbProducts }: { dbProducts?: any[] }) {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-brand-primary/30 selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <Products dbProducts={dbProducts} />
      
      <ReviewsSection />

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-black relative overflow-hidden w-full">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Frequently Asked Questions
            </h2>
            <div className="h-1 w-16 bg-blue-600 rounded-full mx-auto mb-4"></div>
            <p className="text-white/60 text-base max-w-xl mx-auto">
              Got questions? We've got answers.
            </p>
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
