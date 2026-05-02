(() => {
  const STORAGE_KEYS = {
    theme: 'teleoptics.theme',
    lang: 'teleoptics.lang',
    accessibilityOn: 'teleoptics.accessibility.on',
    cart: 'teleoptics.cart',
    favorites: 'teleoptics.favorites',
  };

  const API_BASE = 'http://localhost:3000';

  /**
   * Центральное место для замены иконок/картинок на прямые ссылки из Figma.
   * Сюда вставляй прямые URL на SVG/PNG/JPG (не на страницу Figma).
   * Пример: 'https://s3-alpha.figma.com/....png'
   */
  const ICON_URLS = {
    // Header / UI
    logo: 'assets/icons/logo.svg',
    search: 'assets/icons/search.svg',
    favorite: 'assets/icons/heart.svg',
    cart: 'assets/icons/shopping-cart.svg',
    user: 'assets/icons/EnterUser.svg',
    compare: 'assets/icons/scales.svg',
    viewed: 'assets/icons/eye.svg',
    phone: 'assets/icons/phone.svg',
    email: 'assets/icons/mail.svg',
    pin: 'assets/icons/GEOPIN.svg',
    'chevron-down': 'assets/icons/chevron-down.svg',
    'chevron-right': 'assets/icons/chevron-right.svg',
    'chevron-left': 'assets/icons/chevron-left.svg',
    'eye-open': 'assets/icons/eye-open.svg',

    // Socials
    vk: 'assets/icons/vk.svg',
    telegram: 'assets/icons/tg.svg',
    viber: 'assets/icons/viber.svg',
    whatsapp: 'assets/icons/whatsapp.svg',

    // Features
    truck: 'assets/icons/delivery.svg',
    return: 'assets/icons/return.svg',
    shield: 'assets/icons/shield.svg',
    support: 'assets/icons/support.svg',

    // Settings bar
    theme: 'assets/icons/theme.svg',
    lang: 'assets/icons/lang.svg',
    accessibility: 'assets/icons/accessibility.svg',
    google: 'assets/icons/google.svg',
    facebook: 'assets/icons/facebook.svg',

    // Categories / blocks
    'cat-binokli': 'assets/icons/category-binokli.svg',
    'cat-teleskopy': 'assets/icons/category-teleskopy.svg',
    'cat-dalnomery': 'assets/icons/category-dalnomery.svg',

    // Product card
    'plus': 'assets/icons/plus.svg',
  };

  function isProbablyUrl(s) {
    return typeof s === 'string' && /^(https?:)?\/\//.test(s);
  }

  function applyIconUrls(root = document) {
    const nodes = Array.from(root.querySelectorAll('img[data-icon]'));
    nodes.forEach((img) => {
      const key = img.getAttribute('data-icon');
      if (!key) return;
      const url = ICON_URLS[key];
      if (!url) return;
      img.setAttribute('src', url);
    });
  }

  /** @returns {string} */
  function getLang() {
    return localStorage.getItem(STORAGE_KEYS.lang) || 'ru';
  }

  /** @param {string} lang */
  function setLang(lang) {
    localStorage.setItem(STORAGE_KEYS.lang, lang);
    document.documentElement.lang = lang === 'en' ? 'en' : 'ru';
  }

  /** @returns {'dark'|'light'} */
  function getTheme() {
    return (localStorage.getItem(STORAGE_KEYS.theme) === 'dark') ? 'dark' : 'light';
  }

  /** @param {'dark'|'light'} theme */
  function applyTheme(theme) {
    if (theme === 'dark') document.body.setAttribute('data-theme', 'dark');
    else document.body.removeAttribute('data-theme');
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }

  function getAccessibilityOn() {
    return localStorage.getItem(STORAGE_KEYS.accessibilityOn) === '1';
  }

  function applyAccessibility(on) {
    if (on) document.body.setAttribute('data-accessibility', 'on');
    else document.body.removeAttribute('data-accessibility');
    localStorage.setItem(STORAGE_KEYS.accessibilityOn, on ? '1' : '0');
  }

  /** @template T @param {string} key @param {T} fallback */
  function readJsonStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return /** @type {T} */ (JSON.parse(raw));
    } catch {
      return fallback;
    }
  }

  function writeJsonStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function formatPriceRUB(value) {
    try {
      return new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
    } catch {
      return String(value) + ' ₽';
    }
  }

  async function fetchJson(url) {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.json();
  }

  async function loadDb() {
    // Prefer json-server; fallback to local file for GH Pages / file://
    try {
      const [categories, products, brands, banners, favorites, cart] = await Promise.all([
        fetchJson(`${API_BASE}/categories`),
        fetchJson(`${API_BASE}/products`),
        fetchJson(`${API_BASE}/brands`),
        fetchJson(`${API_BASE}/banners`),
        fetchJson(`${API_BASE}/favorites`),
        fetchJson(`${API_BASE}/cart`),
      ]);
      return { categories, products, brands, banners, favorites, cart };
    } catch {
      const db = await fetchJson(`data/db.json`);
      return {
        categories: db.categories || [],
        products: db.products || [],
        brands: db.brands || [],
        banners: db.banners || [],
        favorites: db.favorites || [],
        cart: db.cart || [],
      };
    }
  }

  function setText(el, text) {
    if (!el) return;
    el.textContent = text;
  }

  function renderCategories(categories) {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    const lang = getLang();
    grid.innerHTML = categories.slice(0, 5).map((c) => {
      const name = lang === 'en' ? (c.nameEn || c.name) : c.name;
      const count = typeof c.count === 'number' ? c.count : '';
      const iconUrl = (/** @type {any} */ (c)).image || (/** @type {any} */ (c)).iconUrl || '';
      return `
        <a href="catalog.html#${c.slug || ''}" class="category-card" data-category-id="${c.id}">
          <div class="category-icon">
            <img alt="${name}" data-hide-img="false" src="${isProbablyUrl(iconUrl) ? iconUrl : (iconUrl || `assets/img/category-${c.slug || c.id}.png`)}">
          </div>
          <div class="category-name">${name}</div>
          <div class="category-count">${count ? `${count} ${lang === 'en' ? 'items' : 'товаров'}` : ''}</div>
        </a>
      `.trim();
    }).join('');
  }

  function renderBrands(brands) {
    const list = document.getElementById('brands-list');
    if (!list) return;
    list.innerHTML = brands.map((b) => {
      return `<button class="brand-item" type="button" data-brand="${String(b.name || '')}">${b.logo || b.name || ''}</button>`;
    }).join('');
  }

  function productCard(product) {
    const lang = getLang();
    const name = lang === 'en' ? (product.nameEn || product.name) : product.name;
    const badges = [
      product.isHit ? `<span class="badge badge-hit">${lang === 'en' ? 'Hit' : 'Хит'}</span>` : '',
      product.isNew ? `<span class="badge badge-new">${lang === 'en' ? 'New' : 'Новинка'}</span>` : '',
      product.oldPrice && product.oldPrice > product.price ? `<span class="badge badge-sale">${lang === 'en' ? 'Sale' : 'Акция'}</span>` : '',
    ].filter(Boolean).join('');

    const rating = typeof product.rating === 'number' ? product.rating.toFixed(2) : '';
    const reviews = typeof product.reviews === 'number' ? product.reviews : '';
    const inStock = !!product.inStock;
    const price = formatPriceRUB(product.price || 0);
    const old = product.oldPrice ? formatPriceRUB(product.oldPrice) : '';

    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-card-top">
          <div class="product-badges">${badges}</div>
          <div class="product-stock" aria-label="${inStock ? (lang === 'en' ? 'In stock' : 'В наличии') : (lang === 'en' ? 'Out of stock' : 'Нет в наличии')}">
            <span class="product-stock-dot" style="${inStock ? '' : 'background: var(--clr-danger)'}"></span>
            ${inStock ? (lang === 'en' ? 'In stock' : 'В наличии') : (lang === 'en' ? 'Out of stock' : 'Нет в наличии')}
          </div>
          <a class="product-image-wrap" href="product.html?id=${product.id}" aria-label="${name}">
            <img src="${product.image || 'assets/img/product.png'}" alt="${name}">
          </a>
          <div class="product-actions-overlay">
            <button class="product-action-icon" type="button" data-action="favorite" aria-label="${lang === 'en' ? 'Add to favorites' : 'В избранное'}">
              <img class="ui-icon" data-icon="favorite" alt="" aria-hidden="true">
            </button>
            <button class="product-action-icon" type="button" data-action="compare" aria-label="${lang === 'en' ? 'Compare' : 'Сравнить'}">
              <img class="ui-icon" data-icon="compare" alt="" aria-hidden="true">
            </button>
          </div>
        </div>
        <div class="product-card-body">
          <div class="product-rating">
            <div class="stars" aria-hidden="true">★★★★★</div>
            <span class="rating-value">${rating}</span>
            <span class="rating-count">${reviews ? `(${reviews})` : ''}</span>
          </div>
          <h3 class="product-name">${name}</h3>
          <div class="product-price-row">
            <div class="product-prices">
              <div class="product-price">${price}</div>
              <div class="product-price-old">${old}</div>
            </div>
            <button class="add-to-cart-btn" type="button" data-action="add-to-cart" aria-label="${lang === 'en' ? 'Add to cart' : 'В корзину'}">
              <img class="ui-icon" data-icon="plus" alt="" aria-hidden="true">
            </button>
          </div>
        </div>
      </div>
    `.trim();
  }

  function filterProducts(products, tab, query) {
    const q = (query || '').trim().toLowerCase();
    let items = [...products];

    if (tab === 'hits') items = items.filter(p => !!p.isHit);
    if (tab === 'new') items = items.filter(p => !!p.isNew);
    if (tab === 'sale') items = items.filter(p => p.oldPrice && p.oldPrice > p.price);

    if (q) {
      items = items.filter(p => String(p.name || '').toLowerCase().includes(q) || String(p.brand || '').toLowerCase().includes(q));
    }

    // recommended fallback: best rated first
    items.sort((a, b) => (Number(b.rating || 0) - Number(a.rating || 0)));
    return items.slice(0, 4);
  }

  function renderProducts(products, tab, query) {
    const row = document.getElementById('products-row');
    if (!row) return;
    const items = filterProducts(products, tab, query);
    row.innerHTML = items.map(productCard).join('');
  }

  function renderBanner(banners, products) {
    const root = document.querySelector('[data-banner]');
    if (!root) return;

    const lang = getLang();
    const banner = banners?.[0];
    if (!banner) return;
    const product = products.find(p => p.id === banner.productId);

    setText(root.querySelector('[data-banner-title]'), lang === 'en' ? (banner.titleEn || banner.title) : banner.title);
    setText(root.querySelector('[data-banner-subtitle]'), lang === 'en' ? (banner.subtitleEn || banner.subtitle) : banner.subtitle);
    setText(root.querySelector('[data-banner-old-price]'), banner.oldPrice ? `${banner.oldPrice} ₽` : '');
    setText(root.querySelector('[data-banner-new-price]'), banner.newPrice ? `${banner.newPrice} ₽` : '');
    setText(root.querySelector('[data-banner-btn]'), lang === 'en' ? (banner.btnTextEn || banner.btnText) : banner.btnText);

    const btn = root.querySelector('[data-banner-btn]');
    if (btn && product?.id) btn.setAttribute('href', `product.html?id=${product.id}`);

    setText(root.querySelector('[data-banner-brand]'), product?.brand || '—');
    setText(root.querySelector('[data-banner-type]'), ' ');
  }

  function updateBadgesFromStorage() {
    const cart = readJsonStorage(STORAGE_KEYS.cart, []);
    const favorites = readJsonStorage(STORAGE_KEYS.favorites, []);

    const cartCount = cart.reduce((sum, i) => sum + (Number(i.quantity || 0) || 0), 0);
    const favCount = favorites.length;

    const ids = {
      'cart-badge': cartCount,
      'cart-badge-bottom': cartCount,
      'favorites-badge': favCount,
      'favorites-badge-bottom': favCount,
      'compare-badge': 0,
      'compare-badge-bottom': 0,
    };

    Object.entries(ids).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val);
    });
  }

  function bindTabs(onTabChange) {
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    if (!tabs.length) return;
    tabs.forEach((btn) => {
      btn.addEventListener('click', () => {
        tabs.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        onTabChange(btn.dataset.tab || 'recommended');
      });
    });
  }

  function bindSearch(onQuery) {
    const input = document.getElementById('search-input');
    if (!input) return;
    let t = 0;
    input.addEventListener('input', () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => onQuery(input.value), 150);
    });
  }

  function bindThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  function bindLangToggle(onChange) {
    const btn = document.querySelector('.lang-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = getLang() === 'ru' ? 'en' : 'ru';
      setLang(next);
      btn.classList.toggle('active', true);
      btn.setAttribute('data-lang', next);
      btn.setAttribute('aria-pressed', 'true');
      btn.lastChild.textContent = next.toUpperCase();
      onChange(next);
    });
  }

  function bindAccessibilityToggle() {
    const btn = document.querySelector('.visually-impaired-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const on = !getAccessibilityOn();
      applyAccessibility(on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function bindModal() {
    const overlay = document.getElementById('login-modal');
    if (!overlay) return;
    const openBtn = document.querySelector('[data-open="login"]');
    const closeBtn = overlay.querySelector('.modal-close');

    function open() {
      overlay.classList.add('open');
    }
    function close() {
      overlay.classList.remove('open');
    }

    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  function bindBurgerMenu() {
    const burger = document.querySelector('.burger-btn');
    const menu = document.getElementById('mobile-menu');
    const closeBtn = document.querySelector('.mobile-menu-close');
    if (!burger || !menu || !closeBtn) return;

    function open() {
      burger.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', () => {
      if (menu.classList.contains('open')) close();
      else open();
    });
    closeBtn.addEventListener('click', close);
    menu.addEventListener('click', (e) => {
      const target = /** @type {HTMLElement} */ (e.target);
      if (target.closest('.mobile-nav-item')) close();
    });
  }

  function bindProductActions() {
    document.addEventListener('click', (e) => {
      const target = /** @type {HTMLElement} */ (e.target);
      const actionEl = target.closest('[data-action]');
      if (!actionEl) return;

      const productCardEl = target.closest('[data-product-id]');
      const productId = productCardEl ? Number(productCardEl.getAttribute('data-product-id')) : null;
      if (!productId) return;

      const action = actionEl.getAttribute('data-action');
      if (action === 'add-to-cart') {
        const cart = readJsonStorage(STORAGE_KEYS.cart, []);
        const found = cart.find(i => i.productId === productId);
        if (found) found.quantity = (Number(found.quantity || 0) || 0) + 1;
        else cart.push({ productId, quantity: 1 });
        writeJsonStorage(STORAGE_KEYS.cart, cart);
        updateBadgesFromStorage();
      }

      if (action === 'favorite') {
        const favorites = readJsonStorage(STORAGE_KEYS.favorites, []);
        const idx = favorites.indexOf(productId);
        if (idx >= 0) favorites.splice(idx, 1);
        else favorites.push(productId);
        writeJsonStorage(STORAGE_KEYS.favorites, favorites);
        updateBadgesFromStorage();
      }
    });
  }

  function bindPreloader() {
    window.addEventListener('load', () => {
      const preloader = document.getElementById('preloader');
      if (!preloader) return;
      window.setTimeout(() => preloader.classList.add('hidden'), 700);
    });
  }

  async function init() {
    bindPreloader();

    applyTheme(getTheme());
    setLang(getLang());
    applyAccessibility(getAccessibilityOn());

    bindThemeToggle();
    bindAccessibilityToggle();
    bindModal();
    bindBurgerMenu();
    bindProductActions();

    applyIconUrls(document);
    updateBadgesFromStorage();

    const db = await loadDb();
    renderCategories(db.categories);
    renderBrands(db.brands);
    renderBanner(db.banners, db.products);

    let activeTab = 'recommended';
    let query = '';

    const rerender = () => renderProducts(db.products, activeTab, query);
    bindTabs((tab) => {
      activeTab = tab;
      rerender();
    });
    bindSearch((q) => {
      query = q;
      rerender();
    });
    bindLangToggle(() => {
      renderCategories(db.categories);
      renderBanner(db.banners, db.products);
      rerender();
    });

    rerender();
    // icons inside freshly rendered product cards
    applyIconUrls(document);
  }

  init();
})();

