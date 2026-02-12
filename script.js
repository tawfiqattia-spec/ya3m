
// Data Constants
const SANDWICH_ITEMS = [
  { 
    name: 'برجر يا عم', 
    price: 65, 
    image: 'https://ya3m.com/pic/burg.png' 
  },
  { 
    name: 'صينية سمين مشكل بلدي لفرد واحد', 
    price: 95, 
    image: 'https://ya3m.com/pic/simin.png' 
  },
  { 
    name: 'كبدة إسكندراني', 
    price: 35, 
    image: 'https://ya3m.com/pic/ya3m-kebda.png' 
  },
  { 
    name: 'سجق', 
    price: 35, 
    image: 'https://ya3m.com/pic/sogok.png' 
  },
  { 
    name: 'حواوشي يا عم', 
    price: 45, 
    image: 'https://ya3m.com/pic/hawwshy.png' 
  },
  { 
    name: 'صينية شهية لفرد واحد', 
    price: 95, 
    image: 'https://ya3m.com/pic/shahia.png' 
  },
  { 
    name: 'طبق مكرونة نجريسكو لفرد واحد', 
    price: 75, 
    image: 'https://ya3m.com/pic/neg.png' 
  },
  { 
    name: 'طبق فراخ استربس كريسبي', 
    price: 140, 
    image: 'https://ya3m.com/pic/kres.png' 
  },
  { 
    name: 'مكرونة بالبشاميل لفرد واحد', 
    price: 75, 
    image: 'https://ya3m.com/pic/baashamil.png' 
  },
  { 
    name: 'كرات بطاطس بالجبنة لفرد واحد', 
    price: 35, 
    image: 'https://ya3m.com/pic/botito.png' 
  },
  { 
    name: 'أرز بلبن يا عم', 
    price: 30, 
    image: 'https://ya3m.com/pic/roz.png' 
  },
];

// App State
let cart = {}; 
let sauceQuantity = 0;
const DELIVERY_FEE = 20;
const SAUCE_PRICE = 10;

// Initialize Lucide Icons
function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Function to scroll to the ordering section
window.scrollToMenu = function() {
  const section = document.getElementById('ordering-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

// Preloader Logic
function startPreloader() {
  const loaderBar = document.getElementById('loader-bar');
  const preloader = document.getElementById('preloader');
  const preloaderText = document.getElementById('preloader-text');
  const mainContent = document.getElementById('main-content');
  let progress = 0;

  // Initially hide the text
  if (preloaderText) preloaderText.style.display = 'none';

  const interval = setInterval(() => {
    progress += Math.random() * 15;
    
    // Show text near the end
    if (progress > 80 && preloaderText && preloaderText.style.display === 'none') {
        preloaderText.style.display = 'block';
    }

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('opacity-0');
        setTimeout(() => {
          preloader.style.display = 'none';
          mainContent.classList.remove('opacity-0');
          mainContent.classList.add('opacity-100');
        }, 500);
      }, 600);
    }
    loaderBar.style.width = `${progress}%`;
  }, 100);
}

// Render Sandwiches directly on home page
function renderSandwiches() {
  const container = document.getElementById('sandwich-list');
  if(!container) return;
  
  container.innerHTML = SANDWICH_ITEMS.map(item => {
    const qty = cart[item.name]?.quantity || 0;
    const bread = cart[item.name]?.bread || 'baladi';
    const variant = cart[item.name]?.variant || 'plain';
    
    // Items that don't need bread choice
    const noOptionsItems = [
        'برجر يا عم',
        'حواوشي يا عم', 
        'طبق فراخ استربس كريسبي', 
        'صينية شهية لفرد واحد', 
        'صينية سمين مشكل بلدي لفرد واحد',
        'مكرونة بالبشاميل لفرد واحد', 
        'طبق مكرونة نجريسكو لفرد واحد',
        'كرات بطاطس بالجبنة لفرد واحد',
        'أرز بلبن يا عم'
    ];
    
    const showBread = !noOptionsItems.includes(item.name);
    const isRicePudding = item.name === 'أرز بلبن يا عم';
    const displayPrice = isRicePudding && variant === 'nuts' ? 40 : item.price;

    return `
      <div class="p-4 md:p-5 rounded-[2.5rem] border-2 transition-all duration-500 ${qty > 0 ? 'bg-white/5 border-[#FAB520] shadow-2xl scale-[1.01]' : 'bg-white/5 border-transparent'} hover:translate-y-[-4px]">
        <div class="flex flex-col sm:flex-row items-center gap-5">
          <!-- Product Image -->
          <div class="w-full sm:w-32 h-32 shrink-0 rounded-[2rem] overflow-hidden border-2 border-white/5 shadow-lg group">
             <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
          </div>

          <!-- Product Details -->
          <div class="flex-1 text-center sm:text-right">
            <h3 class="text-xl md:text-2xl font-['Lalezar'] mb-1">${item.name}</h3>
            <p class="text-[#FAB520] font-bold text-lg">${displayPrice} ج.م</p>
            ${item.name === 'صينية سمين مشكل بلدي لفرد واحد' ? '<p class="text-gray-400 text-xs mt-1">فشة وطحال وحلويات.. السمين الأصلي!</p>' : ''}
            ${isRicePudding ? '<p class="text-gray-400 text-xs mt-1">رز بلبن كريمي وطعم خيالي</p>' : ''}
            ${item.name === 'طبق فراخ استربس كريسبي' ? '<p class="text-gray-400 text-xs mt-1">أصابع دجاج مقرمشة مع البهارات</p>' : ''}
            ${item.name === 'صينية شهية لفرد واحد' ? '<p class="text-gray-400 text-xs mt-1">كبدة وسجق وكفتة والطلب الأكثر شعبية ✨</p>' : ''}
            ${item.name === 'طبق مكرونة نجريسكو لفرد واحد' ? '<p class="text-gray-400 text-xs mt-1">مكرونة إيطالية بلمسة مصرية</p>' : ''}
          </div>
          
          <!-- Controls -->
          <div class="flex items-center gap-4 bg-black p-2 rounded-2xl border border-white/10">
            <button onclick="updateQty('${item.name}', -1, ${item.price})" class="text-[#FAB520] p-1.5 active:scale-125 transition-transform"><i data-lucide="minus" class="w-5 h-5"></i></button>
            <span class="text-xl font-bold w-8 text-center text-white" id="qty-${item.name}">${qty}</span>
            <button onclick="updateQty('${item.name}', 1, ${item.price})" class="text-[#FAB520] p-1.5 active:scale-125 transition-transform"><i data-lucide="plus" class="w-5 h-5"></i></button>
          </div>
        </div>

        ${showBread ? `
          <div class="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3 transition-all duration-500 ${qty > 0 ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 pointer-events-none overflow-hidden'}" id="bread-${item.name}">
            <button onclick="setBread('${item.name}', 'baladi')" class="py-2.5 rounded-xl font-bold text-sm transition-all ${bread === 'baladi' ? 'bg-[#FAB520] text-black shadow-lg scale-[1.02]' : 'bg-white/5 text-gray-500 hover:bg-white/10'}" data-bread="baladi">عيش بلدي</button>
            <button onclick="setBread('${item.name}', 'western')" class="py-2.5 rounded-xl font-bold text-sm transition-all ${bread === 'western' ? 'bg-[#FAB520] text-black shadow-lg scale-[1.02]' : 'bg-white/5 text-gray-500 hover:bg-white/10'}" data-bread="western">عيش فينو فرنسي</button>
          </div>
        ` : ''}

        ${isRicePudding ? `
          <div class="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3 transition-all duration-500 ${qty > 0 ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 pointer-events-none overflow-hidden'}" id="variant-${item.name}">
            <button onclick="setVariant('${item.name}', 'plain')" class="py-2.5 rounded-xl font-bold text-sm transition-all ${variant === 'plain' ? 'bg-[#FAB520] text-black shadow-lg scale-[1.02]' : 'bg-white/5 text-gray-500 hover:bg-white/10'}">سادة (30 ج)</button>
            <button onclick="setVariant('${item.name}', 'nuts')" class="py-2.5 rounded-xl font-bold text-sm transition-all ${variant === 'nuts' ? 'bg-[#FAB520] text-black shadow-lg scale-[1.02]' : 'bg-white/5 text-gray-500 hover:bg-white/10'}">بالمكسرات (40 ج)</button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
  initIcons();
}

function updateQty(name, delta, price) {
  if (!cart[name]) {
    cart[name] = { quantity: 0, price: price, category: 'sandwiches', bread: 'baladi', variant: 'plain' };
  }
  cart[name].quantity = Math.max(0, cart[name].quantity + delta);
  if (cart[name].quantity === 0) {
    delete cart[name];
  }
  
  const qtyEl = document.getElementById(`qty-${name}`);
  if (qtyEl) qtyEl.innerText = cart[name]?.quantity || 0;
  
  renderSandwiches(); 
  updateCartBadge();
  updateMainSummary();
}

function setBread(name, type) {
  if (cart[name]) {
    cart[name].bread = type;
    renderSandwiches();
  }
}

function setVariant(name, v) {
  if (cart[name]) {
    cart[name].variant = v;
    cart[name].price = v === 'nuts' ? 40 : 30;
    renderSandwiches();
    updateMainSummary();
  }
}

function updateSauceQty(delta) {
  sauceQuantity = Math.max(0, sauceQuantity + delta);
  const sauceQtyEl = document.getElementById('sauce-qty');
  const sauceBtn = document.getElementById('sauce-btn');
  
  if (sauceQtyEl) {
    sauceQtyEl.innerText = sauceQuantity;
    sauceQtyEl.style.color = sauceQuantity > 0 ? '#FAB520' : 'white';
  }
  
  if (sauceQuantity > 0) {
    sauceBtn.classList.add('bg-[#FAB520]', 'border-black', 'text-black');
    sauceBtn.classList.remove('bg-white/5', 'border-dashed', 'border-[#FAB520]/20');
  } else {
    sauceBtn.classList.remove('bg-[#FAB520]', 'border-black', 'text-black');
    sauceBtn.classList.add('bg-white/5', 'border-dashed', 'border-[#FAB520]/20');
  }
  
  updateMainSummary();
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0) + sauceQuantity;
  if(badge) {
    badge.innerText = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
    badge.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.3)' },
        { transform: 'scale(1)' }
    ], { duration: 300 });
  }
}

function updateMainSummary() {
  const summaryBox = document.getElementById('main-order-summary');
  const totalEl = document.getElementById('main-total-price');
  
  let subtotal = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  subtotal += (sauceQuantity * SAUCE_PRICE);
  
  if (subtotal > 0) {
    summaryBox.classList.remove('hidden');
    totalEl.innerText = `${subtotal + DELIVERY_FEE} ج.م`;
  } else {
    summaryBox.classList.add('hidden');
  }
}

function toggleCart() {
  const overlay = document.getElementById('cart-drawer-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (overlay.style.display === 'block') {
    drawer.classList.remove('open');
    setTimeout(() => overlay.style.display = 'none', 500);
  } else {
    overlay.style.display = 'block';
    renderCartSummary();
    setTimeout(() => drawer.classList.add('open'), 10);
  }
}

function renderCartSummary() {
  const container = document.getElementById('cart-items-container');
  if(!container) return;
  
  const cartArray = Object.entries(cart);
  
  if (cartArray.length === 0 && sauceQuantity === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full opacity-20 space-y-4">
        <i data-lucide="shopping-basket" class="w-16 h-16"></i>
        <p class="text-base font-bold text-center">لسه مفيش أكل!</p>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="space-y-4">
        ${cartArray.map(([name, item]) => `
          <div class="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center transition-all hover:bg-white/10">
            <div>
              <h4 class="font-bold text-base leading-tight">${name} (عدد ${item.quantity})</h4>
              <div class="flex gap-2 mt-1">
                ${name === 'أرز بلبن يا عم' ? `<span class="text-[9px] font-bold text-[#FAB520] bg-[#FAB520]/10 px-2 py-0.5 rounded-full inline-block">${item.variant === 'nuts' ? 'بالمكسرات' : 'سادة'}</span>` : ''}
                ${!['برجر يا عم', 'حواوشي يا عم', 'طبق فراخ استربس كريسبي', 'صينية شهية لفرد واحد', 'صينية سمين مشكل بلدي لفرد واحد', 'مكرونة بالبشاميل لفرد واحد', 'طبق مكرونة نجريسكو لفرد واحد', 'كرات بطاطس بالجبنة لفرد واحد', 'أرز بلبن يا عم'].includes(name) ? `<span class="text-[9px] font-bold text-[#FAB520] bg-[#FAB520]/10 px-2 py-0.5 rounded-full inline-block">خبز ${item.bread === 'baladi' ? 'بلدي' : 'فينو فرنسي'}</span>` : ''}
              </div>
            </div>
            <span class="font-bold text-[#FAB520] text-sm">${item.quantity * item.price} ج.م</span>
          </div>
        `).join('')}
        ${sauceQuantity > 0 ? `
          <div class="p-3.5 bg-[#FAB520]/10 rounded-xl border border-[#FAB520]/20 flex justify-between items-center text-[#FAB520] text-sm">
            <span class="font-bold">صوص أعجوبة السحري (عدد ${sauceQuantity})</span>
            <span class="font-bold">${sauceQuantity * SAUCE_PRICE} ج.م</span>
          </div>
        ` : ''}
        <div class="p-3.5 bg-white/5 rounded-xl flex justify-between items-center text-gray-400 text-xs">
            <span>مصاريف التوصيل</span>
            <span>${DELIVERY_FEE} ج.م</span>
        </div>
      </div>
    `;
  }
  initIcons();
}

const orderForm = document.getElementById('order-form');
if(orderForm) {
  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="w-6 h-6 loading-spin"></i><span>جاري الطيران...</span>`;
    initIcons();
  
    setTimeout(() => {
        document.getElementById('success-screen').style.display = 'flex';
        initIcons();
    }, 1500);
  });
}

window.onload = () => {
  startPreloader();
  renderSandwiches();
};
