import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Lock } from 'lucide-react';
import DarkVeil from './DarkVeil';

export const Hero = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col items-center bg-[#020202] pt-20 pb-[60px] sm:pb-[80px]">
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
              className="hero-headline text-[38px] sm:text-[48px] lg:text-[66px] font-bold text-white leading-[1.1] max-w-[750px]"
              style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' }}
            >
              {/* Line 1 — LEFT aligned with whole sentence */}
              <span
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginLeft: '-130px',
                  whiteSpace: 'nowrap'
                }}
              >
                Quality That Never{' '} <span className="text-[#00AAFF]">Compromises.</span>
              </span>

              {/* Line 2 — CENTER aligned independently */}
              <span
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginLeft: '0px'
                }}
              >
                <span className="text-[#00AAFF]">Always</span> Instant.
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
              style={{ color: 'rgba(255,255,255,0.65)', fontFamily: "'Inter', sans-serif" }}
            >
              Premium Discord services built for speed, reliability, and instant delivery. Trusted by thousands of customers worldwide.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="hero-headline flex flex-wrap justify-center gap-[10px] mt-[32px]"
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
                    fontFamily: "'Inter', sans-serif"
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

