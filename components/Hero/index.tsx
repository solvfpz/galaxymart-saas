import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shield, Zap, Lock } from 'lucide-react';
import DarkVeil from './DarkVeil';

const CYCLE_WORDS = ["QUALITY", "RELIABILITY", "EXCELLENCE", "PERFORMANCE", "SUPERIORITY"];

const CyclingWord = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % CYCLE_WORDS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const word = CYCLE_WORDS[index];
  const isLong = word.length >= 11;
  
  return (
    <span 
      className="inline-flex items-center origin-left whitespace-nowrap transition-all duration-500"
      style={{ 
        transform: isLong ? "scale(0.9)" : "scale(1)",
        letterSpacing: isLong ? "-0.06em" : "-0.05em"
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={word}
          initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(8px)", y: -8 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 font-black inline-block"
        >
          {word}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export const Hero = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col items-center bg-[#020202]">
      {/* DarkVeil Background Container */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none min-h-[500px]">
        <DarkVeil
          hueShift={27}
          noiseIntensity={0.02}
          scanlineIntensity={0.03}
          speed={2.0}
          scanlineFrequency={1.2}
          warpAmount={4.0}
          resolutionScale={1}
        />
        {/* Subtle Overlay to blend the shader better */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* All existing hero content stays here with zIndex 1 */}
      <div className="relative z-[1] w-full flex flex-col items-center">
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 w-full flex flex-col items-start justify-center min-h-screen pt-20 text-left">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.2
                }
              }
            }}
            className="max-w-4xl"
          >
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-4 tracking-tighter text-white uppercase whitespace-nowrap"
            >
              UNBEATABLE <CyclingWord /> <br />
              BEYOND BOUNDARIES.
            </motion.h1>

            {/* Refined Premium Label */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 }
              }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="h-[1px] w-8 bg-blue-500/50"></div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em]">Premium Digital Services</span>
            </motion.div>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-lg sm:text-xl text-zinc-400 mb-12 max-w-2xl font-light leading-relaxed"
            >
              Welcome to Galaxy Mart, where premium entertainment meets unmatched reliability. We don't just provide accounts; we deliver a seamless digital lifestyle. From high-tier streaming to exclusive gaming assets, experience the gold standard of service that sets us apart from the rest.
            </motion.p>
            
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="flex flex-wrap items-center justify-start gap-4 sm:gap-8"
            >
              {[
                { icon: <Shield className="w-4 h-4" />, label: "Secure Payments" },
                { icon: <Zap className="w-4 h-4" />, label: "Instant Delivery" },
                { icon: <Lock className="w-4 h-4" />, label: "24/7 Support" }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2.5 group cursor-default"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-sm group-hover:border-blue-400/30 group-hover:bg-blue-400/10 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium text-zinc-500 group-hover:text-white transition-colors">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20"></div>
    </section>
  );
};

