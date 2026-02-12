
// Data Constants
const SANDWICH_ITEMS = [
  { 
    name: 'برجر يا عم', 
    price: 65, 
    image: 'https://ya3m.com/pic/burg.png' 
    // No description as requested
  },
  { 
    name: 'صينية سمين مشكل بلدي لفرد واحد', 
    price: 95, 
    image: 'https://ya3m.com/pic/simin.png',
    desc: 'فشة وطحال وحلويات.. السمين الأصلي!'
  },
  { 
    name: 'كبدة إسكندراني', 
    price: 35, 
    image: 'https://ya3m.com/pic/ya3m-kebda.png',
    desc: 'كبدة بلدي بالخلطة الإسكندراني الرهيبة'
  },
  { 
    name: 'سجق', 
    price: 35, 
    image: 'https://ya3m.com/pic/sogok.png',
    desc: 'سجق شرقي ببهارات ياعم الخاصة'
  },
  { 
    name: 'حواوشي يا عم', 
    price: 45, 
    image: 'https://ya3m.com/pic/hawwshy.png',
    desc: 'لحمة بلدي في عيش مقرمش ملهلب'
  },
  { 
    name: 'صينية شهية لفرد واحد', 
    price: 95, 
    image: 'https://ya3m.com/pic/shahia.png',
    desc: 'كبدة وسجق وكفتة.. الطلب الأكثر شعبية ✨'
  },
  { 
    name: 'طبق مكرونة نجريسكو لفرد واحد', 
    price: 75, 
    image: 'https://ya3m.com/pic/neg.png',
    desc: 'مكرونة بالوايت صوص وقطع الدجاج'
  },
  { 
    name: 'طبق محشي لفرد واحد', 
    price: 75, 
    image: 'https://ya3m.com/pic/mahs.png',
    desc: 'بذنجان وفلفل وكوسة.. خلطة بيتي تجنن!'
  },
  { 
    name: 'طبق فراخ استربس كريسبي', 
    price: 140, 
    image: 'https://ya3m.com/pic/kres.png',
    desc: 'أصابع دجاج مقرمشة مع البطاطس'
  },
  { 
    name: 'مكرونة بالبشاميل لفرد واحد', 
    price: 75, 
    image: 'https://ya3m.com/pic/baashamil.png',
    desc: 'مكرونة غرقانة في البشاميل واللحمة'
  },
  { 
    name: 'كرات بطاطس بالجبنة لفرد واحد', 
    price: 35, 
    image: 'https://ya3m.com/pic/botito.png',
    desc: 'بطاطس مهروسة محشية جبنة بتمط'
  },
  { 
    name: 'أرز بلبن يا عم', 
    price: 30, 
    image: 'https://ya3m.com/pic/roz.png',
    desc: 'حلّي بقك بأحلى رز بلبن كريمي'
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

  const interval = setInterval(() => {
    progress += Math.random() * 15;
    
    // Typing Animation: Show text near the end (85%)
    if (progress > 85 && preloaderText && preloaderText.classList.contains('hidden')) {
        preloaderText.classList.remove('hidden');
        preloaderText.classList.add('animate-dastoor');
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
      }, 800);
    }
    loaderBar.style.width = `${progress}%`;
  }, 120);
}

// Render Sandwiches directly on home page
function renderSandwiches() {
  const container = document.getElementById('sandwich-list');
  if(!container) return;
  
  container.innerHTML = SANDWICH_ITEMS.map(item => {
    const qty = cart[item.name]?.quantity || 0;
    const bread = cart[item.name]?.bread || 'baladi';
    
    // Items that don't need bread choice
    const noOptionsItems = [
        'برجر يا عم',
        'حواوشي يا عم', 
        'طبق فراخ استربس كريسبي', 
        'صينية شهية لفرد واحد', 
        'صينية سمين مشكل بلدي لفرد واحد',
        'مكرونة بالبشاميل لفرد واحد', 
        'طبق مكرونة نجريسكو لفرد واحد',
        'طبق محشي لفرد واحد',
        'كرات بطاطس بالجبنة لفرد واحد',
        'أرز بلبن يا عم'
    ];
    
    const showBread = !noOptionsItems.includes(item.name);

    return `
      <div class="p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border-2 transition-all duration-500 ${qty > 0 ? 'bg-white/5 border-[#FAB520] shadow-2xl scale-[1.01]' : 'bg-white/5 border-transparent'} hover:translate-y-[-5px]">
        <div class="flex flex-row items-center gap-4 md:gap-6">
          <!-- Product Image -->
          <div class="w-24 h-24 md:w-36 md:h-36 shrink-0 rounded-2xl md:rounded-[2rem] overflow-hidden border-2 border-white/5 shadow-lg group">
             <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
          </div>

          <!-- Product Details -->
          <div class="flex-1 text-right">
            <h3 class="text-lg md:text-3xl font-['Lalezar'] mb-0.5 leading-tight">${item.name}</h3>
            <p class="text-[#FAB520] font-black text-base md:text-xl mb-1">${item.price} ج.م</p>
            ${item.desc ? `<p class="text-gray-400 text-[10px] md:text-sm font-bold leading-tight line-clamp-2">${item.desc}</p>` : ''}
          </div>
          
          <!-- Controls -->
          <div class="flex flex-col md:flex-row items-center gap-2 md:gap-5 bg-black p-2 md:p-3 rounded-xl md:rounded-2xl border border-white/10 shadow-inner shrink-0">
            <button onclick="updateQty('${item.name}', 1, ${item.price})" class="text-[#FAB520] p-1 active:scale-125 transition-transform order-1 md:order-3"><i data-lucide="plus" class="w-5 h-5 md:w-6 md:h-6"></i></button>
            <span class="text-lg md:text-2xl font-black w-6 md:w-8 text-center text-white order-2" id="qty-${item.name}">${qty}</span>
            <button onclick="updateQty('${item.name}', -1, ${item.price})" class="text-[#FAB520] p-1 active:scale-125 transition-transform order-3 md:order-1"><i data-lucide="minus" class="w-5 h-5 md:w-6 md:h-6"></i></button>
          </div>
        </div>

        ${showBread && qty > 0 ? `
          <div class="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 animate-fade-in">
            <button onclick="setBread('${item.name}', 'baladi')" class="py-2.5 rounded-lg md:rounded-xl font-black text-[10px] md:text-sm transition-all ${bread === 'baladi' ? 'bg-[#FAB520] text-black shadow-lg scale-[1.02]' : 'bg-white/5 text-gray-500 hover:bg-white/10'}">عيش بلدي</button>
            <button onclick="setBread('${item.name}', 'western')" class="py-2.5 rounded-lg md:rounded-xl font-black text-[10px] md:text-sm transition-all ${bread === 'western' ? 'bg-[#FAB520] text-black shadow-lg scale-[1.02]' : 'bg-white/5 text-gray-500 hover:bg-white/10'}">فينو فرنسي</button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
  initIcons();
}

function updateQty(name, delta, price) {
  if (!cart[name]) {
    cart[name] = { quantity: 0, price: price, bread: 'baladi' };
  }
  cart[name].quantity = Math.max(0, cart[name].quantity + delta);
  if (cart[name].quantity === 0) {
    delete cart[name];
  }
  
  const qtyEl = document.getElementById(`qty-${name}`);
  if (qtyEl) qtyEl.innerText = cart[name]?.quantity || 0;
  
  renderSandwiches(); 
  updateMainSummary();
}

function updateSauceQty(delta) {
    sauceQuantity = Math.max(0, sauceQuantity + delta);
    document.getElementById('sauce-qty').innerText = sauceQuantity;
    updateMainSummary();
}

function setBread(name, type) {
  if (cart[name]) {
    cart[name].bread = type;
    renderSandwiches();
  }
}

function updateMainSummary() {
  const summaryBox = document.getElementById('main-order-summary');
  const totalEl = document.getElementById('main-total-price');
  const badgeEl = document.getElementById('cart-badge-summary');
  
  let subtotal = Object.values(cart).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  subtotal += (sauceQuantity * SAUCE_PRICE);
  
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0) + sauceQuantity;
  
  if (subtotal > 0) {
    summaryBox.classList.remove('hidden');
    setTimeout(() => summaryBox.classList.remove('translate-y-full'), 10);
    totalEl.innerText = `${subtotal + DELIVERY_FEE} ج.م`;
    badgeEl.innerText = totalItems;
  } else {
    summaryBox.classList.add('translate-y-full');
    setTimeout(() => summaryBox.classList.add('hidden'), 500);
  }
}

function toggleCart() {
  const overlay = document.getElementById('cart-drawer-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (overlay.classList.contains('hidden')) {
    overlay.classList.remove('hidden');
    renderCartSummary();
    setTimeout(() => drawer.classList.remove('translate-x-full'), 10);
  } else {
    drawer.classList.add('translate-x-full');
    setTimeout(() => overlay.classList.add('hidden'), 500);
  }
}

function renderCartSummary() {
  const container = document.getElementById('cart-items-container');
  const formContainer = document.getElementById('cart-form-container');
  const drawerTotal = document.getElementById('drawer-total');
  
  const cartArray = Object.entries(cart);
  let subtotal = 0;

  if (cartArray.length === 0 && sauceQuantity === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full opacity-20 space-y-4">
        <i data-lucide="shopping-basket" class="w-16 h-16 md:w-20 md:h-20"></i>
        <p class="text-xl md:text-2xl font-black text-center">لسه مفيش أكل!</p>
      </div>
    `;
    formContainer.classList.add('hidden');
  } else {
    formContainer.classList.remove('hidden');
    container.innerHTML = cartArray.map(([name, item]) => {
      subtotal += (item.price * item.quantity);
      return `
        <div class="p-4 md:p-6 bg-white/5 rounded-2xl md:rounded-[2rem] border border-white/10 flex justify-between items-center">
          <div>
            <h4 class="font-black text-lg md:text-xl leading-tight">${name} (x${item.quantity})</h4>
            <div class="flex gap-2 mt-1 md:mt-2">
               ${!['برجر يا عم', 'حواوشي يا عم', 'طبق فراخ استربس كريسبي', 'طبق محشي لفرد واحد'].includes(name) ? `<span class="text-[9px] md:text-[10px] font-black text-[#FAB520] bg-[#FAB520]/10 px-2 py-0.5 md:px-3 md:py-1 rounded-full">خبز ${item.bread === 'baladi' ? 'بلدي' : 'فرنسي'}</span>` : ''}
            </div>
          </div>
          <span class="font-black text-[#FAB520] text-lg md:text-xl">${item.quantity * item.price} ج.م</span>
        </div>
      `;
    }).join('');

    if (sauceQuantity > 0) {
        subtotal += (sauceQuantity * SAUCE_PRICE);
        container.innerHTML += `
            <div class="p-4 md:p-6 bg-[#FAB520]/10 rounded-2xl md:rounded-[2rem] border border-[#FAB520]/30 flex justify-between items-center text-[#FAB520]">
                <h4 class="font-black text-lg md:text-xl">صوص أعجوبة السحري (x${sauceQuantity})</h4>
                <span class="font-black text-lg md:text-xl">${sauceQuantity * SAUCE_PRICE} ج.م</span>
            </div>
        `;
    }

    drawerTotal.innerText = `${subtotal + DELIVERY_FEE} ج.م`;
  }
  initIcons();
}

// Order Form Submission
const orderForm = document.getElementById('order-form');
if(orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader" class="w-6 h-6 md:w-8 md:h-8 animate-spin"></i><span>جاري الإرسال...</span>`;
    initIcons();
  
    setTimeout(() => {
        document.getElementById('success-screen').classList.remove('hidden');
        document.getElementById('success-screen').classList.add('flex');
        initIcons();
    }, 1500);
  });
}

// Global initialization
window.onload = () => {
  startPreloader();
  renderSandwiches();
  initIcons();
};
