
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOGO_URL } from '../constants';
import { Truck, ChevronDown, Star, Download } from 'lucide-react';

const Hero: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
    }
  };

  const scrollToMenu = () => {
    const section = document.getElementById('ordering-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-center text-center py-10 md:py-16 overflow-hidden cursor-pointer group"
    >
      {/* Dynamic Background Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-[#FAB520]/10 blur-[120px] rounded-full z-0 pointer-events-none"
      />

      <motion.img 
        onClick={scrollToMenu}
        initial={{ y: -100, opacity: 0, rotate: -20 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        src={LOGO_URL} 
        alt="Ya3m Logo" 
        className="h-32 md:h-48 object-contain mb-6 drop-shadow-[0_0_40px_rgba(250,181,32,0.4)] relative z-10"
      />
      
      {/* App Install Button - Positioned Under Logo */}
      <AnimatePresence>
        {deferredPrompt && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={handleInstallClick}
            className="z-20 mb-8 flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/20 px-5 py-3 rounded-2xl transition-all shadow-xl group/btn"
          >
            <img src={LOGO_URL} className="h-8 w-8 object-contain" alt="app icon" />
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-500 leading-none">تطبيق يا عم</p>
              <p className="text-sm font-bold text-[#FAB520]">تثبيت كـ تطبيق موبايل</p>
            </div>
            <Download className="w-5 h-5 text-[#FAB520] group-hover/btn:translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        onClick={scrollToMenu}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="relative z-10"
      >
        <h1 className="text-5xl md:text-7xl font-normal mb-6 leading-[1.1] tracking-tight font-['Lalezar'] group-hover:text-[#FAB520] transition-colors">
          أسرع دليفري في <br/> 
          <span className="text-[#FAB520] drop-shadow-[0_5px_15_rgba(250,181,32,0.3)]">مصر يا عم!</span>
        </h1>
        
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-[2rem] inline-block shadow-2xl"
          >
            <p className="text-lg md:text-xl text-gray-300 font-bold mb-2">
              كبدة • سجق • حواوشي
            </p>
            <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-[#FAB520]">
                <Star className="w-3 h-3 fill-current" />
                <span className="font-bold">أكل بيتي عالي الجودة بيتحضرلك أول بأول</span>
                <Star className="w-3 h-3 fill-current" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 text-[#FAB520] bg-[#FAB520]/10 px-4 py-2 rounded-full border border-[#FAB520]/20 font-bold text-xs md:text-sm"
          >
            <Truck className="w-4 h-4" />
            <span>خدمة التوصيل بـ 20 جنيه بس!</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-4 text-[#FAB520]/50"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Entertaining floating elements */}
      <motion.div
        animate={{ 
          x: [-200, 1200],
          y: [0, -10, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 left-0 text-5xl opacity-40 pointer-events-none select-none z-0"
      >
        🛵💨
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-20 right-[10%] text-4xl opacity-20 pointer-events-none z-0"
      >
        🥪
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -15, 15, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-40 left-[15%] text-4xl opacity-20 pointer-events-none z-0"
      >
        🥘
      </motion.div>
    </div>
  );
};

export default Hero;
