
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
      className="relative flex flex-col items-center justify-center text-center py-10 md:py-24 overflow-hidden cursor-pointer group"
    >
      {/* Dynamic Background Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.4, 0.2],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-tr from-[#FAB520]/20 to-transparent blur-[150px] rounded-full z-0 pointer-events-none"
      />

      <motion.img 
        onClick={scrollToMenu}
        initial={{ y: -100, opacity: 0, rotate: -20, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.6, duration: 1.2 }}
        whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
        src={LOGO_URL} 
        alt="Ya3m Logo" 
        className="h-32 md:h-56 object-contain mb-6 drop-shadow-[0_0_60px_rgba(250,181,32,0.5)] relative z-10 logo-wobble"
      />
      
      {/* App Install Button */}
      <AnimatePresence>
        {deferredPrompt && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInstallClick}
            className="z-20 mb-8 flex items-center gap-3 bg-[#FAB520] text-black border-4 border-black px-6 py-4 rounded-3xl transition-all shadow-[0_10px_30px_rgba(250,181,32,0.4)] group/btn"
          >
            <Download className="w-6 h-6 animate-bounce" />
            <div className="text-right">
              <p className="text-xs font-black leading-none uppercase">نزّل التطبيق</p>
              <p className="text-lg font-bold">يا عم على موبايلك</p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        onClick={scrollToMenu}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
        className="relative z-10"
      >
        <h1 className="text-6xl md:text-8xl font-normal mb-6 leading-[1] tracking-tighter font-['Lalezar'] transition-colors">
          أسرع دليفري في <br/> 
          <span className="text-[#FAB520] drop-shadow-[0_10px_30px_rgba(250,181,32,0.5)] inline-block hover:scale-110 transition-transform cursor-pointer">مصر يا عم!</span>
        </h1>
        
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/5 backdrop-blur-xl border-2 border-[#FAB520]/20 px-8 py-5 rounded-[3rem] inline-block shadow-2xl"
          >
            <p className="text-xl md:text-2xl text-gray-200 font-bold mb-2">
              كبدة • سجق • حواوشي
            </p>
            <div className="flex items-center justify-center gap-3 text-sm md:text-base text-[#FAB520]">
                <Star className="w-4 h-4 fill-current animate-spin-slow" />
                <span className="font-black">أكل بيتي بيتحضرلك طازة مخصوص</span>
                <Star className="w-4 h-4 fill-current animate-spin-slow" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: 'spring' }}
            className="flex items-center gap-3 text-black bg-[#FAB520] px-6 py-3 rounded-full font-black text-sm md:text-lg shadow-[0_15px_35px_rgba(250,181,32,0.5)]"
          >
            <Truck className="w-6 h-6" />
            <span>التوصيل بـ 20 جنيه بس.. يا بلاش!</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-6 text-[#FAB520]"
          >
            <ChevronDown className="w-12 h-12" />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Fun Background Assets */}
      {[
        { icon: '🍔', top: '15%', left: '10%', delay: 0 },
        { icon: '🥪', top: '25%', right: '15%', delay: 1 },
        { icon: '🥘', bottom: '20%', left: '20%', delay: 2 },
        { icon: '🍟', bottom: '30%', right: '10%', delay: 1.5 },
        { icon: '🌮', top: '50%', left: '5%', delay: 0.5 },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            y: [0, -40, 0],
            rotate: [0, 20, -20, 0]
          }}
          transition={{ 
            duration: 6 + i, 
            repeat: Infinity, 
            delay: item.delay,
            ease: "easeInOut"
          }}
          style={{ 
            position: 'absolute', 
            top: item.top, 
            left: item.left, 
            right: item.right, 
            bottom: item.bottom,
            fontSize: '3rem'
          }}
          className="pointer-events-none z-0 hidden md:block"
        >
          {item.icon}
        </motion.div>
      ))}

      <div className="absolute bottom-10 left-0 text-6xl opacity-30 scooter pointer-events-none select-none z-0">
        🛵💨
      </div>
    </div>
  );
};

export default Hero;
