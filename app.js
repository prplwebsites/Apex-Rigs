// ==================== APEX RIGS - REFACTORED APP.JS ====================
// Improved security, performance, error handling, and code quality
// Version 2.0

// ==================== CONFIG & STATE ====================
const CONFIG = {
  STORAGE_PREFIX: 'apex-rigs',
  TOAST_DURATION: 2400,
  SEARCH_DEBOUNCE_MS: 300,
  ANIMATION_DURATION: 240
};

let cart = [];
let currentLanguage = 'en';
let searchTimeout;
let productsCache = [];
let activeCategory = '';

const LEGACY_DEFAULT_PRODUCTS = [
  {
    name: 'Apex RTX 4070 Super',
    category: 'Graphics Card'
  },
  {
    name: 'Apex 144Hz Studio',
    category: 'Monitor'
  },
  {
    name: 'Apex Ryzen 7 7800X3D',
    category: 'Processor'
  },
  {
    name: 'Apex DDR5 Performance',
    category: 'Memory'
  },
  {
    name: 'Apex Z790 Creator',
    category: 'Motherboard'
  },
  {
    name: 'Apex NVMe 2TB',
    category: 'Storage'
  }
];

const DEFAULT_PRODUCTS = [];

// ==================== TRANSLATIONS ====================
const TRANSLATIONS = {
  fr: {
    'Added to cart': 'ajouté au panier',
    'Order confirmed': 'Commande confirmée',
    'Error': 'Erreur',
    'Please fill all fields': 'Veuillez remplir tous les champs',
    'Invalid phone': 'Numéro de téléphone invalide',
    'Order saved': 'Commande enregistrée',
    'Quote sent': 'Demande de devis envoyée',
    'No products': 'Aucun produit trouvé',
    'Empty cart': 'Votre panier est vide',
    'Add product': 'Ajoutez un produit avant de commander',
    'Product not found': 'Produit non trouvé',
    'Cart updated': 'Panier mis à jour',
    'All Products': 'Tous les produits',
    'Gaming PC': 'PC Gaming',
    'Workstations': 'Stations de travail',
    'PC Builder': 'Constructeur PC',
    'Components': 'Composants',
    'Support': 'Support',
    'Free shipping': 'Livraison gratuite',
    'Shop Gaming PCs': 'Voir les PC gaming',
    'Build My PC': 'Construire mon PC',
    'Performance series 2026': 'Série performance 2026',
    'The gaming PC that fits you.': 'Le PC gaming qui vous convient.',
    'Ready-to-play configurations, assembled in Morocco and tested before shipping. Level up your setup today.': 'Configurations prêtes à jouer, assemblées au Maroc et testées avant expédition. Améliorez votre setup aujourd\u2019hui.',
    'Explore the store': 'Explorez la boutique',
    'Our Categories': 'Nos catégories',
    'PC components and builds': 'Composants et configurations PC',
    'Curated Builds': 'Configurations sélectionnées',
    'No products found': 'Aucun produit trouvé',
    'Try another search like "RTX", "AMD" or "gaming".': 'Essayez une autre recherche comme "RTX", "AMD" ou "gaming".',
    'Warranty & Support': 'Garantie et support',
    'Search catalog': 'Rechercher dans le catalogue',
    'Cart': 'Panier',
    'Checkout': 'Commander',
    'Your cart is empty': 'Votre panier est vide',
    'Add a configuration to get started.': 'Ajoutez une configuration pour commencer.',
    'Complete your order': 'Finaliser votre commande',
    'Your Details': 'Vos informations',
    'Full name *': 'Nom complet *',
    'Mobile *': 'Téléphone *',
    'Delivery address *': 'Adresse de livraison *',
    'Confirm Order': 'Confirmer la commande',
    'View details': 'Voir les détails',
    'Add to Cart': 'Ajouter au panier'
  },
  en: {
    'Added to cart': 'added to cart',
    'Order confirmed': 'Order confirmed',
    'Error': 'Error',
    'Please fill all fields': 'Please fill all required fields',
    'Invalid phone': 'Invalid phone number',
    'Order saved': 'Order saved successfully',
    'Quote sent': 'Quote request sent successfully',
    'No products': 'No products found',
    'Empty cart': 'Your cart is empty',
    'Add product': 'Add a product before checking out',
    'Product not found': 'Product not found',
    'Cart updated': 'Cart updated',
    'All Products': 'All Products',
    'Gaming PC': 'Gaming PC',
    'Workstations': 'Workstations',
    'PC Builder': 'PC Builder',
    'Components': 'Components',
    'Support': 'Support',
    'Free shipping': 'Free shipping',
    'Shop Gaming PCs': 'Shop Gaming PCs',
    'Build My PC': 'Build My PC',
    'Performance series 2026': 'Performance series 2026',
    'The gaming PC that fits you.': 'The gaming PC that fits you.',
    'Ready-to-play configurations, assembled in Morocco and tested before shipping. Level up your setup today.': 'Ready-to-play configurations, assembled in Morocco and tested before shipping. Level up your setup today.',
    'Explore the store': 'Explore the store',
    'Our Categories': 'Our Categories',
    'PC components and builds': 'PC components and builds',
    'Curated Builds': 'Curated Builds',
    'No products found': 'No products found',
    'Try another search like "RTX", "AMD" or "gaming".': 'Try another search like "RTX", "AMD" or "gaming".',
    'Warranty & Support': 'Warranty & Support',
    'Search catalog': 'Search catalog',
    'Cart': 'Cart',
    'Checkout': 'Checkout',
    'Your cart is empty': 'Your cart is empty',
    'Add a configuration to get started.': 'Add a configuration to get started.',
    'Complete your order': 'Complete your order',
    'Your Details': 'Your Details',
    'Full name *': 'Full name *',
    'Mobile *': 'Mobile *',
    'Delivery address *': 'Delivery address *',
    'Confirm Order': 'Confirm Order',
    'View details': 'View details',
    'Add to Cart': 'Add to Cart'
  }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
  try {
    stripLegacyStorefrontItems();
    ensureDefaultInventory();

    document.querySelectorAll('.page-section').forEach((section) => {
      const isActive = section.id === 'page-gaming';
      section.classList.toggle('active', isActive);
      section.hidden = !isActive;
    });

    document.querySelectorAll('.nav-btn').forEach((btn) => {
      const isActive = btn.id === 'nav-gaming';
      btn.classList.toggle('bg-red-600', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('hover:text-red-400', !isActive);
    });

    loadLanguagePreference();
    loadCart();
    initializeEventListeners();
    applyTranslations();
    renderMarketplaceProducts();
    loadSharedProducts();
    subscribeToRealtimeUpdates();
    setupCategoryMarquee();
    renderIcons();
  } catch (error) {
    console.error('Initialization error:', error);
    showToast('Failed to initialize app', 'error');
  }
}

function ensureDefaultInventory() {
  try {
    const key = `${CONFIG.STORAGE_PREFIX}-inventory`;
    const saved = JSON.parse(localStorage.getItem(key) || '[]');

    if (!Array.isArray(saved) || saved.length === 0) {
      localStorage.setItem(key, JSON.stringify([]));
      productsCache = [];
      return;
    }

    const legacyEntries = saved.filter(product =>
      LEGACY_DEFAULT_PRODUCTS.some(defaultProduct =>
        defaultProduct.name === product.name && defaultProduct.category === (product.category || 'Gaming PC')
      )
    );

    if (legacyEntries.length > 0) {
      const cleaned = saved.filter(product => !LEGACY_DEFAULT_PRODUCTS.some(defaultProduct =>
        defaultProduct.name === product.name && defaultProduct.category === (product.category || 'Gaming PC')
      ));
      localStorage.setItem(key, JSON.stringify(cleaned));
      productsCache = cleaned;
      return;
    }

    productsCache = saved;
  } catch (error) {
    console.warn('Inventory could not be restored:', error.message);
    productsCache = [];
    localStorage.setItem(`${CONFIG.STORAGE_PREFIX}-inventory`, JSON.stringify([]));
  }
}

function stripLegacyStorefrontItems() {
  document.querySelectorAll('button, a').forEach((element) => {
    const text = (element.textContent || '').trim().toLowerCase();
    if (text.includes('peripheral')) {
      element.remove();
    }
  });
}

// ==================== LANGUAGE & I18N ====================
function loadLanguagePreference() {
  currentLanguage = localStorage.getItem(`${CONFIG.STORAGE_PREFIX}-language`) || 'en';
  setLanguage(currentLanguage);
}

function setLanguage(language) {
  if (!TRANSLATIONS[language]) return;
  currentLanguage = language;
  localStorage.setItem(`${CONFIG.STORAGE_PREFIX}-language`, language);

  const enBtn = document.getElementById('lang-en');
  const frBtn = document.getElementById('lang-fr');

  if (enBtn) {
    enBtn.className = language === 'en'
      ? 'px-2 py-1 text-[10px] font-black bg-red-600 text-white rounded'
      : 'px-2 py-1 text-[10px] font-black text-gray-300 rounded';
  }

  if (frBtn) {
    frBtn.className = language === 'fr'
      ? 'px-2 py-1 text-[10px] font-black bg-red-600 text-white rounded'
      : 'px-2 py-1 text-[10px] font-black text-gray-300 rounded';
  }

  applyTranslations();
  renderMarketplaceProducts();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    const value = t(key);
    if (value) element.textContent = value;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const key = element.getAttribute('data-i18n-placeholder');
    const value = t(key);
    if (value) element.setAttribute('placeholder', value);
  });
}

function t(key) {
  return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS.en[key] || key;
}

// ==================== DOM UTILITIES ====================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

function getElementSafely(id) {
  const el = document.getElementById(id);
  if (!el) console.warn(`Element with ID "${id}" not found`);
  return el;
}

// ==================== ICONS & UI ====================
function renderIcons() {
  if (window.lucide?.createIcons) {
    lucide.createIcons();
  }
}

// ==================== CATEGORY CAROUSEL ====================
function setupCategoryMarquee() {
  try {
    const track = document.getElementById('category-track');
    if (!track) return;
    
    // Clear existing marquee if it exists
    const existingInner = track.querySelector('.category-track-inner');
    if (existingInner) existingInner.remove();
    
    const inner = document.createElement('div');
    inner.className = 'category-track-inner';
    
    // Move all tiles into inner
    const tiles = Array.from(track.children);
    tiles.forEach(tile => inner.appendChild(tile));
    
    // Clone all tiles for seamless loop
    tiles.forEach(tile => {
      const clone = tile.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      inner.appendChild(clone);
    });
    
    track.appendChild(inner);
  } catch (error) {
    console.error('Error setting up category marquee:', error);
  }
}

function scrollCategories(direction) {
  const track = document.getElementById('category-track');
  if (track) track.scrollBy({ left: direction * 300, behavior: 'smooth' });
}

// ==================== NAVIGATION ====================
function initializeEventListeners() {
  // Search with debounce
  const searchInput = document.getElementById('catalog-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(filterCatalog, CONFIG.SEARCH_DEBOUNCE_MS);
    });
  }

  // Page navigation buttons
  document.querySelectorAll('[data-page]').forEach((button) => {
    button.addEventListener('click', () => {
      const pageId = button.getAttribute('data-page');
      if (pageId) switchPage(pageId);
    });
  });

  // Quote form
  const quoteForm = document.getElementById('quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', handleQuoteSubmit);
  }

  // Checkout form
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeComponentMenu();
      closeProductModal();
      closeCart();
      closeCheckout();
    }
  });
}

function switchPage(pageId) {
  try {
    const safePageId = String(pageId || '').trim();
    if (!safePageId) return;

    const sections = document.querySelectorAll('.page-section');
    sections.forEach((section) => {
      const isActive = section.id === `page-${safePageId}`;
      section.classList.toggle('active', isActive);
      section.hidden = !isActive;
      section.setAttribute('aria-hidden', String(!isActive));
    });

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach((btn) => {
      const isActive = btn.id === `nav-${safePageId}`;
      btn.classList.toggle('bg-red-600', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('text-gray-200', !isActive);
      btn.classList.toggle('hover:text-red-400', !isActive);
      btn.classList.toggle('px-4', isActive);
      btn.classList.toggle('h-full', true);
      btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    const activeBtn = document.getElementById(`nav-${safePageId}`);
    if (activeBtn) {
      activeBtn.setAttribute('aria-current', 'page');
      activeBtn.classList.add('bg-red-600', 'text-white');
      activeBtn.classList.remove('hover:text-red-400');
    }

    const nonTargetButtons = document.querySelectorAll('.nav-btn');
    nonTargetButtons.forEach((btn) => {
      if (btn.id !== `nav-${safePageId}`) {
        btn.removeAttribute('aria-current');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Error switching page:', error);
    showToast(t('Error') + ': ' + error.message, 'error');
  }
}

// ==================== COMPONENT MENU ====================
function toggleComponentMenu() {
  const menu = document.getElementById('component-menu');
  const button = document.querySelector('[aria-controls="component-menu"]');

  if (!menu || !button) return;

  const willOpen = menu.classList.contains('hidden');
  menu.classList.toggle('hidden');
  button.setAttribute('aria-expanded', String(willOpen));
}

function closeComponentMenu(event) {
  const menu = document.getElementById('component-menu');
  const button = document.querySelector('[aria-controls="component-menu"]');

  if (!menu) return;

  if (!event || event.target === menu) {
    menu.classList.add('hidden');
    if (button) button.setAttribute('aria-expanded', 'false');
  }
}

// ==================== PRODUCTS & CATALOG ====================
async function getProducts() {
  if (typeof window !== 'undefined' && window.getProducts) {
    return window.getProducts();
  }
  const local = JSON.parse(localStorage.getItem(`${CONFIG.STORAGE_PREFIX}-inventory`) || '[]');
  return Array.isArray(local) ? local : [];
}

async function createOrder(order) {
  if (typeof window !== 'undefined' && window.createOrder) {
    return window.createOrder(order);
  }
  console.warn('Supabase order sync is unavailable; storing order locally only.');
  return { ok: true, data: order };
}

async function createQuote(quote) {
  if (typeof window !== 'undefined' && window.createQuote) {
    return window.createQuote(quote);
  }
  console.warn('Supabase quote sync is unavailable; storing quote locally only.');
  return { ok: true, data: quote };
}

async function loadSharedProducts() {
  try {
    const products = await getProducts();
    productsCache = products;
    localStorage.setItem(`${CONFIG.STORAGE_PREFIX}-inventory`, JSON.stringify(products));
    renderMarketplaceProducts();
  } catch (error) {
    console.warn('Could not load products from Supabase:', error.message);
    const cached = localStorage.getItem(`${CONFIG.STORAGE_PREFIX}-inventory`);
    if (cached) {
      try {
        productsCache = JSON.parse(cached);
      } catch {
        productsCache = DEFAULT_PRODUCTS;
      }
      renderMarketplaceProducts();
      return;
    }
    productsCache = [];
    localStorage.setItem(`${CONFIG.STORAGE_PREFIX}-inventory`, JSON.stringify([]));
    renderMarketplaceProducts();
  }
}

function renderMarketplaceProducts() {
  try {
    const stored = JSON.parse(localStorage.getItem(`${CONFIG.STORAGE_PREFIX}-inventory`) || '[]');
    productsCache = stored;
    
    const container = document.getElementById('dynamic-products');
    if (!container) return;
    
    // Filter out pre-built products
    const prebuiltNames = ['The Vector i5', 'The Apex 7800X3D', 'The Dominator 4090'];
    const dynamicProducts = stored.filter(p => 
      !p.disabled && 
      p.visible !== false && 
      p.name && 
      !prebuiltNames.includes(p.name)
    );
    
    container.innerHTML = dynamicProducts.map(p => renderProductCard(p, false)).join('');
    renderFeaturedProducts(stored);
    filterCatalog();
  } catch (error) {
    console.error('Error rendering products:', error);
    showToast(t('Error') + ' rendering products', 'error');
  }
}

function renderProductCard(product, isFeatured = false) {
  try {
    const image = product.image || 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=900&auto=format&fit=crop';
    const specs = Array.isArray(product.specs) 
      ? product.specs 
      : (product.specs || 'Specifications pending').split(' | ');
    
    const specsHtml = specs.map(spec => {
      const [label, value] = String(spec).split(':');
      return `<div class="flex justify-between gap-3">
        <span class="text-gray-500">${escapeHtml(label || spec)}</span>
        <span class="text-gray-200 text-right">${escapeHtml((value || '').trim() || label)}</span>
      </div>`;
    }).join('');

    const price = Number(String(product.price).replace(/[^0-9]/g, '')) || 0;
    const displayPrice = new Intl.NumberFormat('en-US').format(price) + ' Dh';

    return `<article 
      data-category="${escapeHtml(product.category || 'Gaming PC')}" 
      data-product="${escapeHtml((product.name + ' ' + (product.specs || '')).toLowerCase())}" 
      class="catalog-product bg-[#161920] border border-gray-800 rounded flex flex-col justify-between hover:border-gray-700 transition">
      <div class="p-6">
        ${isFeatured ? '<div class="text-[10px] uppercase tracking-widest text-amber-400 font-black mb-3">Featured</div>' : ''}
        <div class="flex justify-between items-start mb-4">
          <span class="text-[10px] font-bold uppercase tracking-widest bg-gray-800 text-gray-300 px-2 py-1 rounded">${escapeHtml(product.category || 'New arrival')}</span>
          <span class="text-xs font-bold text-emerald-400">${escapeHtml(product.stock || 'Available')}</span>
        </div>
        <div class="h-44 bg-gray-900 rounded mb-6 overflow-hidden border border-gray-800">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" class="w-full h-full object-cover" loading="lazy">
        </div>
        <h3 class="text-lg font-extrabold uppercase text-white">${escapeHtml(product.name)}</h3>
        <p class="text-xs text-gray-400 mt-1 mb-4 line-clamp-2">${escapeHtml(product.description || 'Configuration assembled and tested by APEX RIGS.')}</p>
        <div class="space-y-2 border-t border-b border-gray-800/80 py-4 text-xs font-mono">${specsHtml}</div>
      </div>
      <div class="p-6 pt-0 flex items-center justify-between gap-3">
        <div>
          <span class="text-xs text-gray-500 block">Price</span>
          <span class="text-2xl font-black text-white">${displayPrice}</span>
        </div>
        <div class="flex gap-2">
          <button onclick="showProductDetailsByName('${escapeHtml(product.name).replace(/'/g, "\\'")}')" class="border border-gray-600 hover:border-white text-white font-bold text-[10px] uppercase px-3 py-2.5 rounded">Details</button>
          <button onclick="addToCart('${escapeHtml(product.name).replace(/'/g, "\\'")}')" class="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] uppercase px-3 py-2.5 rounded">Add</button>
        </div>
      </div>
    </article>`;
  } catch (error) {
    console.error('Error rendering product card:', error);
    return '';
  }
}

function renderFeaturedProducts(products) {
  try {
    const featured = products.filter(p => p.featured && !p.disabled && p.visible !== false);
    const section = document.getElementById('featured-section');
    const container = document.getElementById('featured-products');
    
    if (section && container) {
      section.classList.toggle('hidden', featured.length === 0);
      container.innerHTML = featured.map(p => renderProductCard(p, true)).join('');
    }
  } catch (error) {
    console.error('Error rendering featured products:', error);
  }
}

function showProductDetails(product) {
  try {
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    const image = product.image || 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200&auto=format&fit=crop';
    const specs = Array.isArray(product.specs) ? product.specs : (product.specs || '').split(' | ');

    const detailImage = document.getElementById('detail-image');
    if (detailImage) {
      detailImage.src = image;
      detailImage.alt = product.name;
    }

    const categoryEl = document.getElementById('detail-category');
    if (categoryEl) categoryEl.textContent = product.category || 'New arrival';

    const nameEl = document.getElementById('detail-name');
    if (nameEl) nameEl.textContent = product.name;

    const descEl = document.getElementById('detail-description');
    if (descEl) descEl.textContent = product.description || 'Configuration assembled and tested by APEX RIGS.';

    const specsEl = document.getElementById('detail-specs');
    if (specsEl) {
      specsEl.innerHTML = specs.map(spec => 
        `<span class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-red-600"></span>
          ${escapeHtml(spec)}
        </span>`
      ).join('');
    }

    const priceEl = document.getElementById('detail-price');
    if (priceEl) priceEl.textContent = product.price;

    const stockEl = document.getElementById('detail-stock');
    if (stockEl) stockEl.textContent = product.stock || 'Available';

    const addBtn = document.getElementById('detail-add');
    if (addBtn) {
      addBtn.onclick = () => {
        addToCart(product.name);
        closeProductModal();
      };
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  } catch (error) {
    console.error('Error showing product details:', error);
    showToast(t('Error') + ' displaying product', 'error');
  }
}

function showProductDetailsByName(name) {
  try {
    const stored = JSON.parse(localStorage.getItem(`${CONFIG.STORAGE_PREFIX}-inventory`) || '[]');
    const product = stored.find(p => p.name === name);
    if (product) {
      showProductDetails(product);
    } else {
      showToast(t('Product not found'), 'error');
    }
  } catch (error) {
    console.error('Error finding product:', error);
    showToast(t('Error') + ' loading product', 'error');
  }
}

function closeProductModal(event) {
  const modal = document.getElementById('product-modal');
  if (!event || event.target === modal) {
    if (modal) modal.classList.add('hidden');
  }
}

function showCatalogCategory(category) {
  activeCategory = category;
  closeComponentMenu();
  const searchInput = document.getElementById('catalog-search');
  if (searchInput) searchInput.value = '';
  filterCatalog();
  const prebuilts = document.getElementById('prebuilts');
  if (prebuilts) prebuilts.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function filterCatalog() {
  try {
    const query = (document.getElementById('catalog-search')?.value || '').toLowerCase().trim();
    const products = document.querySelectorAll('.catalog-product');
    let visibleCount = 0;

    products.forEach(product => {
      const category = (product.dataset.category || '').toLowerCase();
      const productData = (product.dataset.product || '').toLowerCase();
      
      const categoryMatch = !activeCategory || category.includes(activeCategory.toLowerCase());
      const queryMatch = !query || productData.includes(query);
      
      if (categoryMatch && queryMatch) {
        product.hidden = false;
        product.style.display = '';
        visibleCount++;
      } else {
        product.hidden = true;
        product.style.display = 'none';
      }
    });

    const emptyMessage = document.getElementById('catalog-empty');
    if (emptyMessage) {
      emptyMessage.classList.toggle('visible', visibleCount === 0);
    }
  } catch (error) {
    console.error('Error filtering catalog:', error);
  }
}

// ==================== CART MANAGEMENT ====================
function loadCart() {
  try {
    cart = JSON.parse(localStorage.getItem(`${CONFIG.STORAGE_PREFIX}-cart`) || '[]');
    updateCartCount();
  } catch (error) {
    console.error('Error loading cart:', error);
    cart = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(`${CONFIG.STORAGE_PREFIX}-cart`, JSON.stringify(cart));
    updateCartCount();
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    const total = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    countEl.textContent = total;
  }
}

function addToCart(name) {
  try {
    if (!name || typeof name !== 'string') {
      showToast(t('Error') + ': Invalid product', 'error');
      return;
    }

    const stored = JSON.parse(localStorage.getItem(`${CONFIG.STORAGE_PREFIX}-inventory`) || '[]');
    const product = stored.find(p => p.name === name);
    
    if (!product) {
      showToast(t('Product not found'), 'error');
      return;
    }

    const price = Number(String(product.price).replace(/[^0-9]/g, '')) || 0;
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    saveCart();
    renderCart();
    showToast(`${name} ${t('Added to cart')}`, 'success');
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast(t('Error') + ' adding to cart', 'error');
  }
}

function updateCartItem(name, change) {
  try {
    const item = cart.find(p => p.name === name);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(p => p.name !== name);
    }
    
    saveCart();
    renderCart();
    showToast(t('Cart updated'), 'success');
  } catch (error) {
    console.error('Error updating cart:', error);
    showToast(t('Error') + ' updating cart', 'error');
  }
}

function renderCart() {
  try {
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (!itemsEl) return;

    if (cart.length === 0) {
      itemsEl.innerHTML = `<div class="text-center py-16">
        <div class="text-4xl mb-4">🛒</div>
        <p class="font-black uppercase">Your cart is empty</p>
        <p class="text-xs text-gray-500 mt-2">Add a configuration to get started.</p>
      </div>`;
    } else {
      itemsEl.innerHTML = cart.map(item => {
        const subtotal = item.price * item.quantity;
        return `<div class="border border-gray-200 rounded p-4">
          <div class="flex justify-between gap-4">
            <strong class="text-sm uppercase">${escapeHtml(item.name)}</strong>
            <span class="font-black whitespace-nowrap">${subtotal.toLocaleString('en-US')} Dh</span>
          </div>
          <div class="flex items-center justify-between mt-3 text-xs text-gray-500">
            <span>${item.price.toLocaleString('en-US')} Dh / unit</span>
            <div class="flex items-center gap-3">
              <button onclick="updateCartItem('${escapeHtml(item.name).replace(/'/g, "\\'")}',-1)" class="w-7 h-7 border border-gray-300 rounded hover:border-red-600">−</button>
              <span class="font-bold text-black w-6 text-center">${item.quantity}</span>
              <button onclick="updateCartItem('${escapeHtml(item.name).replace(/'/g, "\\'")}'  ,1)" class="w-7 h-7 border border-gray-300 rounded hover:border-red-600">+</button>
            </div>
          </div>
        </div>`;
      }).join('');
    }

    if (totalEl) {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      totalEl.textContent = total.toLocaleString('en-US') + ' Dh';
    }
  } catch (error) {
    console.error('Error rendering cart:', error);
  }
}

function showCart() {
  renderCart();
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.remove('hidden');
}

function closeCart(event) {
  const drawer = document.getElementById('cart-drawer');
  if (!event || event.target === drawer) {
    if (drawer) drawer.classList.add('hidden');
  }
}

// ==================== CHECKOUT ====================
function checkoutCart() {
  try {
    if (cart.length === 0) {
      showToast(t('Add product'), 'error');
      return;
    }

    const checkoutSummary = document.getElementById('checkout-summary');
    if (checkoutSummary) {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      checkoutSummary.innerHTML = cart.map(item => `
        <div class="flex justify-between">
          <span>${escapeHtml(item.name)} × ${item.quantity}</span>
          <strong>${(item.price * item.quantity).toLocaleString('en-US')} Dh</strong>
        </div>
      `).join('') + `<div class="border-t border-gray-300 mt-3 pt-3 flex justify-between font-bold">
        <span>Total</span>
        <span>${total.toLocaleString('en-US')} Dh</span>
      </div>`;
    }

    closeCart();
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  } catch (error) {
    console.error('Error initiating checkout:', error);
    showToast(t('Error') + ' starting checkout', 'error');
  }
}

function closeCheckout(event) {
  const modal = document.getElementById('checkout-modal');
  if (!event || event.target === modal) {
    if (modal) modal.classList.add('hidden');
  }
}

async function handleCheckoutSubmit(event) {
  event.preventDefault();
  
  try {
    const name = document.getElementById('checkout-name')?.value?.trim();
    const phone = document.getElementById('checkout-phone')?.value?.trim();
    const email = document.getElementById('checkout-email')?.value?.trim();
    const address = document.getElementById('checkout-address')?.value?.trim();

    // Validation
    if (!name || !phone || !address) {
      showToast(t('Please fill all fields'), 'error');
      return;
    }

    // Phone validation
    const phoneDigits = phone.replace(/\D/g, '');
    if (!/^[0-9]{9,15}$/.test(phoneDigits)) {
      showToast(t('Invalid phone'), 'error');
      return;
    }

    // Create order
    const orderId = '#AR-' + Math.floor(100000 + Math.random() * 900000);
    const orderData = {
      id: orderId,
      customer: name,
      phone,
      email: email || 'not provided',
      address,
      products: cart,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'New Order',
      createdAt: new Date().toISOString(),
      paymentMethod: 'Cash on delivery'
    };

    // Save locally
    const orders = JSON.parse(localStorage.getItem(`${CONFIG.STORAGE_PREFIX}-orders`) || '[]');
    orders.unshift(orderData);
    localStorage.setItem(`${CONFIG.STORAGE_PREFIX}-orders`, JSON.stringify(orders));

    try {
      await createOrder({
        order_number: orderId,
        customer: name,
        phone,
        email: email || 'not provided',
        address,
        products: cart,
        total: orderData.total,
        payment: 'Cash on delivery',
        status: 'New Order'
      });
    } catch (dbError) {
      console.warn('Order saved locally but not synced to database:', dbError.message);
    }

    // Clear cart
    cart = [];
    saveCart();
    closeCheckout();
    showToast(`Order ${orderId} ${t('Order confirmed')} ✓`, 'success');
    
    // Reset form
    event.target.reset();
  } catch (error) {
    console.error('Checkout error:', error);
    showToast(t('Error') + ' processing order', 'error');
  }
}

// ==================== QUOTES ====================
function openQuoteRequest(productName) {
  switchPage('builder');
  const textarea = document.querySelector('#page-builder textarea');
  if (textarea) {
    textarea.value = `I would like a quote for: ${productName}.\n`;
    textarea.focus();
  }
}

async function handleQuoteSubmit(event) {
  event.preventDefault();

  try {
    const name = document.getElementById('quote-name')?.value?.trim();
    const email = document.getElementById('quote-email')?.value?.trim();
    const phone = document.getElementById('quote-phone')?.value?.trim();
    const budget = document.getElementById('quote-budget')?.value;
    const platform = document.getElementById('quote-platform')?.value;
    const notes = document.getElementById('quote-notes')?.value?.trim();

    if (!name || !email || !phone) {
      showToast(t('Please fill all fields'), 'error');
      return;
    }

    // Phone validation
    const phoneDigits = phone.replace(/\D/g, '');
    if (!/^[0-9]{9,15}$/.test(phoneDigits)) {
      showToast(t('Invalid phone'), 'error');
      return;
    }

    const quoteData = {
      id: 'QUOTE-' + Math.floor(100000 + Math.random() * 900000),
      name,
      email,
      phone,
      budget: budget || '',
      platform: platform || '',
      notes: notes || '',
      status: 'NEW REQUEST',
      createdAt: new Date().toISOString()
    };

    // Save locally
    const quotes = JSON.parse(localStorage.getItem(`${CONFIG.STORAGE_PREFIX}-quotes`) || '[]');
    quotes.unshift(quoteData);
    localStorage.setItem(`${CONFIG.STORAGE_PREFIX}-quotes`, JSON.stringify(quotes));

    try {
      await createQuote(quoteData);
    } catch (dbError) {
      console.warn('Quote saved locally but not synced:', dbError.message);
    }

    showToast(`Thank you ${name}, ${t('Quote sent')} ✓`, 'success');
    event.target.reset();
  } catch (error) {
    console.error('Quote submission error:', error);
    showToast(t('Error') + ' submitting quote request', 'error');
  }
}

// ==================== NOTIFICATIONS ====================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  const bgColor = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-emerald-600' : 'bg-[#10151c]';
  toast.className = `fixed bottom-6 right-6 z-[70] ${bgColor} text-white text-xs font-bold px-4 py-3 rounded shadow-lg`;
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), CONFIG.TOAST_DURATION);
}

// ==================== SUPABASE REALTIME ====================
function subscribeToRealtimeUpdates() {
  try {
    if (!window.apexSupabase) return;
    window.apexSupabase.channel('marketplace-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, loadSharedProducts)
      .subscribe();

    window.apexSupabase.channel('marketplace-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, () => {
        showToast('New order received 📦', 'success');
      })
      .subscribe();
  } catch (error) {
    console.warn('Real-time subscriptions unavailable:', error.message);
  }
}

// ==================== WINDOW STORAGE LISTENER ====================
window.addEventListener('storage', (event) => {
  if (event.key === `${CONFIG.STORAGE_PREFIX}-inventory`) {
    renderMarketplaceProducts();
  }
  if (event.key === `${CONFIG.STORAGE_PREFIX}-cart`) {
    loadCart();
    renderCart();
  }
  if (event.key === `${CONFIG.STORAGE_PREFIX}-language`) {
    loadLanguagePreference();
  }
});

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
