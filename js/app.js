(() => {
  const STORAGE_KEYS = {
    theme: 'teleoptics.theme',
    lang: 'teleoptics.lang',
    accessibilityOn: 'teleoptics.accessibility.on',
    cart: 'teleoptics.cart',
    favorites: 'teleoptics.favorites',
  };

  const API_BASE = 'http://localhost:3000';

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
      const icon = c.icon || '';
      return `
        <a href="catalog.html#${c.slug || ''}" class="category-card" data-category-id="${c.id}">
          <div class="category-icon">
            <span class="category-icon-placeholder" aria-hidden="true">${icon}</span>
            <img class="visually-hidden" alt="" src="assets/icons/category-${c.slug || c.id}.svg">
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
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
            <button class="product-action-icon" type="button" data-action="compare" aria-label="${lang === 'en' ? 'Compare' : 'Сравнить'}">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8h16v12H4V8zm2 2v8h12v-8H6z"/>
                <path d="M4 4h16v2H4V4z"/>
                <path d="M6 12h2v4H6v-4z"/>
              </svg>
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
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
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
  }

  init();
})();

