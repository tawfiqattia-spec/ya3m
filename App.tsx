
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import SpecialModal from './components/SpecialModals';
import { LOGO_URL, SANDWICH_ITEMS, TRAY_ITEMS, SWEET_ITEMS } from './constants';
import { SpecialOrderState } from './types';
import { Utensils, IceCream, Sandwich, ShoppingBasket, X, Trash2, Send, Plus, Minus, Truck, Loader2, AlertCircle, Phone, Facebook, MessageCircle, Download } from 'lucide-react';

const DELIVERY_FEE = 20;
const SAUCE_PRICE = 10;

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loaderText] = useState("دستوووووور! 🧞‍♂️");
  const [showDastoor, setShowDastoor] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [activeModal, setActiveModal] = useState<'sandwiches' | 'trays' | 'sweets' | null>(null);
  const [isGlobalSummaryOpen, setIsGlobalSummaryOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', phone: '', address: '', notes: '' });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [sandwichState, setSandwichState] = useState<SpecialOrderState & { ricePuddingVariants?: Record<string, 'plain' | 'nuts'> }>({
    quantities: Object.fromEntries(SANDWICH_ITEMS.map(i => [i.name, 0])),
    sauceQuantity: 0,
    breadChoices: {},
    ricePuddingVariants: {}
  });
  
  const [trayState, setTrayState] = useState<SpecialOrderState>({
    quantities: Object.fromEntries(TRAY_ITEMS.map(i => [i.name, 0])),
    sauceQuantity: 0
  });
  
  const [sweetState, setSweetState] = useState<SpecialOrderState & { ricePuddingVariants?: Record<string, 'plain' | 'nuts'> }>({
    quantities: Object.fromEntries(SWEET_ITEMS.map(i => [i.name, 0])),
    sauceQuantity: 0,
    ricePuddingVariants: {}
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadProgress(prev => {
        const next = prev + (Math.random() * 18);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return next;
      });
    }, 150);

    const dastoorTimer = setTimeout(() => {
      setShowDastoor(true);
    }, 1000);

    const promptHandler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', promptHandler);

    return () => {
      clearInterval(timer);
      clearTimeout(dastoorTimer);
      window.removeEventListener('beforeinstallprompt', promptHandler);
    };
  }, []);

  const updateGlobalQuantity = (name: string, category: string, delta: number) => {
    const update = (prev: any) => ({
      ...prev,
      quantities: { ...prev.quantities, [name]: Math.max(0, (prev.quantities[name] || 0) + delta) }
    });
    if (category === 'sandwiches') setSandwichState(update);
    else if (category === 'trays') setTrayState(update);
    else if (category === 'sweets') setSweetState(update);
  };

  const removeGlobalItem = (name: string, category: string) => {
    const reset = (prev: any) => ({ ...prev, quantities: { ...prev.quantities, [name]: 0 } });
    if (category === 'sandwiches') setSandwichState(reset);
    else if (category === 'trays') setTrayState(reset);
    else if (category === 'sweets') setSweetState(reset);
  };

  const subtotal = useMemo(() => {
    const calc = (state: any, items: {name: string, price: number}[]) => {
      let sum = items.reduce((acc, item) => {
        const q = state.quantities[item.name] || 0;
        let price = item.price;
        if (item.name === 'أرز بلبن يا عم') {
            const v = state.ricePuddingVariants?.[item.name] || 'plain';
            price = v === 'nuts' ? 40 : 30;
        }
        return acc + (price * q);
      }, 0);
      sum += (state.sauceQuantity * SAUCE_PRICE);
      return sum;
    };
    return calc(sandwichState, SANDWICH_ITEMS) + calc(trayState, TRAY_ITEMS) + calc(sweetState, SWEET_ITEMS);
  }, [sandwichState, trayState, sweetState]);

  const globalTotal = useMemo(() => subtotal > 0 ? subtotal + DELIVERY_FEE : 0, [subtotal]);

  const fullOrderSummary = useMemo(() => {
    const summary: any[] = [];
    SANDWICH_ITEMS.forEach(item => {
      const q = sandwichState.quantities[item.name] || 0;
      if (q > 0) {
          let price = item.price;
          let variant = undefined;
          if (item.name === 'أرز بلبن يا عم') {
              variant = sandwichState.ricePuddingVariants?.[item.name] || 'plain';
              price = variant === 'nuts' ? 40 : 30;
          }
          summary.push({ name: item.name, quantity: q, price, bread: sandwichState.breadChoices?.[item.name], variant, category: 'sandwiches' });
      }
    });
    TRAY_ITEMS.forEach(item => {
      const q = trayState.quantities[item.name] || 0;
      if (q > 0) summary.push({ name: item.name, quantity: q, price: item.price, category: 'trays' });
    });
    SWEET_ITEMS.forEach(item => {
      const q = sweetState.quantities[item.name] || 0;
      if (q > 0) {
          let price = item.price;
          let variant = undefined;
          if (item.name === 'أرز بلبن يا عم') {
              variant = sweetState.ricePuddingVariants?.[item.name] || 'plain';
              price = variant === 'nuts' ? 40 : 30;
          }
          summary.push({ name: item.name, quantity: q, price, variant, category: 'sweets' });
      }
    });
    const totalSauce = sandwichState.sauceQuantity;
    if (totalSauce > 0) {
      summary.push({ name: 'صوص أعجوبة السحري', quantity: totalSauce, price: SAUCE_PRICE, category: 'extra' });
    }
    return summary;
  }, [sandwichState, trayState, sweetState]);

  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInfo.name || !userInfo.phone || !userInfo.address) {
      alert('يا عم لازم تكتب بياناتك عشان نجيلك!');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
        setShowSuccess(true);
        setIsSubmitting(false);
    }, 1500);
  };

  const totalItemCount = useMemo(() => {
    const allQtys = [...Object.values(sandwichState.quantities), ...Object.values(trayState.quantities), ...Object.values(sweetState.quantities)] as number[];
    return allQtys.reduce((a, b) => (a || 0) + (b || 0), 0) + sandwichState.sauceQuantity;
  }, [sandwichState, trayState, sweetState]);

  return (
    <div className="min-h-screen bg-black text-white font-['Changa'] relative selection:bg-[#FAB520] selection:text-black overflow-x-hidden">
      
      <AnimatePresence>
        {loading && (
          <motion.div 
            key="loader"
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
          >
            <motion.div className="relative flex flex-col items-center">
                <motion.img 
                  animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  src={LOGO_URL} 
                  alt="Loading Logo" 
                  className="h-32 md:h-48 object-contain"
                />
                <div className="mt-12 flex flex-col items-center w-full">
                    <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-3">
                        <motion.div 
                          className="h-full bg-[#FAB520]" 
                          style={{ width: `${loadProgress}%` }}
                        />
                    </div>
                    <AnimatePresence>
                      {showDastoor && (
                        <div className="flex gap-1">
                          {loaderText.split('').map((char, i) => (
                            <motion.span 
                              key={i}
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: 'auto' }}
                              transition={{ 
                                delay: i * 0.08, 
                                type: 'spring',
                                damping: 12,
                                stiffness: 200
                              }}
                              className="text-[#FAB520] font-black text-2xl md:text-4xl font-['Lalezar'] drop-shadow-[0_0_15px_rgba(250,181,32,0.4)]"
                            >
                              {char}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <main className="max-w-7xl mx-auto px-4 pt-4 relative z-10 pb-32">
              <Hero />
              
              <section className="mt-12">
                <motion.h2 
                  whileInView={{ scale: [0.95, 1.05, 1] }}
                  className="text-3xl md:text-5xl font-normal text-center mb-12 text-[#FAB520] drop-shadow-[0_0_20px_rgba(250,181,32,0.5)] font-['Lalezar']"
                >
                  عايز تاكل إيه يا عم؟ 🤤
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'sandwiches', title: 'ركن السندوتشات', icon: Sandwich, color: 'bg-[#FAB520]', text: 'text-black' },
                    { id: 'trays', title: 'صواني وطواجن', icon: Utensils, color: 'bg-white/5 border-4 border-[#FAB520]', text: 'text-[#FAB520]' },
                    { id: 'sweets', title: 'حلويات يا عم', icon: IceCream, color: 'bg-white/10', text: 'text-white' }
                  ].map((cat, i) => (
                    <motion.div 
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }} 
                      onClick={() => setActiveModal(cat.id as any)} 
                      className={`cursor-pointer ${cat.color} p-6 md:p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 group relative shadow-2xl overflow-hidden`}
                    >
                      <cat.icon className={`w-16 h-16 md:w-20 md:h-20 ${cat.text} group-hover:rotate-12 transition-transform duration-500`} />
                      <h3 className={`text-3xl font-normal font-['Lalezar'] ${cat.text}`}>{cat.title}</h3>
                      <div className={`${cat.id === 'sandwiches' ? 'bg-black text-[#FAB520]' : 'bg-[#FAB520] text-black'} px-6 py-2 rounded-xl font-bold text-base`}>دخول المتجر</div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </main>

            {/* Cart Button */}
            <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 flex flex-col items-start gap-4 z-[100]">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsGlobalSummaryOpen(true)} 
                className="bg-[#FAB520] text-black p-4 md:p-5 rounded-full shadow-[0_15px_40px_rgba(250,181,32,0.6)] flex items-center gap-3 border-4 border-black"
              >
                <div className="relative">
                  <ShoppingBasket className="w-6 h-6 md:w-8 md:h-8" />
                  <AnimatePresence>
                    {totalItemCount > 0 && (
                      <motion.span 
                        key={totalItemCount}
                        initial={{ scale: 0 }} 
                        animate={{ scale: [0, 1.4, 1] }} 
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] md:text-xs font-bold w-5 h-5 md:w-7 h-7 rounded-full flex items-center justify-center border-2 border-white"
                      >
                        {totalItemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-lg font-bold hidden sm:inline">السلة يا عم</span>
              </motion.button>
            </div>

            <AnimatePresence>
              {isGlobalSummaryOpen && (
                <div className="fixed inset-0 z-[1000] flex justify-end items-stretch overflow-hidden">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsGlobalSummaryOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
                  <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="relative w-full md:w-[450px] h-full bg-[#0c0c0c] flex flex-col shadow-2xl">
                    <div className="p-5 md:p-6 flex justify-between items-center border-b border-white/5 bg-black/40 shrink-0">
                      <div className="flex items-center gap-3">
                        <ShoppingBasket className="text-[#FAB520] w-5 h-5" />
                        <h2 className="text-2xl font-normal font-['Lalezar']">طلباتك يا عم</h2>
                      </div>
                      <button onClick={() => setIsGlobalSummaryOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-red-500/20"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 scrollbar-hide">
                      {fullOrderSummary.map((item, idx) => (
                        <motion.div layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={`${item.name}-${idx}`} className="p-4 bg-white/5 rounded-[1.5rem] border border-white/5 shadow-inner transition-colors hover:bg-white/10">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                                <div className="flex gap-2 flex-wrap">
                                    {item.variant && <span className="text-[10px] font-bold text-[#FAB520] bg-[#FAB520]/10 px-2 py-0.5 rounded-full">{item.variant === 'nuts' ? 'بالمكسرات' : 'سادة'}</span>}
                                    {item.bread && <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">خبز {item.bread === 'baladi' ? 'بلدي' : 'فينو فرنسي'}</span>}
                                </div>
                            </div>
                            <button onClick={() => removeGlobalItem(item.name, item.category)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                          </div>
                          <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-xl border border-white/5">
                            <span className="text-xl font-bold text-[#FAB520]">{item.quantity * item.price} ج.م</span>
                            <div className="flex items-center gap-3">
                              <button onClick={() => updateGlobalQuantity(item.name, item.category, -1)} className="text-[#FAB520] bg-white/5 p-1.5 rounded-lg active:scale-125 transition-transform"><Minus className="w-4 h-4" /></button>
                              <span className="font-bold text-lg w-6 text-center text-white">{item.quantity}</span>
                              <button onClick={() => updateGlobalQuantity(item.name, item.category, 1)} className="text-[#FAB520] bg-white/5 p-1.5 rounded-lg active:scale-125 transition-transform"><Plus className="w-4 h-4" /></button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {fullOrderSummary.length > 0 && (
                      <div className="p-5 md:p-6 border-t border-[#FAB520]/20 bg-black/80 space-y-4 pb-10">
                        <div className="flex justify-between items-end mb-1 px-1">
                            <span className="text-3xl font-bold text-[#FAB520]">{globalTotal} ج.م</span>
                        </div>
                        <form onSubmit={handleFinalSubmit} className="space-y-3">
                          <input required placeholder="اسمك" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#FAB520] font-bold text-sm" value={userInfo.name} onChange={e => setUserInfo({...userInfo, name: e.target.value})} />
                          <input required type="tel" placeholder="تليفونك" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#FAB520] font-bold text-sm" value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} />
                          <input required placeholder="العنوان فين بالضبط؟" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-[#FAB520] font-bold text-sm" value={userInfo.address} onChange={e => setUserInfo({...userInfo, address: e.target.value})} />
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting} className="w-full py-4 bg-[#FAB520] text-black font-bold text-xl rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 mt-2">{isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-6 h-6" />}{isSubmitting ? 'جاري الطيران...' : 'اطلب الآن يا عم!'}</motion.button>
                        </form>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <SpecialModal isOpen={activeModal === 'sandwiches'} onClose={() => setActiveModal(null)} title="ركن السندوتشات" image="https://sayedsamkary.com/unnamed.jpg" type="sandwiches" globalTotal={globalTotal} subtotal={subtotal} deliveryFee={DELIVERY_FEE} persistentState={sandwichState} onUpdateState={(ns) => setSandwichState(ns)} onFinalSubmit={handleFinalSubmit} initialItems={SANDWICH_ITEMS} fullOrderSummary={fullOrderSummary} updateGlobalQuantity={updateGlobalQuantity} removeGlobalItem={removeGlobalItem} />
            <SpecialModal isOpen={activeModal === 'trays'} onClose={() => setActiveModal(null)} title="صواني وطواجن" image="https://sayedsamkary.com/%D8%B5%D9%8A%D9%86%D9%8A%D8%A9%20%D9%83%D9%88%D8%B3%D8%A9%20%D8%A8%D8%A7%D9%84%D8%A8%D8%B4%D8%A7%D9%85%D9%84.jpg" type="trays" globalTotal={globalTotal} subtotal={subtotal} deliveryFee={DELIVERY_FEE} persistentState={trayState} onUpdateState={(ns) => setTrayState(ns)} onFinalSubmit={handleFinalSubmit} initialItems={TRAY_ITEMS} fullOrderSummary={fullOrderSummary} updateGlobalQuantity={updateGlobalQuantity} removeGlobalItem={removeGlobalItem} />
            <SpecialModal isOpen={activeModal === 'sweets'} onClose={() => setActiveModal(null)} title="حلويات يا عم" image="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80" type="sweets" globalTotal={globalTotal} subtotal={subtotal} deliveryFee={DELIVERY_FEE} persistentState={sweetState} onUpdateState={(ns) => setSweetState(ns)} onFinalSubmit={handleFinalSubmit} initialItems={SWEET_ITEMS} fullOrderSummary={fullOrderSummary} updateGlobalQuantity={updateGlobalQuantity} removeGlobalItem={removeGlobalItem} />

            <AnimatePresence>
              {showSuccess && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center p-8 text-center">
                  <motion.div animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }} className="bg-[#FAB520] p-10 rounded-full mb-8 shadow-[0_0_100px_rgba(250,181,32,0.6)]"><Send className="w-16 h-16 text-black" /></motion.div>
                  <h2 className="text-5xl font-['Lalezar'] text-[#FAB520] mb-4">طلبك طار عندنا!</h2>
                  <p className="text-xl text-gray-400 font-bold mb-8">هيكون عندك خلال 25 دقيقة بالضبط 🛵💨</p>
                  <motion.button whileHover={{ scale: 1.1 }} onClick={() => setShowSuccess(false)} className="mt-12 text-gray-500 font-bold hover:text-white">رجوع للرئيسية</motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
