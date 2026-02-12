
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Sparkles, Truck } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  image: string;
  initialItems: { name: string; price: number; image?: string }[];
  type: 'sandwiches' | 'trays' | 'sweets';
  globalTotal: number;
  subtotal: number;
  deliveryFee: number;
  persistentState: { 
    quantities: Record<string, number>; 
    sauceQuantity: number;
    breadChoices?: Record<string, string>;
  };
  onUpdateState: (newState: any) => void;
  onFinalSubmit: (userInfo: any) => void;
  fullOrderSummary: any[];
  updateGlobalQuantity: (name: string, category: string, delta: number) => void;
  removeGlobalItem: (name: string, category: string) => void;
}

const SpecialModal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  image, 
  initialItems, 
  type,
  globalTotal,
  deliveryFee,
  persistentState,
  onUpdateState,
  onFinalSubmit
}) => {
  const handleUpdateQty = (name: string, delta: number) => {
    const newQty = Math.max(0, (persistentState.quantities[name] || 0) + delta);
    onUpdateState({
      ...persistentState,
      quantities: { ...persistentState.quantities, [name]: newQty }
    });
  };

  const handleOptionChoice = (name: string, choice: string) => {
    onUpdateState({
      ...persistentState,
      breadChoices: {
        ...(persistentState.breadChoices || {}),
        [name]: choice
      }
    });
  };

  const handleSauceUpdate = (delta: number) => {
    onUpdateState({
      ...persistentState,
      sauceQuantity: Math.max(0, (persistentState.sauceQuantity || 0) + delta)
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
        
        <motion.div 
          initial={{ y: '100%' }} 
          animate={{ y: 0 }} 
          exit={{ y: '100%' }} 
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full md:max-w-4xl h-[95dvh] md:h-auto md:max-h-[85vh] bg-[#0c0c0c] md:rounded-[3rem] border-t-4 md:border-2 border-[#FAB520] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(250,181,32,0.3)] font-['Changa']"
        >
          {/* Header Area */}
          <div className="relative h-40 md:h-56 shrink-0">
            <img src={image} className="w-full h-full object-cover" alt={title} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent" />
            <button onClick={onClose} className="absolute top-6 left-6 p-3 bg-black/50 rounded-full text-white backdrop-blur-md z-20"><X className="w-5 h-5" /></button>
            <div className="absolute bottom-6 right-8 z-10">
              <h2 className="text-3xl md:text-5xl font-normal text-white drop-shadow-lg font-['Lalezar']">{title}</h2>
            </div>
          </div>

          {/* Menu Items List - Scrollable */}
          <div className="flex-1 overflow-y-auto px-5 md:px-10 py-6 space-y-5 scrollbar-hide">
            <div className="space-y-4">
              {initialItems.map((item, i) => {
                const qty = persistentState.quantities[item.name] || 0;
                const choice = persistentState.breadChoices?.[item.name] || (item.name === 'حلبسة (حمص الشام)' ? 'normal' : 'baladi');
                
                const showBread = type === 'sandwiches' && !['حواوشي يا عم', 'سندوتش فراخ استربس', 'صينية شهية لفرد واحد', 'مكرونة بالبشامل لفرد واحد', 'كرات بطاطس بالجبنة لفرد واحد', 'حلبسة (حمص الشام)'].includes(item.name);
                const showDrinkOption = item.name === 'حلبسة (حمص الشام)';

                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={item.name} 
                    className={`p-4 md:p-5 rounded-[1.5rem] border-2 transition-all ${qty > 0 ? 'bg-white/5 border-[#FAB520] shadow-xl' : 'bg-white/5 border-transparent'}`}
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        {item.image && (
                           <div className="w-16 h-16 shrink-0 rounded-2xl overflow-hidden border border-white/10">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                           </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold mb-1">{item.name}</h3>
                          <p className="text-[#FAB520] font-bold text-base">{item.price} ج.م</p>
                          {item.name === 'صينية شهية لفرد واحد' && <p className="text-gray-500 text-xs mt-1">تشكيلة كفته وسجق</p>}
                          {item.name === 'مكرونة بالبشامل لفرد واحد' && <p className="text-gray-500 text-xs mt-1">أحلى مكرونة بشاميل سخنة</p>}
                          {item.name === 'كرات بطاطس بالجبنة لفرد واحد' && <p className="text-gray-500 text-xs mt-1">مقرمشة من برة وغرقانة جبنة</p>}
                          {item.name === 'حلبسة (حمص الشام)' && <p className="text-gray-500 text-xs mt-1">مشروب الشتاء الراعي الرسمي للدفا</p>}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 bg-black p-2 rounded-xl border border-white/10">
                        <button onClick={() => handleUpdateQty(item.name, -1)} className="text-[#FAB520] p-1.5 active:scale-125 transition-transform"><Minus className="w-4 h-4" /></button>
                        <span className="text-xl font-bold w-6 text-center text-white">{qty}</span>
                        <button onClick={() => handleUpdateQty(item.name, 1)} className="text-[#FAB520] p-1.5 active:scale-125 transition-transform"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>

                    {qty > 0 && showBread && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                        <button onClick={() => handleOptionChoice(item.name, 'baladi')} className={`py-2.5 rounded-xl font-bold text-sm transition-all ${choice === 'baladi' ? 'bg-[#FAB520] text-black shadow-lg scale-[1.02]' : 'bg-white/5 text-gray-500'}`}>عيش بلدي</button>
                        <button onClick={() => handleOptionChoice(item.name, 'western')} className={`py-2.5 rounded-xl font-bold text-sm transition-all ${choice === 'western' ? 'bg-[#FAB520] text-black shadow-lg scale-[1.02]' : 'bg-white/5 text-gray-500'}`}>عيش فينو فرنسي</button>
                      </motion.div>
                    )}

                    {qty > 0 && showDrinkOption && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                        <button onClick={() => handleOptionChoice(item.name, 'normal')} className={`py-2.5 rounded-xl font-bold text-sm transition-all ${choice === 'normal' ? 'bg-[#FAB520] text-black shadow-lg scale-[1.02]' : 'bg-white/5 text-gray-500'}`}>عادي</button>
                        <button onClick={() => handleOptionChoice(item.name, 'spicy')} className={`py-2.5 rounded-xl font-bold text-sm transition-all ${choice === 'spicy' ? 'bg-[#FAB520] text-black shadow-lg scale-[1.02]' : 'bg-white/5 text-gray-500'}`}>حار 🔥</button>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Magic Sauce Counter */}
            {type === 'sandwiches' && (
              <motion.div 
                className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between mt-4 ${persistentState.sauceQuantity > 0 ? 'bg-[#FAB520] border-black text-black' : 'bg-white/5 border-dashed border-[#FAB520]/20'}`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className={`w-4 h-4 ${persistentState.sauceQuantity > 0 ? 'text-black' : 'text-[#FAB520]'}`} />
                  <div>
                    <h4 className="font-bold text-base">صوص أعجوبة السحري ✨</h4>
                    <p className="text-[10px] opacity-60">خلطة يا عم السرية (+10 ج.م)</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-black p-2 rounded-xl border border-white/10">
                  <button onClick={() => handleSauceUpdate(-1)} className="text-[#FAB520] p-1.5 active:scale-125 transition-transform"><Minus className="w-4 h-4" /></button>
                  <span className={`text-xl font-bold w-6 text-center ${persistentState.sauceQuantity > 0 ? 'text-[#FAB520]' : 'text-white'}`}>{persistentState.sauceQuantity || 0}</span>
                  <button onClick={() => handleSauceUpdate(1)} className="text-[#FAB520] p-1.5 active:scale-125 transition-transform"><Plus className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 md:p-8 bg-black/95 backdrop-blur-md border-t border-white/5 shrink-0 pb-10 shadow-[0_-15px_40px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-1">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-gray-500 font-bold text-sm">إجمالي القسم:</span>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-[#FAB520] tracking-tight">{globalTotal} ج.م</span>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                    <Truck className="w-2 h-2" />
                    <span>يضاف {deliveryFee} ج.م مصاريف توصيل عند الطلب</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                  <button onClick={onClose} className="flex-1 md:px-8 py-3.5 bg-white/5 border border-white/10 rounded-xl font-bold text-base hover:bg-white/10 transition-colors">تكملة الطلب</button>
                  <button 
                    onClick={() => onFinalSubmit({})} 
                    className="flex-1 md:px-8 py-3.5 bg-[#FAB520] text-black rounded-xl font-bold text-xl font-['Lalezar'] shadow-[0_15px_30px_rgba(250,181,32,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    تثبيت الأكلة
                  </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SpecialModal;
