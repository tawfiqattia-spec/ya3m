
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import SpecialModal from './components/SpecialModals';
import { LOGO_URL, SANDWICH_ITEMS, TRAY_ITEMS, SWEET_ITEMS } from './constants';
import { SpecialOrderState } from './types';
/* Added Sparkles to the import list from lucide-react to fix the undefined variable error */
import { Utensils, IceCream, Sandwich, ShoppingBasket, X, Trash2, Send, Plus, Minus, Truck, Loader2, Star, Phone, Facebook, MessageCircle, Download, Sparkles } from 'lucide-react';

const DELIVERY_FEE = 20;
const SAUCE_PRICE = 10;

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loaderText] = useState("دستوووووور! 🧞‍♂️");
  const [showDastoor, setShowDastoor] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);

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
        const next = prev + (Math.random() * 20);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return next;
      });
    }, 120);

    const dastoorTimer = setTimeout(() => {
      setShowDastoor(true);
    }, 800);

    return () => {
      clearInterval(timer);
      clearTimeout(dastoorTimer);
    };
  }, []);

  const triggerCartAnimation = () => {
    setCartAnimate(true);
    setTimeout(() => setCartAnimate(false), 400);
  };

  const updateGlobalQuantity = (name: string, category: string, delta: number) => {
    if (delta > 0) triggerCartAnimation();
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
    if (sandwichState.sauceQuantity > 0) {
      summary.push({ name: 'صوص أعجوبة السحري', quantity: sandwichState.sauceQuantity, price: SAUCE_PRICE, category: 'extra' });
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
    }, 1800);
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
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
          >
            <motion.div className="relative flex flex-col items-center">
                <motion.img 
                  animate={{ 
                    scale: [1, 1.1, 1], 
                    rotate: [0, -5, 5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  src={LOGO_URL} 
                  alt="Loading Logo" 
                  className="h-36 md:h-56 object-contain mb-8"
                />
                <div className="mt-4 flex flex-col items-center w-full">
                    <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mb-6 border border-white/5">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#FAB520] to-[#ffda85]" 
                          style={{ width: `${loadProgress}%` }}
                        />
                    </div>
                    <AnimatePresence>
                      {showDastoor && (
                        <div className="flex gap-2">
                          {loaderText.split('').map((char, i) => (
                            <motion.span 
                              key={i}
                              initial={{ opacity: 0, scale: 0, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ 
                                delay: i * 0.08, 
                                type: 'spring',
                                damping: 10,
                                stiffness: 200
                              }}
                              className="text-[#FAB520] font-black text-3xl md:text-6xl font-['Lalezar'] drop-shadow-[0_0_20px_rgba(250,181,32,0.6)]"
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
              
              <section className="mt-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-7xl font-normal mb-4 text-[#FAB520] font-['Lalezar'] drop-shadow-xl">
                    عايز تاكل إيه يا عم؟ 🤤
                  </h2>
                  <p className="text-gray-400 font-bold text-lg md:text-xl">اختار القسم ودلع كرشك في ثواني!</p>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { id: 'sandwiches', title: 'ركن السندوتشات', icon: Sandwich, color: 'bg-[#FAB520]', text: 'text-black', shadow: 'shadow-[#FAB520]/20' },
                    { id: 'trays', title: 'صواني وطواجن', icon: Utensils, color: 'bg-white/5 border-4 border-[#FAB520]', text: 'text-[#FAB520]', shadow: 'shadow-white/5' },
                    { id: 'sweets', title: 'حلويات يا عم', icon: IceCream, color: 'bg-white/10 border-4 border-white/5', text: 'text-white', shadow: 'shadow-white/10' }
                  ].map((cat, i) => (
                    <motion.div 
                      key={cat.id}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, type: 'spring' }}
                      whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? -2 : 2 }} 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveModal(cat.id as any)} 
                      className={`cursor-pointer ${cat.color} p-10 rounded-[3rem] flex flex-col items-center justify-center text-center gap-6 group relative shadow-2xl transition-all overflow-hidden ${cat.shadow}`}
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      >
                        <cat.icon className={`w-24 h-24 ${cat.text} group-hover:scale-110 transition-transform`} />
                      </motion.div>
                      <h3 className={`text-4xl font-normal font-['Lalezar'] ${cat.text}`}>{cat.title}</h3>
                      <div className={`${cat.id === 'sandwiches' ? 'bg-black text-[#FAB520]' : 'bg-[#FAB520] text-black'} px-10 py-3 rounded-2xl font-black text-lg shadow-lg`}>دخول المتجر</div>
                      
                      {/* Decorative sparkle */}
                      <Sparkles className="absolute top-4 right-4 text-white/10 w-12 h-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </section>
            </main>

            {/* Global Animated Cart Button */}
            <div className="fixed bottom-8 left-8 md:bottom-12 md:left-12 flex flex-col items-start gap-4 z-[100]">
              <motion.button 
                whileHover={{ scale: 1.15, rotate: 5 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => setIsGlobalSummaryOpen(true)} 
                className={`bg-[#FAB520] text-black p-5 md:p-7 rounded-full shadow-[0_20px_50px_rgba(250,181,32,0.6)] flex items-center gap-4 border-4 border-black transition-all ${cartAnimate ? 'cart-boing' : ''}`}
              >
                <div className="relative">
                  <ShoppingBasket className="w-8 h-8 md:w-10 md:h-10" />
                  <AnimatePresence>
                    {totalItemCount > 0 && (
                      <motion.span 
                        key={totalItemCount}
                        initial={{ scale: 0, rotate: -45 }} 
                        animate={{ scale: 1, rotate: 0 }} 
                        exit={{ scale: 0 }}
                        className="absolute -top-3 -right-3 bg-red-600 text-white text-xs md:text-sm font-black w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center border-4 border-white shadow-xl"
                      >
                        {totalItemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-2xl font-['Lalezar'] hidden sm:inline">السلة يا عم</span>
              </motion.button>
            </div>

            <AnimatePresence>
              {isGlobalSummaryOpen && (
                <div className="fixed inset-0 z-[1000] flex justify-end items-stretch overflow-hidden">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsGlobalSummaryOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
                  <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 250 }} className="relative w-full md:w-[500px] h-full bg-[#0c0c0c] flex flex-col shadow-2xl border-l-4 border-[#FAB520]">
                    <div className="p-6 md:p-10 flex justify-between items-center border-b border-white/5 bg-black/40 shrink-0">
                      <div className="flex items-center gap-4">
                        <ShoppingBasket className="text-[#FAB520] w-8 h-8" />
                        <h2 className="text-3xl font-normal font-['Lalezar']">طلباتك يا عم</h2>
                      </div>
                      <button onClick={() => setIsGlobalSummaryOpen(false)} className="p-3 bg-white/5 rounded-full hover:bg-red-500/20 transition-colors"><X className="w-6 h-6" /></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide">
                      {fullOrderSummary.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full opacity-30 text-center space-y-4">
                          <ShoppingBasket className="w-24 h-24" />
                          <p className="text-2xl font-bold">لسه مفيش أكل يا عم!</p>
                        </div>
                      ) : (
                        fullOrderSummary.map((item, idx) => (
                          <motion.div 
                            layout 
                            initial={{ opacity: 0, x: 30 }} 
                            animate={{ opacity: 1, x: 0 }} 
                            key={`${item.name}-${idx}`} 
                            className="p-6 bg-white/5 rounded-[2rem] border-2 border-white/5 transition-all hover:bg-white/10 hover:border-[#FAB520]/20"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                  <h4 className="font-black text-xl mb-2">{item.name}</h4>
                                  <div className="flex gap-3 flex-wrap">
                                      {item.variant && <span className="text-xs font-black text-[#FAB520] bg-[#FAB520]/10 px-3 py-1 rounded-full border border-[#FAB520]/20">{item.variant === 'nuts' ? 'بالمكسرات' : 'سادة'}</span>}
                                      {item.bread && <span className="text-xs font-black text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">خبز {item.bread === 'baladi' ? 'بلدي' : 'فينو فرنسي'}</span>}
                                  </div>
                              </div>
                              <motion.button whileTap={{ scale: 0.8 }} onClick={() => removeGlobalItem(item.name, item.category)} className="text-gray-600 hover:text-red-500 p-2"><Trash2 className="w-6 h-6" /></motion.button>
                            </div>
                            <div className="flex justify-between items-center bg-black/50 p-4 rounded-2xl border border-white/10">
                              <span className="text-2xl font-black text-[#FAB520]">{item.quantity * item.price} ج.م</span>
                              <div className="flex items-center gap-4">
                                <motion.button whileTap={{ scale: 1.2 }} onClick={() => updateGlobalQuantity(item.name, item.category, -1)} className="text-[#FAB520] bg-white/5 p-2 rounded-xl"><Minus className="w-5 h-5" /></motion.button>
                                <span className="font-black text-xl w-8 text-center">{item.quantity}</span>
                                <motion.button whileTap={{ scale: 1.2 }} onClick={() => updateGlobalQuantity(item.name, item.category, 1)} className="text-[#FAB520] bg-white/5 p-2 rounded-xl"><Plus className="w-5 h-5" /></motion.button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>

                    {fullOrderSummary.length > 0 && (
                      <div className="p-8 md:p-10 border-t border-[#FAB520]/30 bg-black/90 space-y-5 pb-12">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 font-bold">الحساب الكلي:</span>
                            <span className="text-4xl font-black text-[#FAB520] drop-shadow-lg">{globalTotal} ج.م</span>
                        </div>
                        <form onSubmit={handleFinalSubmit} className="space-y-4">
                          <input required placeholder="اسمك" className="w-full bg-white/5 border-2 border-white/10 p-5 rounded-2xl outline-none focus:border-[#FAB520] font-bold text-lg transition-all" value={userInfo.name} onChange={e => setUserInfo({...userInfo, name: e.target.value})} />
                          <input required type="tel" placeholder="رقم تليفونك" className="w-full bg-white/5 border-2 border-white/10 p-5 rounded-2xl outline-none focus:border-[#FAB520] font-bold text-lg transition-all" value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} />
                          <input required placeholder="العنوان بالضبط يا عم؟" className="w-full bg-white/5 border-2 border-white/10 p-5 rounded-2xl outline-none focus:border-[#FAB520] font-bold text-lg transition-all" value={userInfo.address} onChange={e => setUserInfo({...userInfo, address: e.target.value})} />
                          <motion.button 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }} 
                            disabled={isSubmitting} 
                            className="w-full py-6 bg-[#FAB520] text-black font-black text-2xl rounded-3xl shadow-[0_15px_40px_rgba(250,181,32,0.4)] flex items-center justify-center gap-4 disabled:opacity-50 mt-4 font-['Lalezar']"
                          >
                            {isSubmitting ? <Loader2 className="animate-spin w-8 h-8" /> : <Send className="w-8 h-8" />}
                            {isSubmitting ? 'جاري الطيران...' : 'اطلب دلوقتي يا عم!'}
                          </motion.button>
                        </form>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <SpecialModal isOpen={activeModal === 'sandwiches'} onClose={() => setActiveModal(null)} title="ركن السندوتشات" image="https://ya3m.com/pic/ya3m-kebda.png" type="sandwiches" globalTotal={globalTotal} subtotal={subtotal} deliveryFee={DELIVERY_FEE} persistentState={sandwichState} onUpdateState={(ns) => setSandwichState(ns)} onFinalSubmit={handleFinalSubmit} initialItems={SANDWICH_ITEMS} fullOrderSummary={fullOrderSummary} updateGlobalQuantity={updateGlobalQuantity} removeGlobalItem={removeGlobalItem} />
            <SpecialModal isOpen={activeModal === 'trays'} onClose={() => setActiveModal(null)} title="صواني وطواجن" image="https://ya3m.com/pic/baashamil.png" type="trays" globalTotal={globalTotal} subtotal={subtotal} deliveryFee={DELIVERY_FEE} persistentState={trayState} onUpdateState={(ns) => setTrayState(ns)} onFinalSubmit={handleFinalSubmit} initialItems={TRAY_ITEMS} fullOrderSummary={fullOrderSummary} updateGlobalQuantity={updateGlobalQuantity} removeGlobalItem={removeGlobalItem} />
            <SpecialModal isOpen={activeModal === 'sweets'} onClose={() => setActiveModal(null)} title="حلويات يا عم" image="https://ya3m.com/pic/roz.png" type="sweets" globalTotal={globalTotal} subtotal={subtotal} deliveryFee={DELIVERY_FEE} persistentState={sweetState} onUpdateState={(ns) => setSweetState(ns)} onFinalSubmit={handleFinalSubmit} initialItems={SWEET_ITEMS} fullOrderSummary={fullOrderSummary} updateGlobalQuantity={updateGlobalQuantity} removeGlobalItem={removeGlobalItem} />

            <AnimatePresence>
              {showSuccess && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[5000] bg-black flex flex-col items-center justify-center p-8 text-center overflow-hidden">
                  <motion.div 
                    animate={{ 
                      scale: [0, 1.4, 1], 
                      rotate: [0, 720],
                    }} 
                    transition={{ duration: 1, type: 'spring' }}
                    className="bg-[#FAB520] p-16 rounded-full mb-10 shadow-[0_0_120px_rgba(250,181,32,0.7)] text-black relative"
                  >
                    <Send className="w-24 h-24" />
                    <motion.div 
                      animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-white rounded-full"
                    />
                  </motion.div>
                  <h2 className="text-6xl md:text-8xl font-normal font-['Lalezar'] text-[#FAB520] mb-6 drop-shadow-2xl">طلبك طار عندنا!</h2>
                  <p className="text-2xl text-gray-400 font-black mb-12">هيكون عندك خلال 25 دقيقة بالضبط.. استعد! 🛵💨</p>
                  <motion.button 
                    whileHover={{ scale: 1.2, color: '#FAB520' }} 
                    onClick={() => setShowSuccess(false)} 
                    className="mt-12 text-gray-600 font-black text-xl hover:text-white transition-colors"
                  >
                    رجوع للرئيسية يا عم
                  </motion.button>
                  
                  {/* Decorative celebration elements */}
                  <Star className="absolute top-20 left-[10%] text-[#FAB520] w-12 h-12 animate-pulse" />
                  <Star className="absolute bottom-40 right-[15%] text-[#FAB520] w-16 h-16 animate-pulse" />
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
