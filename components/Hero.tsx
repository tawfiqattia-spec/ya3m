
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
    <div className="relative flex flex-col items-center justify-center text-center py-12 md:py-28 overflow-hidden group">
      {/* Interactive Background Elements */}
      <motion.div 
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,181,32,0.1)_0%,transparent_70%)] pointer-events-none"
      />

      {/* Floating Food Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
          {['🍔', '🌭', '🥪', '🥘', '🍟'].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-5xl opacity-20"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%" 
              }}
              animate={{ 
                y: [0, -50, 0],
                rotate: [0, 360],
                scale: [1, 1.5, 1]
              }}
              transition={{ 
                duration: 5 + Math.random() * 10, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {emoji}
            </motion.div>
          ))}
      </div>

      <motion.img 
        onClick={scrollToMenu}
        initial={{ y: -50, opacity: 0, scale: 0.5 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 100 }}
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        src={LOGO_URL} 
        alt="Ya3m Logo" 
        className="h-32 md:h-56 object-contain mb-8 cursor-pointer drop-shadow-[0_0_30px_rgba(250,181,32,0.4)]"
      />
      
      <AnimatePresence>
        {deferredPrompt && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleInstallClick}
            className="z-20 mb-10 flex items-center gap-4 bg-[#FAB520] text-black border-4 border-black px-8 py-5 rounded-3xl transition-all shadow-[0_15px_30px_rgba(250,181,32,0.3)] font-black"
          >
            <Download className="w-6 h-6 animate-bounce" />
            <div className="text-right">
              <p className="text-xs uppercase leading-none">نزّل التطبيق</p>
              <p className="text-lg">يا عم على موبايلك</p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-6xl md:text-8xl font-normal mb-8 leading-[1] font-['Lalezar']">
          أسرع دليفري في <br/> 
          <span className="text-[#FAB520] drop-shadow-[0_10px_20px_rgba(250,181,32,0.4)]">مصر يا عم!</span>
        </h1>
        
        <div className="flex flex-col items-center gap-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 backdrop-blur-md border-2 border-[#FAB520]/20 px-10 py-6 rounded-[3rem] inline-block shadow-2xl"
          >
            <p className="text-2xl md:text-3xl text-gray-200 font-bold mb-3">
              كبدة • سجق • حواوشي
            </p>
            <div className="flex items-center justify-center gap-3 text-[#FAB520] font-black">
                <Star className="w-5 h-5 fill-current animate-pulse" />
                <span>أكل بيتي بيتحضرلك طازة مخصوص</span>
                <Star className="w-5 h-5 fill-current animate-pulse" />
            </div>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-3 text-black bg-[#FAB520] px-8 py-4 rounded-full font-black text-lg md:text-xl shadow-[0_20px_40px_rgba(250,181,32,0.5)] border-4 border-black"
          >
            <Truck className="w-7 h-7" />
            <span>التوصيل بـ 20 جنيه بس.. يا بلاش!</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="mt-8 text-[#FAB520]"
          >
            <ChevronDown className="w-12 h-12" />
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-5 left-0 text-7xl opacity-20 scooter pointer-events-none select-none">
        🛵💨
      </div>
    </div>
  );
};

export default Hero;
