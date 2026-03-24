/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  Copy,
  Loader2,
  Clock,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { Toaster, toast } from 'sonner';
import { Hero } from './components/Hero';

const PRODUCT_DATA = {
  boosts: [
    { id: "boost-2", name: "2 Server Boosts", price: "$2.49", duration: "1 Month", perks: ["Level 1 Perks", "Instant Delivery", "24/7 Support"], stock: 124, image: "https://boosts.to/wzi5xe.gif" },
    { id: "boost-7", name: "7 Server Boosts", price: "$7.99", duration: "1 Month", perks: ["Level 2 Perks", "Instant Delivery", "24/7 Support"], stock: 82, image: "https://boosts.to/wzi5xe.gif" },
    { id: "boost-14", name: "14 Server Boosts", price: "$14.99", duration: "1 Month", perks: ["Level 3 Perks", "Instant Delivery", "24/7 Support"], stock: 45, image: "https://boosts.to/wzi5xe.gif" },
    { id: "boost-14-3m", name: "14 Server Boosts", price: "$34.99", duration: "3 Months", perks: ["Level 3 Perks", "Long Duration", "Best Value"], stock: 12, image: "https://boosts.to/wzi5xe.gif" }
  ],
  members: [
    { id: "mem-100", name: "100 Members", price: "$4.99", duration: "Permanent", perks: ["High Quality", "Instant Start", "Safe Delivery"], stock: 500, image: "https://boosts.to/logo_animated.gif" },
    { id: "mem-500", name: "500 Members", price: "$19.99", duration: "Permanent", perks: ["High Quality", "Instant Start", "Safe Delivery"], stock: 240, image: "https://boosts.to/logo_animated.gif" },
    { id: "mem-1000", name: "1000 Members", price: "$34.99", duration: "Permanent", perks: ["High Quality", "Instant Start", "Safe Delivery"], stock: 110, image: "https://boosts.to/logo_animated.gif" },
    { id: "mem-5000", name: "5000 Members", price: "$149.99", duration: "Permanent", perks: ["High Quality", "Instant Start", "Safe Delivery"], stock: 15, image: "https://boosts.to/logo_animated.gif" }
  ]
};

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
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

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
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-brand-primary">{product.price}</span>
            <span className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider">/ {product.duration}</span>
          </div>
        </div>
        
        <ul className="space-y-3 mb-8 flex-1">
          {product.perks.map((perk: string, j: number) => (
            <li key={j} className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-1 h-1 rounded-full bg-brand-primary/60" />
              {perk}
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-6">
          <div className="flex justify-center">
            <button 
              onClick={() => navigate(`/product/${product.id}`)}
              className="w-full py-2 rounded-lg bg-white/5 hover:bg-brand-primary text-white text-[12px] font-bold transition-all duration-300 border border-white/10 hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/20"
            >
              Purchase Now
            </button>
          </div>
          
          <div className="flex items-center justify-end pt-4 border-t border-white/5">
            <div className="flex gap-1.5">
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
              <div className="w-1 h-1 rounded-full bg-brand-primary/40" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  const [activeTab, setActiveTab] = useState('boosts');

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
          {['boosts', 'members'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 border ${
                activeTab === tab 
                  ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-lg shadow-brand-primary/20' 
                  : 'border-white/5 text-zinc-500 hover:border-white/10 hover:bg-white/5'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="wait">
            {PRODUCT_DATA[activeTab as keyof typeof PRODUCT_DATA].map((p, i) => (
              <ProductCard key={`${activeTab}-${i}`} product={p} index={i} />
            ))}
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

const InvoiceView = ({ data, onBack }: { data: any, onBack: () => void }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'confirming' | 'confirmed' | 'expired'>('pending');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [receivedAmount, setReceivedAmount] = useState(0);

  useEffect(() => {
    if (status === 'confirmed' || status === 'expired') return;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/payments/verify?paymentId=${data.paymentId}`);
        const result = await res.json();
        
        if (result.status === 'confirmed') {
          setStatus('confirmed');
          setTxHash('0x' + Math.random().toString(16).slice(2, 42)); 
          setReceivedAmount(data.ltcAmount);
          setTimeout(() => navigate('/'), 4000);
        } else if (result.status === 'expired') {
          setStatus('expired');
        } else if (result.status === 'confirming') {
          setStatus('confirming');
        }
      } catch (err) {
        console.error('Verify error:', err);
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [data.paymentId, status, navigate, data.ltcAmount]);

  const getStatusColor = () => {
    switch (status) {
      case 'confirmed': return 'text-green-500';
      case 'confirming': return 'text-yellow-400';
      case 'expired': return 'text-red-500';
      default: return 'text-blue-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'confirming': return 'Confirming...';
      case 'expired': return 'Expired';
      default: return 'Waiting for payment';
    }
  };

  return (
    <div className="min-h-[80vh] w-full max-w-6xl mx-auto py-12 px-4 selection:bg-blue-500/30 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="rounded-[2.5rem] border border-white/10 bg-zinc-900/20 shadow-2xl backdrop-blur-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16"></div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 p-2 shrink-0">
                <img src={data.productImage} alt="" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg line-clamp-1">{data.productName}</h3>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Order Summary</p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <span>Total Due</span>
                <span className="text-white">${data.usdAmount}</span>
              </div>
              <div className="flex justify-between items-baseline pt-4 border-t border-white/5">
                <span className="text-lg font-black text-white italic tracking-tighter uppercase">Pay Total</span>
                <span className="text-2xl font-black text-blue-500 underline decoration-blue-500/30 underline-offset-8 decoration-2 italic tabular-nums">${data.usdAmount}</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5">
              <a href="#" className="text-[9px] font-black text-zinc-600 hover:text-zinc-400 uppercase tracking-[0.3em] transition-colors">
                Terms of Service & Privacy
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/5 p-5 flex items-center gap-4 group cursor-help transition-all hover:bg-white/[0.07]">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Secure Connection</p>
              <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider mt-0.5">Automated by GalaxyMart</p>
            </div>
          </div>
        </div>

        {/* Right: Payment Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-[3rem] border border-white/10 bg-zinc-900/30 shadow-2xl backdrop-blur-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full -translate-x-32 translate-y-32"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-2xl bg-zinc-950/80 border border-white/10 flex items-center justify-center text-[#345D9D] shadow-2xl shadow-blue-500/10">
                  <Bitcoin size={36} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Litecoin <span className="text-zinc-700 not-italic ml-1">LTC</span></h2>
                  <div className="flex items-center gap-2 mt-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/5 w-fit">
                    <span className="text-[10px] font-mono text-zinc-500 lowercase">{data.paymentId}</span>
                    <CopyButton text={data.paymentId} label="Invoice ID" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 min-w-[160px] flex flex-col items-center shadow-inner">
                <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1.5">
                  <Clock size={12} className={status === 'expired' ? 'text-red-500' : 'text-blue-500 animate-pulse'} />
                  Timer
                </div>
                <div className={`text-3xl font-black tabular-nums tracking-tighter ${status === 'expired' ? 'text-red-500' : 'text-white'}`}>
                  <Timer expiresAt={data.expiresAt} onExpire={() => setStatus('expired')} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-12">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em] ml-1">Send Exactly</label>
                  <div className="bg-zinc-950/80 border border-white/10 rounded-[2rem] p-6 flex justify-between items-center group hover:border-blue-500/30 transition-colors">
                    <div>
                      <p className="text-xl font-black text-white tracking-tighter tabular-nums">{data.ltcAmount} <span className="text-blue-500 text-sm italic ml-1 uppercase">LTC</span></p>
                      <p className="text-[10px] font-bold text-zinc-600 mt-1 uppercase tracking-widest">${data.usdAmount} USD Equivalent</p>
                    </div>
                    <CopyButton text={data.ltcAmount.toString()} label="Amount" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em] ml-1">Address</label>
                  <div className="bg-zinc-950/80 border border-white/10 rounded-[2rem] p-6 flex justify-between items-center group hover:border-blue-500/30 transition-colors overflow-hidden">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-xs font-mono text-zinc-300 break-all leading-relaxed">{data.walletAddress}</p>
                    </div>
                    <CopyButton text={data.walletAddress} label="Address" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center space-y-4 pt-4 md:pt-0">
                <QRView address={data.walletAddress} />
                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em]">Scan to pay instantly</p>
              </div>
            </div>

            {/* Event Log */}
            <div className="mt-12 pt-10 border-t border-white/5 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${status === 'expired' ? 'bg-red-500' : 'bg-blue-500 animate-ping'}`}></span>
                  Real-time Status Monitor
                </h4>
                {status === 'expired' && (
                  <button onClick={() => window.location.reload()} className="text-[9px] font-black text-red-500 hover:text-white transition-all uppercase tracking-[0.2em] bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20 hover:bg-red-500">
                    Restart Payment
                  </button>
                )}
              </div>

              <div className="rounded-[2.5rem] border border-white/10 bg-black/40 overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                  {status === 'confirmed' ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-12 text-center space-y-6 bg-green-500/5">
                      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mx-auto shadow-[0_0_50px_rgba(34,197,94,0.4)] relative">
                        <CheckCircle2 size={40} />
                        <motion.div className="absolute inset-0 rounded-full border-2 border-green-500/50" animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                      </div>
                      <div>
                        <h5 className="text-2xl font-black text-white uppercase italic tracking-tighter">Transaction Detected!</h5>
                        <p className="text-[10px] text-zinc-500 mt-2 font-black uppercase tracking-widest leading-relaxed">Your order is being processed.<br/>Auto-redirecting in 4s...</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      <div className="flex items-center justify-between p-8 bg-white/[0.01]">
                        <div className="flex items-center gap-5">
                          <div className={`w-4 h-4 rounded-full blur-[1px] animate-pulse ${status === 'expired' ? 'bg-red-500 shadow-red-500/50' : 'bg-blue-500 shadow-blue-500/50'}`} />
                          <div>
                            <p className={`text-[11px] font-black uppercase tracking-[0.25em] ${getStatusColor()}`}>Status: {getStatusText()}</p>
                            <p className="text-[9px] text-zinc-600 mt-1 uppercase font-black tracking-widest">Awaiting nodes detection</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-white tabular-nums italic">{receivedAmount} LTC</p>
                          <p className="text-[9px] text-zinc-700 mt-0.5 font-black uppercase tracking-widest">Received</p>
                        </div>
                      </div>

                      <div className="p-8 flex flex-col items-center justify-center space-y-5 bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                          {[0, 1, 2].map(i => (
                            <motion.div 
                              key={i}
                              animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                              className="w-2 h-2 bg-blue-500/50 rounded-full" 
                            />
                          ))}
                        </div>
                        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.45em]">Polling Infrastructure</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-12 opacity-30 grayscale hover:opacity-100 transition-all duration-700">
            <div className="flex items-center gap-2 text-zinc-500">
              <Shield size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">AES-256 Protocol</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-500">
              <Lock size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Secure Node API</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-5 md:hidden z-[100]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-transparent -z-10 h-[150%] -top-1/2"></div>
        <div className="bg-[#121214]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl flex items-center justify-between border-t-2 border-blue-500/20">
          <div>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Send Exactly</p>
            <p className="text-xl font-black text-white italic tracking-tighter">{data.ltcAmount} LTC</p>
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(data.walletAddress);
              toast.success('Address Copied!');
            }}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-xl shadow-blue-500/20 transition-all active:scale-95"
          >
            Copy Address
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [email, setEmail] = useState('');
  const [coupon, setCoupon] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [couponApplied, setCouponApplied] = useState<{ code: string, discount: number } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  
  const product = [...PRODUCT_DATA.boosts, ...PRODUCT_DATA.members].find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-brand-bg">
        <h1 className="text-2xl font-bold text-white mb-4 italic uppercase tracking-tighter">Product not found</h1>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-blue-600 rounded-2xl text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Go Back Home</button>
      </div>
    );
  }

  const numericPrice = parseFloat(product.price.replace('$', ''));
  const baseTotal = (numericPrice * quantity);
  const discountAmount = couponApplied ? (baseTotal * (couponApplied.discount / 100)) : 0;
  const finalPrice = (baseTotal - discountAmount).toFixed(2);

  const handleApplyCoupon = async () => {
    if (!coupon) return;
    setIsValidatingCoupon(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon })
      });
      const data = await res.json();
      if (data.success) {
        setCouponApplied({ code: coupon, discount: data.coupon.discount });
        toast.success(`Coupon "${coupon}" applied! ${data.coupon.discount}% OFF`, {
          style: { background: 'rgba(22, 101, 52, 0.9)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }
        });
      } else {
        toast.error(data.message || 'Invalid coupon code', {
          style: { background: 'rgba(153, 27, 27, 0.9)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }
        });
      }
    } catch (err) {
      toast.error('Error validating coupon');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handlePayment = async () => {
    if (!email) {
      toast.error('Please enter your email', {
        style: { background: 'rgba(153, 27, 27, 0.9)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }
      });
      return;
    }
    
    setIsPaying(true);
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productDetails: {
            name: product.name,
            price: product.price,
            quantity: quantity,
            email: email,
            coupon: couponApplied?.code || ''
          }
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setInvoiceData(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast.error(data.message || 'Payment initialization failed');
        setIsPaying(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('System error. Please try again later.');
      setIsPaying(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-20 px-4 bg-black selection:bg-blue-500/30"
    >
      <main className="mx-auto w-full max-w-7xl">
        {/* Top UI Bar */}
        <div className="mb-12 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all group px-5 py-2.5 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-md hover:border-white/20"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit to Store</span>
          </button>

          <div className="flex items-center gap-2.5 py-2.5 px-5 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-md text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] relative group">
            <div className="absolute inset-0 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-all rounded-full" />
            <Shield className="w-3.5 h-3.5 text-blue-500" />
            <span className="relative z-10">Encrypted Protocol Active</span>
          </div>
        </div>

        {invoiceData ? (
          <InvoiceView data={invoiceData} onBack={() => setInvoiceData(null)} />
        ) : (
          <section className="grid gap-12 lg:grid-cols-12 items-start">
            {/* Left Side: Product Card */}
            <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="rounded-[3rem] border border-white/10 bg-zinc-900/20 shadow-2xl backdrop-blur-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-50"></div>
                
                <div className="p-10 relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                         <Star className="w-3 h-3 text-blue-400 fill-blue-400" />
                         <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Premium Service</span>
                      </div>
                      <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">{product.name}</h1>
                      <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-lg">
                        Accelerate your community growth with our industrial-grade delivery infrastructure. {product.perks.join(" • ")}.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 backdrop-blur-2xl shadow-xl shadow-red-500/5">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                      <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em]">LOW STOCK: {product.stock} units</span>
                    </div>
                  </div>

                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-950/40 shadow-inner group-hover:border-white/10 transition-colors duration-700">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.15),transparent_70%)] opacity-30"></div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain p-16 relative z-10 transition-all duration-1000 group-hover:scale-105 group-hover:rotate-1"
                    />
                    <div className="absolute bottom-10 left-10 right-10 flex justify-center">
                       <div className="px-6 py-2 rounded-full bg-black/60 border border-white/5 backdrop-blur-3xl text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-4">
                          <span>100% Secure</span>
                          <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                          <span>Instant Delivery</span>
                          <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                          <span>24/7 Support</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Order Summary (Sticky) */}
            <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
              <div className="sticky top-24 rounded-[3rem] border border-white/10 bg-zinc-900/40 shadow-2xl backdrop-blur-3xl overflow-hidden">
                <div className="p-8 sm:p-10 space-y-10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Checkout Engine</h2>
                    <ShoppingBag className="w-5 h-5 text-zinc-700" />
                  </div>

                  {/* Quantity & Method Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Quantity</label>
                      <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/60 p-1.5 backdrop-blur-xl group hover:border-white/10 transition-colors">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-90"
                          disabled={quantity <= 1 || isPaying}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-base font-black text-white tabular-nums">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(25, quantity + 1))}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-90"
                          disabled={quantity >= 25 || isPaying}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Payment</label>
                      <button 
                        onClick={() => setPaymentMethod('crypto')}
                        className="w-full flex items-center justify-between rounded-2xl border border-blue-500/30 bg-blue-500/5 p-3.5 backdrop-blur-xl group active:scale-[0.98] transition-all"
                      >
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                               <Bitcoin className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Litecoin</span>
                         </div>
                         <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                      </button>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-4 pt-10 border-t border-white/5">
                    <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Delivery Email</label>
                    <div className="relative group">
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-blue-500 transition-colors" />
                       <input 
                         type="email" 
                         placeholder="name@example.com" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         disabled={isPaying}
                         className="w-full bg-black/60 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-blue-500/30 transition-all focus:bg-black/80 shadow-inner"
                       />
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Discount Coupon</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          placeholder="CODE10" 
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                          disabled={isPaying || couponApplied !== null}
                          className="w-full bg-black/60 border border-white/5 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-blue-500/30 transition-all uppercase tracking-widest disabled:opacity-50"
                        />
                      </div>
                      <button 
                        onClick={handleApplyCoupon}
                        disabled={!coupon || isPaying || isValidatingCoupon || couponApplied !== null}
                        className="px-6 rounded-2xl bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-zinc-800 disabled:opacity-30 transition-all active:scale-95 shadow-xl"
                      >
                        {isValidatingCoupon ? '...' : (couponApplied ? 'Applied' : 'Apply')}
                      </button>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-4 pt-10 border-t border-white/5">
                    <div className="flex items-center justify-between text-[11px] font-bold tracking-widest uppercase">
                      <span className="text-zinc-600">Subtotal</span>
                      <span className="text-white tabular-nums">${baseTotal.toFixed(2)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex items-center justify-between text-[11px] font-bold tracking-widest uppercase text-green-500">
                        <span>Discount ({couponApplied.discount}%)</span>
                        <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] font-bold tracking-widest uppercase">
                      <span className="text-zinc-600">Processing</span>
                      <span className="text-blue-500 italic">Free</span>
                    </div>
                    <div className="pt-6 flex items-center justify-between border-t border-white/5">
                      <span className="text-lg font-black text-white italic tracking-tighter uppercase underline decoration-zinc-800 underline-offset-8">Final Total</span>
                      <span className="text-4xl font-black tracking-tighter text-white tabular-nums italic decoration-blue-500 shadow-blue-500/20 drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">${finalPrice}</span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={handlePayment}
                    disabled={isPaying}
                    className="group relative w-full rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-6 text-xs font-black text-white shadow-2xl shadow-blue-500/30 transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:hover:scale-100 overflow-hidden uppercase tracking-[0.3em]"
                  >
                    <AnimatePresence mode="wait">
                      {isPaying ? (
                        <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-4">
                           <Loader2 className="w-5 h-5 animate-spin" />
                           <span>Securing Connection...</span>
                        </motion.div>
                      ) : (
                        <motion.div key="buy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-4 relative z-10">
                           <ShoppingBag className="w-5 h-5" />
                           <span>Authorize Payment</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer delay-100"></div>
                  </button>
                  
                  <p className="text-[9px] text-zinc-700 text-center uppercase font-bold tracking-[0.2em] px-4 leading-relaxed">
                    By confirming, you agree to the automated delivery protocol and terms.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </motion.div>
  );
};
const SuccessPage = () => {
  const navigate = useNavigate();
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
          onClick={() => navigate('/')}
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

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
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
    <BrowserRouter>
      <Toaster position="top-right" expand={false} richColors closeButton />
      <div className="min-h-screen bg-brand-bg text-white selection:bg-brand-primary/20 relative">
        <Navbar />
        
        <Routes>
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/" element={
            <main className="relative z-10">
              <Hero />
              <Features />
              <Products />
              
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
                        <a href="/register" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl text-base font-medium relative overflow-hidden hover:shadow-xl hover:shadow-brand-primary/40 transition-all duration-300">
                          <span>Get Started Now</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
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
          } />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
