
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOGO_URL } from '../constants';
import { Download, Star } from 'lucide-react';

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
    <div className="relative flex flex-col items-center justify-center text-center pt-8 pb-4 overflow-hidden">
      <motion.img 
        onClick={scrollToMenu}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        whileHover={{ scale: 1.05 }}
        src={LOGO_URL} 
        alt="Ya3m Logo" 
        className="h-32 md:h-56 object-contain mb-2 cursor-pointer drop-shadow-[0_0_30px_rgba(250,181,32,0.4)]"
      />

      <AnimatePresence>
        {deferredPrompt && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInstallClick}
            className="z-20 mb-4 flex items-center gap-3 bg-[#FAB520] text-black border-2 border-black px-6 py-3 rounded-2xl transition-all shadow-lg font-black text-sm"
          >
            <Download className="w-4 h-4 animate-bounce" />
            <span>نزّل التطبيق يا عم</span>
          </motion.button>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <h2 className="text-xl md:text-3xl text-[#FAB520] font-black font-['Lalezar'] flex items-center gap-2 justify-center">
          <Star className="w-5 h-5 fill-current animate-pulse" />
          أكل بيتي بيتحضرلك طازة مخصوص
          <Star className="w-5 h-5 fill-current animate-pulse" />
        </h2>
      </motion.div>
    </div>
  );
};

export default Hero;
