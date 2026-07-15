import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock } from 'lucide-react';
import DarkVeil from './DarkVeil';

export const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 768);
      setIsTablet(w >= 769 && w <= 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col items-center bg-[#020202] pt-20 pb-[60px] sm:pb-[80px]"
      style={
        isMobile
          ? { padding: '100px 20px 60px 20px', overflowX: 'hidden', width: '100%' }
          : isTablet
            ? { padding: '120px 40px 80px 40px', overflowX: 'hidden', width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }
            : {}
      }
    >
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
      <div className="relative z-[1] w-full flex-1 flex flex-col items-center">
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 w-full flex flex-col items-center justify-center flex-1 text-center">
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
            className="max-w-4xl -mt-[40px] md:-mt-[80px]"
          >
              <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="hero-headline font-bold text-white"
              style={{ 
                fontFamily: "'Inter', sans-serif", 
                letterSpacing: '-0.5px',
                fontSize: 'clamp(32px, 4.5vw, 56px)',
                lineHeight: '1.1',
              }}
            >
              <span style={{ 
                display: 'block',
                textAlign: isMobile ? 'center' : 'left',
                whiteSpace: isMobile ? 'normal' : 'nowrap',
                marginLeft: isMobile ? '0' : 'clamp(0px, 3vw, 40px)',
                fontSize: isMobile ? '30px' 
                        : isTablet ? '40px' 
                        : 'clamp(32px, 4.5vw, 56px)',
                wordBreak: 'break-word',
              }}>
                Quality That Never{' '}
                <span style={{ color: '#00AAFF' }}>Compromises.</span>
              </span>

              <span style={{ 
                display: 'block',
                textAlign: 'center',
                fontSize: isMobile ? '26px' 
                        : isTablet ? '34px' 
                        : 'clamp(28px, 3.8vw, 48px)',
                marginLeft: '0',
              }}>
                <span style={{ color: '#00AAFF' }}>Always</span> Instant.
              </span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
              className="hero-subline text-[#00AAFF] text-[11px] font-medium text-center tracking-[3px] mt-[16px]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              &mdash; Premium Digital Services &mdash;
            </motion.p>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="hero-body text-[13px] sm:text-[14px] lg:text-[15px] font-normal text-center leading-[1.7] max-w-[480px] mx-auto mt-[20px]"
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontFamily: "'Inter', sans-serif",
                ...(isMobile ? { fontSize: 14, maxWidth: '100%', padding: '0 10px', wordBreak: 'break-word' } : {}),
                ...(isTablet ? { fontSize: 15, maxWidth: 560, padding: 0 } : {}),
              }}
            >
              Premium Discord services built for speed, reliability, and instant delivery. Trusted by thousands of customers worldwide.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="hero-headline flex flex-wrap justify-center gap-[10px] mt-[32px]"
              style={
                isMobile
                  ? { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, padding: '0 10px' }
                  : isTablet
                    ? { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }
                    : {}
              }
            >
              {[
                { icon: <Shield size={12} />, label: "Secure Payments" },
                { icon: <Zap size={12} />, label: "Instant Delivery" },
                { icon: <Lock size={12} />, label: "24/7 Support" }
              ].map((pill, i) => (
                <div
                  key={i}
                  className="flex items-center gap-[5px] px-[14px] py-[6px] rounded-full border text-white text-[12px] font-medium"
                  style={{
                    borderColor: 'rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.07)',
                    fontFamily: "'Inter', sans-serif",
                    ...(isMobile ? { fontSize: 12, padding: '7px 14px' } : {}),
                    ...(isTablet ? { fontSize: 13, padding: '8px 16px' } : {}),
                  }}
                >
                  <span className="text-[#00AAFF] shrink-0">{pill.icon}</span>
                  {pill.label}
                </div>
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

