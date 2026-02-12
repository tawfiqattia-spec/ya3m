
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Sparkles, Star } from 'lucide-react';

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
    ricePuddingVariants?: Record<string, 'plain' | 'nuts'>;
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

  const handleVariantChoice = (name: string, v: 'plain' | 'nuts') => {
    onUpdateState({
      ...persistentState,
      ricePuddingVariants: {
        ...(persistentState.ricePuddingVariants || {}),
        [name]: v
      }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-end md:items-center justify-center overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
        
        <motion.div 
          initial={{ y: '100%', scale: 0.95 }} 
          animate={{ y: 0, scale: 1 }} 
          exit={{ y: '100%', scale: 0.95 }} 
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full md:max-w-5xl h-[95dvh] md:h-auto md:max-h-[90vh] bg-[#0c0c0c] md:rounded-[4rem] border-t-8 md:border-4 border-[#FAB520] flex flex-col overflow-hidden shadow-[0_0_120px_rgba(250,181,32,0.4)] font-['Changa']"
        >
          {/* Header Area */}
          <div className="relative h-48 md:h-72 shrink-0">
            <motion.img 
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              src={image} 
              className="w-full h-full object-cover" 
              alt={title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-black/20 to-transparent" />
            <motion.button 
              whileHover={{ rotate: 90 }}
              onClick={onClose} 
              className="absolute top-8 left-8 p-4 bg-black/50 rounded-full text-white backdrop-blur-xl z-20 border border-white/10"
            ><X className="w-6 h-6" /></motion.button>
            <div className="absolute bottom-8 right-10 z-10">
              <h2 className="text-4xl md:text-7xl font-normal text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)] font-['Lalezar']">{title}</h2>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 space-y-6 scrollbar-hide">
            <div className="space-y-6 pb-20">
              {initialItems.map((item, i) => {
                const qty = persistentState.quantities[item.name] || 0;
                const choice = persistentState.breadChoices?.[item.name] || 'baladi';
                const variant = persistentState.ricePuddingVariants?.[item.name] || 'plain';
                
                const showBread = type === 'sandwiches' && !['برجر يا عم', 'حواوشي يا عم', 'طبق فراخ استربس كريسبي', 'صينية سمين مشكل بلدي لفرد واحد', 'صينية شهية لفرد واحد', 'مكرونة بالبشامل لفرد واحد', 'طبق مكرونة نجريسكو لفرد واحد', 'كرات بطاطس بالجبنة لفرد واحد', 'أرز بلبن يا عم'].includes(item.name);
                const isRicePudding = item.name === 'أرز بلبن يا عم';

                return (
                  <motion.div 
                    initial={{ opacity: 0.5, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1.08 }}
                    viewport={{ amount: 0.7, margin: "-20% 0px -20% 0px" }}
                    transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                    key={item.name} 
                    className={`p-6 md:p-8 rounded-[2.5rem] border-2 transition-all accessibility-focus ${qty > 0 ? 'bg-white/5 border-[#FAB520] shadow-2xl active-focus' : 'bg-white/5 border-transparent'}`}
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-6 w-full sm:w-auto">
                        {item.image && (
                           <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-xl">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                           </motion.div>
                        )}
                        <div className="flex-1 text-right">
                          <h3 className="text-2xl md:text-3xl font-black mb-1 leading-tight">{item.name}</h3>
                          <p className="text-[#FAB520] font-black text-xl">{isRicePudding && variant === 'nuts' ? 40 : item.price} ج.م</p>
                          {item.name !== 'برجر يا عم' && (
                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                               <Star className="w-3 h-3 fill-current" />
                               <span>طعم خيالي يا عم</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 bg-black p-3 rounded-2xl border-2 border-white/10 shadow-inner">
                        <motion.button whileTap={{ scale: 1.5 }} onClick={() => handleUpdateQty(item.name, -1)} className="text-[#FAB520] p-2 bg-white/5 rounded-xl"><Minus className="w-6 h-6" /></motion.button>
                        <span className="text-3xl font-black w-10 text-center text-white">{qty}</span>
                        <motion.button whileTap={{ scale: 1.5 }} onClick={() => handleUpdateQty(item.name, 1)} className="text-[#FAB520] p-2 bg-white/5 rounded-xl"><Plus className="w-6 h-6" /></motion.button>
                      </div>
                    </div>

                    <AnimatePresence>
                    {qty > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        {showBread && (
                          <div className="mt-6 pt-6 border-t-2 border-white/5 grid grid-cols-2 gap-4">
                            <button onClick={() => handleOptionChoice(item.name, 'baladi')} className={`py-4 rounded-2xl font-black text-lg transition-all ${choice === 'baladi' ? 'bg-[#FAB520] text-black shadow-lg scale-105 border-4 border-black' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>عيش بلدي</button>
                            <button onClick={() => handleOptionChoice(item.name, 'western')} className={`py-4 rounded-2xl font-black text-lg transition-all ${choice === 'western' ? 'bg-[#FAB520] text-black shadow-lg scale-105 border-4 border-black' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>عيش فينو فرنسي</button>
                          </div>
                        )}

                        {isRicePudding && (
                          <div className="mt-6 pt-6 border-t-2 border-white/5 grid grid-cols-2 gap-4">
                            <button onClick={() => handleVariantChoice(item.name, 'plain')} className={`py-4 rounded-2xl font-black text-lg transition-all ${variant === 'plain' ? 'bg-[#FAB520] text-black shadow-lg scale-105 border-4 border-black' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>سادة (30 ج)</button>
                            <button onClick={() => handleVariantChoice(item.name, 'nuts')} className={`py-4 rounded-2xl font-black text-lg transition-all ${variant === 'nuts' ? 'bg-[#FAB520] text-black shadow-lg scale-105 border-4 border-black' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>بالمكسرات (40 ج)</button>
                          </div>
                        )}
                      </motion.div>
                    )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Modal Footer Area */}
            <div className="p-8 md:p-12 bg-black/95 backdrop-blur-xl border-t-2 border-[#FAB520]/20 shrink-0 pb-16 shadow-[0_-20px_60px_rgba(0,0,0,0.9)] mt-6 sticky bottom-0">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-gray-400 font-bold text-lg">إجمالي طلبك حتى الآن:</span>
                  <motion.span 
                    key={globalTotal}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-5xl font-black text-[#FAB520] tracking-tight drop-shadow-[0_0_15px_rgba(250,181,32,0.4)]"
                  >{globalTotal} ج.م</motion.span>
                </div>
                <div className="flex gap-6 w-full md:w-auto">
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose} 
                      className="flex-1 md:px-10 py-5 bg-white/5 border-2 border-white/10 rounded-[2rem] font-black text-xl hover:bg-white/10 transition-colors"
                    >تكملة التسوق</motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05, rotate: 2 }} 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onFinalSubmit({})} 
                      className="flex-1 md:px-12 py-5 bg-[#FAB520] text-black rounded-[2rem] font-black text-2xl font-['Lalezar'] shadow-[0_20px_40px_rgba(250,181,32,0.5)] border-4 border-black"
                    >تثبيت البيانات والطلب</motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SpecialModal;
