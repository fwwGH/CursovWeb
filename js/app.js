/**
 * TELE-OPTICS — Full Application Script
 * Vanilla JS · No frameworks · No jQuery
 */

(() => {
  'use strict';

  const API_BASE = 'http://localhost:3000';

  const STORAGE = {
    theme:    'teleoptics.theme',
    lang:     'teleoptics.lang',
    a11y:     'teleoptics.a11y',
    cart:     'teleoptics.cart',
    favorites:'teleoptics.favorites',
    compare:  'teleoptics.compare',
    viewed:   'teleoptics.viewed',
    city:     'teleoptics.city',
    user:     'teleoptics.user',
  };

  const ICON_URLS = {
    logo:'assets/icons/logo.svg',search:'assets/icons/search.svg',
    favorite:'assets/icons/heart.svg',cart:'assets/icons/shopping-cart.svg',
    user:'assets/icons/EnterUser.svg',compare:'assets/icons/scales.svg',
    viewed:'assets/icons/eye.svg',phone:'assets/icons/phone.svg',
    email:'assets/icons/mail.svg',pin:'assets/icons/GEOPIN.svg',
    'chevron-down':'assets/icons/chevron-down.svg',
    'chevron-right':'assets/icons/chevron-right.svg',
    'chevron-left':'assets/icons/chevron-left.svg',
    'eye-open':'assets/icons/eye-open.svg',eye:'assets/icons/eye.svg',
    vk:'assets/icons/vk.svg',telegram:'assets/icons/tg.svg',
    viber:'assets/icons/viber.svg',whatsapp:'assets/icons/whatsapp.svg',
    truck:'assets/icons/delivery.svg',return:'assets/icons/return.svg',
    shield:'assets/icons/shield.svg',support:'assets/icons/support.svg',
    theme:'assets/icons/theme.svg',lang:'assets/icons/lang.svg',
    accessibility:'assets/icons/accessibility.svg',
    google:'assets/icons/google.svg',facebook:'assets/icons/facebook.svg',
    plus:'assets/icons/plus.svg',
    'cat-binokli':'assets/icons/category-binokli.svg',
    'cat-teleskopy':'assets/icons/category-teleskopy.svg',
    'cat-dalnomery':'assets/icons/category-dalnomery.svg',
  };

  /* --- storage --- */
  function store(key, val) {
    if (val === undefined) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
    localStorage.setItem(key, JSON.stringify(val));
  }

  /* --- icons --- */
  function applyIcons(root = document) {
    root.querySelectorAll('img[data-icon]').forEach(img => {
      const url = ICON_URLS[img.getAttribute('data-icon')];
      if (url) img.src = url;
    });
  }

  /* --- preloader --- */
  function initPreloader() {
    const el = document.getElementById('preloader');
    if (!el) return;
    window.addEventListener('load', () => setTimeout(() => el.classList.add('hidden'), 600));
  }

  /* --- theme --- */
  function getTheme() { return store(STORAGE.theme) || 'light'; }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    store(STORAGE.theme, theme);
    document.querySelectorAll('.theme-toggle span').forEach(el => el.textContent = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема');
    document.querySelectorAll('.theme-toggle').forEach(b => b.setAttribute('aria-pressed', theme === 'dark'));
  }
  function initTheme() {
    applyTheme(getTheme());
    document.querySelectorAll('.theme-toggle').forEach(b => b.addEventListener('click', () => applyTheme(getTheme() === 'dark' ? 'light' : 'dark')));
  }

  /* --- translations --- */
  const TR = {
    ru:{ popular_categories:'Популярные категории',go_to_catalog:'Перейти в каталог',hits:'Хиты продаж',view_catalog:'Смотреть весь каталог',brands:'Бренды',all_brands:'Все Бренды',recommended:'Рекомендуемые',new:'Новинки',most_viewed:'Самые просматриваемые',discounts:'Скидки',our_goods:'Наши товары',in_stock:'В наличии',out_of_stock:'Нет в наличии',to_cart:'В корзину',to_fav:'В избранное',compare_btn:'Сравнить',items:'товаров',reviews:'отзывов' },
    en:{ popular_categories:'Popular categories',go_to_catalog:'Go to catalog',hits:'Best sellers',view_catalog:'View all',brands:'Brands',all_brands:'All Brands',recommended:'Recommended',new:'New arrivals',most_viewed:'Most viewed',discounts:'Discounts',our_goods:'Our products',in_stock:'In stock',out_of_stock:'Out of stock',to_cart:'Add to cart',to_fav:'To favorites',compare_btn:'Compare',items:'items',reviews:'reviews' },
  };
  function getLang() { return store(STORAGE.lang) || 'ru'; }
  function t(key) { return (TR[getLang()] || TR.ru)[key] || key; }
  function applyLang(lang) {
    store(STORAGE.lang, lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-toggle span').forEach(el => el.textContent = lang === 'ru' ? 'EN' : 'RU');
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = t(el.getAttribute('data-i18n'));
      if (el.tagName === 'INPUT') el.placeholder = v; else el.textContent = v;
    });
  }
  function initLang() {
    applyLang(getLang());
    document.querySelectorAll('.lang-toggle').forEach(b => b.addEventListener('click', () => {
      applyLang(getLang() === 'ru' ? 'en' : 'ru');
      if (window._db) { renderCategories(window._db.categories); renderHits(window._db.products); renderRecommended(window._db.products); renderBanner(window._db.banners, window._db.products); }
    }));
  }

  /* --- a11y --- */
  function getA11y() { return store(STORAGE.a11y) || { on:false, fontSize:'normal', scheme:'default', images:'show', fontFamily:'default' }; }
  function applyA11y(state) {
    store(STORAGE.a11y, state);
    const fsSizes = { small:'13px', normal:'15px', large:'18px' };
    document.documentElement.style.fontSize = fsSizes[state.fontSize] || '15px';
    const b = document.body;
    if (state.on) { b.style.lineHeight='1.8'; b.style.letterSpacing='0.12em'; b.style.wordSpacing='0.16em'; }
    else { b.style.lineHeight=''; b.style.letterSpacing=''; b.style.wordSpacing=''; }
    const schemes = {
      'default':{bg:'',text:'',surface:''},
      'black-white':{bg:'#000',text:'#fff',surface:'#111'},
      'black-green':{bg:'#000',text:'#0f0',surface:'#001100'},
      'beige-brown':{bg:'#f5f0e8',text:'#5c3d11',surface:'#fff'},
      'blue-navy':{bg:'#cce4f7',text:'#003366',surface:'#e8f4fc'},
    };
    const sc = schemes[state.scheme] || schemes['default'];
    const r = document.documentElement;
    if (sc.bg) { r.style.setProperty('--clr-bg',sc.bg); r.style.setProperty('--clr-surface',sc.surface); r.style.setProperty('--clr-text',sc.text); }
    else { r.style.removeProperty('--clr-bg'); r.style.removeProperty('--clr-surface'); r.style.removeProperty('--clr-text'); }
    const fonts = { default:"'Roboto','Arial',sans-serif", arial:'Arial,sans-serif', times:"'Times New Roman',serif", verdana:'Verdana,sans-serif' };
    r.style.setProperty('--font-main', fonts[state.fontFamily] || fonts.default);
    document.querySelectorAll('img:not([data-icon]):not([src*="icon"]):not([src*="logo"])').forEach(img => { img.style.display = state.images==='hide'?'none':''; });
    document.querySelectorAll('[data-a11y]').forEach(btn => {
      const type = btn.getAttribute('data-a11y'); const val = btn.getAttribute('data-val');
      if (!val) return;
      btn.classList.toggle('active', String(state[type]) === String(val));
      btn.setAttribute('aria-pressed', String(state[type]) === String(val));
    });
    const sel = document.querySelector('select[data-a11y="fontFamily"]');
    if (sel) sel.value = state.fontFamily || 'default';
  }
  function initA11y() {
    const panel = document.getElementById('a11y-panel');
    applyA11y(getA11y());
    document.querySelectorAll('.visually-impaired-btn').forEach(btn => btn.addEventListener('click', () => {
      if (!panel) return;
      const open = panel.classList.toggle('open');
      panel.setAttribute('aria-hidden', !open);
      btn.setAttribute('aria-pressed', open);
    }));
    document.getElementById('a11y-close')?.addEventListener('click', () => { panel?.classList.remove('open'); panel?.setAttribute('aria-hidden','true'); });
    panel?.querySelectorAll('[data-a11y]:not(select)').forEach(btn => btn.addEventListener('click', () => {
      const s = {...getA11y(), on:true}; s[btn.getAttribute('data-a11y')] = btn.getAttribute('data-val'); applyA11y(s);
    }));
    panel?.querySelector('select[data-a11y]')?.addEventListener('change', function() {
      const s = {...getA11y(), on:true}; s[this.getAttribute('data-a11y')] = this.value; applyA11y(s);
    });
  }

  /* --- reset --- */
  function initReset() {
    document.querySelectorAll('.reset-settings-btn').forEach(b => b.addEventListener('click', () => {
      Object.values(STORAGE).forEach(k => localStorage.removeItem(k));
      showToast('Настройки сброшены','success');
      setTimeout(() => location.reload(), 600);
    }));
  }

  /* --- toast --- */
  function showToast(msg, type='default', duration=3000) {
    let c = document.getElementById('toast-container');
    if (!c) { c = document.createElement('div'); c.id='toast-container'; c.className='toast-container'; c.setAttribute('aria-live','polite'); document.body.appendChild(c); }
    const t2 = document.createElement('div'); t2.className=`toast ${type}`; t2.textContent=msg; c.appendChild(t2);
    setTimeout(() => { t2.style.animation='slideOut 0.3s ease forwards'; setTimeout(()=>t2.remove(),300); }, duration);
  }

  /* --- fetch --- */
  async function fetchJson(url) { const r=await fetch(url,{headers:{Accept:'application/json'}}); if(!r.ok) throw new Error(r.status); return r.json(); }
  async function loadDb() {
    try {
      const [categories,products,brands,banners] = await Promise.all([fetchJson(`${API_BASE}/categories`),fetchJson(`${API_BASE}/products`),fetchJson(`${API_BASE}/brands`),fetchJson(`${API_BASE}/banners`)]);
      return {categories,products,brands,banners};
    } catch {
      const db = await fetchJson('data/db.json');
      return {categories:db.categories||[],products:db.products||[],brands:db.brands||[],banners:db.banners||[]};
    }
  }

  /* --- format --- */
  function fmtPrice(n) { return new Intl.NumberFormat('ru-RU').format(n)+' ₽'; }
  function stars(r,max=5) { let h=''; for(let i=1;i<=max;i++) h+=`<span style="color:${i<=Math.round(r)?'#ffd600':'#d0d6dd'}">★</span>`; return h; }

  /* --- cart / favs / compare / viewed --- */
  const getCart=()=>store(STORAGE.cart)||[];
  const getFavs=()=>store(STORAGE.favorites)||[];
  const getCompare=()=>store(STORAGE.compare)||[];
  const getViewed=()=>store(STORAGE.viewed)||[];

  function addToCart(id) {
    const c=getCart(); const it=c.find(i=>i.productId===id);
    if(it) it.quantity=(it.quantity||1)+1; else c.push({productId:id,quantity:1});
    store(STORAGE.cart,c); updateBadges(); showToast('Товар добавлен в корзину','success');
  }
  function toggleFav(id) {
    const f=getFavs(); const i=f.indexOf(id);
    if(i===-1){f.push(id);showToast('Добавлено в избранное','success');}else{f.splice(i,1);}
    store(STORAGE.favorites,f); updateBadges(); return i===-1;
  }
  function toggleCompare(id) {
    const l=getCompare(); const i=l.indexOf(id);
    if(i===-1){if(l.length>=4){showToast('Максимум 4 товара','error');return false;}l.push(id);showToast('Добавлено к сравнению','success');}else{l.splice(i,1);}
    store(STORAGE.compare,l); updateBadges(); return i===-1;
  }
  function addViewed(id) {
    const v=getViewed().filter(x=>x!==id); v.unshift(id); store(STORAGE.viewed,v.slice(0,30)); updateBadges();
  }
  function updateBadges() {
    const cc=getCart().reduce((s,i)=>s+(i.quantity||1),0);
    const fc=getFavs().length; const cp=getCompare().length; const vw=getViewed().length;

    // Set badge text + toggle yellow color when has items
    function setBadge(id, val) {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = val;
      // Yellow when has items, grey when empty
      if (val > 0) {
        el.classList.add('action-badge-yellow');
        el.classList.remove('action-badge-grey');
      } else {
        el.classList.remove('action-badge-yellow');
        el.classList.add('action-badge-grey');
      }
    }

    setBadge('cart-badge', cc);
    setBadge('cart-badge-bottom', cc);
    setBadge('favorites-badge', fc);
    setBadge('favorites-badge-bottom', fc);
    setBadge('compare-badge', cp);
    setBadge('compare-badge-bottom', cp);
    setBadge('viewed-badge', vw);
  }

  /* --- product card --- */
  function productCard(p) {
    const lang=getLang(); const name=lang==='en'?(p.nameEn||p.name):p.name;
    const inStock=!!p.inStock; const price=fmtPrice(p.price||0);
    const old=p.oldPrice?fmtPrice(p.oldPrice):'';
    const disc=p.oldPrice?Math.round((1-p.price/p.oldPrice)*100):0;
    const isFav=getFavs().includes(p.id);
    const badges=[
      p.isHit?`<span class="badge badge-hit">${lang==='en'?'HIT':'ХИТ'}</span>`:'',
      p.isNew?`<span class="badge badge-new">${lang==='en'?'NEW':'Новинка'}</span>`:'',
      disc>0?`<span class="badge badge-sale">-${disc}%</span>`:'',
    ].filter(Boolean).join('');
    return `<article class="product-card" role="listitem" data-product-id="${p.id}">
  <div class="product-card-top">
    <div class="product-badges">${badges}</div>
    <div class="product-stock${inStock?'':' product-stock--out'}">
      <span class="product-stock-dot"></span>${inStock?t('in_stock'):t('out_of_stock')}
    </div>
    <a class="product-image-wrap" href="product.html?id=${p.id}" aria-label="${name}">
      <img src="${p.image||'assets/images/MainBannerBig.png'}" alt="${name}" loading="lazy" width="200" height="160">
    </a>
    <div class="product-actions-overlay">
      <button class="product-action-icon fav-btn${isFav?' fav-btn--active':''}" type="button" data-action="favorite" aria-label="${t('to_fav')}">
        <img class="ui-icon ui-icon-sm" data-icon="favorite" alt="" aria-hidden="true">
      </button>
      <button class="product-action-icon" type="button" data-action="compare" aria-label="${t('compare_btn')}">
        <img class="ui-icon ui-icon-sm" data-icon="compare" alt="" aria-hidden="true">
      </button>
    </div>
  </div>
  <div class="product-card-body">
    <div class="product-rating">
      <span class="stars" aria-hidden="true">${stars(p.rating||0)}</span>
      <span class="rating-value">${p.rating?p.rating.toFixed(2):''}</span>
      <span class="rating-count">${p.reviews?`(${p.reviews} ${t('reviews')})`:''}</span>
    </div>
    <a href="product.html?id=${p.id}" class="product-name">${name}</a>
    <div class="product-price-row">
      <div class="product-prices">
        <span class="product-price">${price}</span>
        ${old?`<span class="product-price-old">${old}</span>`:''}
      </div>
      <button class="add-to-cart-btn" type="button" data-action="add-to-cart" aria-label="${t('to_cart')}">
        <img class="ui-icon ui-icon-sm" data-icon="plus" alt="" aria-hidden="true">
      </button>
    </div>
  </div>
</article>`;
  }

  function bindProductActions() {
    document.addEventListener('click', e => {
      const btn=e.target.closest('[data-action]'); if(!btn) return;
      const card=btn.closest('[data-product-id]'); if(!card) return;
      const id=Number(card.dataset.productId);
      if(btn.dataset.action==='add-to-cart'){addToCart(id);btn.style.background='var(--clr-success)';setTimeout(()=>btn.style.background='',1000);}
      if(btn.dataset.action==='favorite'){const on=toggleFav(id);btn.classList.toggle('fav-btn--active',on);}
      if(btn.dataset.action==='compare') toggleCompare(id);
    });
  }

  /* --- categories --- */
const CAT_ICONS={
    1: 'assets/icons/binokly.svg',
    2: 'assets/icons/telescope.svg',
    3: 'assets/icons/dalnomeri.svg',
    4: 'assets/icons/ZritelTrubi.svg',
    5: 'assets/icons/crosshair.svg',
    6: 'assets/icons/loopi.svg',
    7: 'assets/icons/monoculars.svg',
    8: 'assets/icons/microscope.svg',
    9: 'assets/icons/teplovisor.svg',
    10: 'assets/icons/digitalcamera.svg',};  const CAT_BG=['#e3f0fc','#fff3e0','#f3e5f5','#e8eaf6','#fce4ec','#f1f8e9','#e0f2f1','#e8f5e9','#fbe9e7','#ede7f6'];
  function renderCategories(cats) {
    const g=document.getElementById('categories-grid'); if(!g) return;
    const lang=getLang();
    g.innerHTML=cats.map((c,i)=>{
      const name=lang==='en'?(c.nameEn||c.name):c.name;
      const icon=CAT_ICONS[c.id]||'assets/icons/category-binokli.svg';
      return `<a href="catalog.html#${c.slug}" class="category-card" aria-label="${name}">
  <div class="category-icon" style="background:${CAT_BG[i%CAT_BG.length]}">
    <img src="${icon}" alt="" aria-hidden="true" width="48" height="48" loading="lazy">
  </div>
  <div class="category-name">${name}</div>
  <div class="category-count">${c.count?`${c.count} ${t('items')}`:''}</div>
</a>`;
    }).join('');
  }

  /* --- carousel --- */
  function makeCarousel(rowId, dotsId, prevSel, nextSel, perPage=4) {
    const row=document.getElementById(rowId); if(!row) return null;
    const dotsEl=document.getElementById(dotsId);
    let items=[],page=0;
    function renderPage() {
      const pages=Math.max(1,Math.ceil(items.length/perPage));
      page=Math.max(0,Math.min(page,pages-1));
      row.innerHTML=items.slice(page*perPage,(page+1)*perPage).map(productCard).join('');
      applyIcons(row);
      if(dotsEl){
        dotsEl.innerHTML=Array.from({length:pages},(_,i)=>`<button class="carousel-dot${i===page?' active':''}" type="button" data-page="${i}" aria-label="Страница ${i+1}" aria-selected="${i===page}"></button>`).join('');
        dotsEl.querySelectorAll('.carousel-dot').forEach(d=>d.addEventListener('click',()=>{page=+d.dataset.page;renderPage();}));
      }
    }
    const section=row.closest('section')||document;
    section.querySelector(prevSel)?.addEventListener('click',()=>{page=Math.max(0,page-1);renderPage();});
    section.querySelector(nextSel)?.addEventListener('click',()=>{page=Math.min(Math.ceil(items.length/perPage)-1,page+1);renderPage();});
    return {setItems(arr){items=arr;page=0;renderPage();}};
  }

  let hitsC, recC, allProducts=[], activeTab='recommended';
  function renderHits(products) {
    if(!hitsC) hitsC=makeCarousel('hits-row','hits-dots','.section-hits .carousel-prev','.section-hits .carousel-next');
    hitsC?.setItems(products.filter(p=>p.isHit||p.inStock).slice(0,8));
  }
  function getFiltered(){
    switch(activeTab){
      case 'new': return allProducts.filter(p=>p.isNew);
      case 'sale': return allProducts.filter(p=>p.oldPrice&&p.oldPrice>p.price);
      case 'viewed': return allProducts.slice(0,8);
      default: return allProducts.filter(p=>p.inStock);
    }
  }
  function renderRecommended(products) {
    allProducts=products;
    if(!recC) recC=makeCarousel('products-row','rec-dots','.section-recommended .carousel-prev','.section-recommended .carousel-next');
    recC?.setItems(getFiltered());
    document.querySelectorAll('.tab-btn[data-tab]').forEach(btn=>btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab-btn[data-tab]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});
      btn.classList.add('active');btn.setAttribute('aria-selected','true');
      activeTab=btn.dataset.tab; recC?.setItems(getFiltered());
    }));
  }

  function renderBrands(brands) {
    const l=document.getElementById('brands-list'); if(!l||l.querySelector('.brands-together-img')) return;
    l.innerHTML=brands.map(b=>`<div class="brand-item">${b.logo||b.name}</div>`).join('');
  }

  function renderBanner(banners,products) {
    const root=document.querySelector('[data-banner]'); if(!root||!banners?.length) return;
    const lang=getLang(); const b=banners[0]; const prod=products.find(p=>p.id===b.productId);
    const st=(sel,val)=>{const el=root.querySelector(sel);if(el)el.textContent=val||'';};
    st('[data-banner-title]',lang==='en'?(b.titleEn||b.title):b.title);
    st('[data-banner-subtitle]',lang==='en'?(b.subtitleEn||b.subtitle):b.subtitle);
    st('[data-banner-old-price]',b.oldPrice?`${b.oldPrice}₽`:'');
    st('[data-banner-new-price]',b.newPrice?`${b.newPrice} ₽`:'');
    st('[data-banner-btn]',lang==='en'?(b.btnTextEn||b.btnText):b.btnText);
    st('[data-banner-brand]',prod?.brand||'');
    const link=root.querySelector('[data-banner-btn]');
    if(link&&prod) link.href=`product.html?id=${prod.id}`;
    const img=root.querySelector('[data-banner-image]');
    if(img&&prod?.image) img.src=prod.image;
  }

  /* --- hero slider (два независимых) --- */
  function initHeroSlider() {
    function makeSlider(containerId, slideSelector, dotSelector) {
      const wrap  = document.getElementById(containerId);
      if (!wrap) return;
      const slides = wrap.querySelectorAll(slideSelector);
      const dots   = wrap.querySelectorAll(dotSelector);
      if (!slides.length) return;

      let cur = 0, timer;

      function go(n) {
        slides[cur].classList.remove('active');
        if (dots[cur]) { dots[cur].classList.remove('active'); dots[cur].setAttribute('aria-selected','false'); }
        cur = (n + slides.length) % slides.length;
        slides[cur].classList.add('active');
        if (dots[cur]) { dots[cur].classList.add('active'); dots[cur].setAttribute('aria-selected','true'); }
      }

      const nav = n => { clearInterval(timer); go(n); timer = setInterval(() => go(cur + 1), 5000); };

      wrap.querySelector('.hero-arrow--prev')?.addEventListener('click', () => nav(cur - 1));
      wrap.querySelector('.hero-arrow--next')?.addEventListener('click', () => nav(cur + 1));
      dots.forEach((d, i) => d.addEventListener('click', () => nav(i)));

      if (slides.length > 1) timer = setInterval(() => go(cur + 1), 5000);
    }

    makeSlider('hero-main', '.hero-main-slide', '.hero-dot');
    makeSlider('hero-side', '.hero-side-slide', '.hero-dot');
  }

  /* --- mobile menu --- */
  function initMobileMenu() {
    const menu=document.getElementById('mobile-menu'); const burger=document.querySelector('.burger-btn');
    if(!menu||!burger) return;
    const open=()=>{menu.classList.add('open');menu.setAttribute('aria-hidden','false');burger.classList.add('open');burger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';};
    const shut=()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true');burger.classList.remove('open');burger.setAttribute('aria-expanded','false');document.body.style.overflow='';};
    burger.addEventListener('click',()=>menu.classList.contains('open')?shut():open());
    document.querySelector('.mobile-menu-close')?.addEventListener('click',shut);
    menu.addEventListener('click',e=>{if(e.target===menu)shut();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')shut();});
  }

  /* --- modals --- */
  function openModal(id){const el=document.getElementById(id);if(!el)return;el.classList.add('open');document.body.style.overflow='hidden';el.querySelector('input')?.focus();}
  function closeModal(el){if(!el)return;el.classList.remove('open');if(!document.querySelector('.modal-overlay.open'))document.body.style.overflow='';}
  function initModals(){
    document.addEventListener('click',e=>{
      const tr=e.target.closest('[data-open]'); if(tr){e.preventDefault();openModal(tr.getAttribute('data-open')+'-modal');}
      const sw=e.target.closest('[data-switch-modal]'); if(sw){closeModal(sw.closest('.modal-overlay'));openModal(sw.getAttribute('data-switch-modal'));}
      if(e.target.closest('.modal-close'))closeModal(e.target.closest('.modal-overlay'));
      if(e.target.classList.contains('modal-overlay'))closeModal(e.target);
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-overlay.open').forEach(closeModal);});
  }

  /* --- top-more --- */
  function initTopMore(){
    document.querySelectorAll('.top-more').forEach(w=>{
      const b=w.querySelector('.top-more-btn');const d=w.querySelector('.top-more-dropdown');if(!b||!d)return;
      d.hidden=true;
      b.addEventListener('click',e=>{e.stopPropagation();const open=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!open);d.hidden=open;});
      document.addEventListener('click',()=>{b.setAttribute('aria-expanded','false');d.hidden=true;});
    });
  }

  /* --- nav dropdown --- */
  function initNavDropdowns(){
    document.querySelectorAll('.nav-item').forEach(item=>{
      const dd=item.querySelector('.nav-dropdown');if(!dd)return;
      item.addEventListener('mouseenter',()=>dd.classList.add('open'));
      item.addEventListener('mouseleave',()=>dd.classList.remove('open'));
    });
  }

  /* --- search --- */
  function initSearch(){
    const inp=document.getElementById('search-input'); if(!inp) return;
    const go=()=>{const q=inp.value.trim();if(q)window.location.href=`catalog.html?search=${encodeURIComponent(q)}`;};
    document.querySelector('.search-btn')?.addEventListener('click',go);
    inp.addEventListener('keydown',e=>{if(e.key==='Enter')go();});
  }

  /* --- city --- */
  function initCity(){
    const saved=store(STORAGE.city)||'Москва';
    document.querySelectorAll('#city-label').forEach(el=>el.textContent=saved);
    document.querySelector('.city-selector')?.addEventListener('click',()=>openModal('city-modal'));
    document.addEventListener('click',e=>{
      const opt=e.target.closest('.city-option');if(!opt)return;e.preventDefault();
      const city=opt.dataset.city; store(STORAGE.city,city);
      document.querySelectorAll('#city-label').forEach(el=>el.textContent=city);
      closeModal(document.getElementById('city-modal')); showToast(`Город: ${city}`);
    });
    document.getElementById('city-search')?.addEventListener('input',function(){
      const q=this.value.trim().toLowerCase();
      document.querySelectorAll('.city-option').forEach(o=>{o.style.display=o.textContent.toLowerCase().includes(q)?'':'none';});
    });
  }

  /* --- forms --- */
  function initForms(){
    const subForm=(id,msg,close_id)=>{
      document.getElementById(id)?.addEventListener('submit',async e=>{
        e.preventDefault();const btn=e.target.querySelector('[type=submit]');
        if(btn){btn.disabled=true;const orig=btn.textContent;btn.textContent='…';}
        await new Promise(r=>setTimeout(r,700));
        showToast(msg,'success',5000); e.target.reset();
        if(btn){btn.disabled=false;}
        if(close_id)closeModal(document.getElementById(close_id));
      });
    };
    subForm('consultation-form','Заявка отправлена! Мы перезвоним вам.');
    subForm('newsletter-form','Вы подписались на рассылку!');
    subForm('callback-form','Мы скоро перезвоним!','callback-modal');

    document.getElementById('login-form')?.addEventListener('submit',async e=>{
      e.preventDefault();
      const email=(document.getElementById('login-email')?.value||'').trim();
      const pass=document.getElementById('login-password')?.value||'';
      if(!email||!pass){showToast('Заполните все поля','error');return;}
      try{
        const db=await fetchJson('data/db.json');
        const u=(db.users||[]).find(u=>u.email===email&&u.password===pass);
        if(u){
          const userData={id:u.id,name:u.name,role:u.role,email:u.email};
          store(STORAGE.user,userData);
          showToast('Добро пожаловать, '+u.name+'!','success');
          closeModal(document.getElementById('login-modal'));
          // Update all auth labels
          document.querySelectorAll('#auth-label,.header-top-auth').forEach(el=>{
            el.textContent=u.name.split(' ')[0];
          });
          // Show admin panel if admin
          if(u.role==='admin') showAdminPanel(u);
        } else {
          showToast('Неверный email или пароль','error');
        }
      }catch(err){
        console.error('Login error:',err);
        showToast('Ошибка входа. Проверьте запущен ли json-server','error');
      }
    });

    document.getElementById('register-form')?.addEventListener('submit',e=>{
      e.preventDefault();
      const p=document.getElementById('reg-password')?.value;
      const c=document.getElementById('reg-confirm')?.value;
      if(p!==c){showToast('Пароли не совпадают','error');return;}
      if((p||'').length<8){showToast('Пароль: минимум 8 символов','error');return;}
      showToast('Регистрация успешна!','success');closeModal(document.getElementById('register-modal'));
    });

    document.querySelectorAll('.password-toggle').forEach(btn=>btn.addEventListener('click',()=>{
      const inp=btn.previousElementSibling;if(!inp)return;inp.type=inp.type==='password'?'text':'password';
    }));
  }

  /* --- accordion --- */
  function initAccordion(){
    document.querySelectorAll('.accordion-item').forEach(item=>{
      const hdr=item.querySelector('.accordion-header');const cont=item.querySelector('.accordion-content');if(!hdr||!cont)return;
      const isOpen=item.classList.contains('open');cont.hidden=!isOpen;hdr.setAttribute('aria-expanded',isOpen);
      hdr.addEventListener('click',()=>{
        const open=!item.classList.contains('open');
        item.closest('.accordion')?.querySelectorAll('.accordion-item.open').forEach(it=>{if(it!==item){it.classList.remove('open');it.querySelector('.accordion-content').hidden=true;it.querySelector('.accordion-header').setAttribute('aria-expanded','false');}});
        item.classList.toggle('open',open);cont.hidden=!open;hdr.setAttribute('aria-expanded',open);
      });
    });
  }

  /* --- filter sidebar --- */
  function initFilter(){
    const sid=document.querySelector('.filter-sidebar');if(!sid)return;
    const minS=sid.querySelector('[data-filter="price-min"]');const maxS=sid.querySelector('[data-filter="price-max"]');
    const minV=sid.querySelector('#price-min-val');const maxV=sid.querySelector('#price-max-val');
    if(minS&&maxS){
      const sync=()=>{if(+minS.value>+maxS.value)minS.value=maxS.value;if(minV)minV.textContent=new Intl.NumberFormat('ru-RU').format(minS.value);if(maxV)maxV.textContent=new Intl.NumberFormat('ru-RU').format(maxS.value);};
      minS.addEventListener('input',sync);maxS.addEventListener('input',sync);sync();
    }
    document.querySelector('.filter-toggle-btn')?.addEventListener('click',()=>{sid.classList.toggle('open');});
  }

  /* --- product gallery --- */
  function initGallery(){
    const thumbs=document.querySelectorAll('.product-thumb');const main=document.querySelector('.product-main-image');if(!thumbs.length||!main)return;
    thumbs.forEach((t,i)=>{t.addEventListener('click',()=>{thumbs.forEach(x=>x.classList.remove('active'));t.classList.add('active');main.src=t.dataset.src||t.src;});if(i===0)t.classList.add('active');});
  }

  /* --- quantity counter --- */
  function initQty(){
    document.querySelectorAll('.quantity-wrap').forEach(w=>{
      const m=w.querySelector('.qty-minus');const p=w.querySelector('.qty-plus');const i=w.querySelector('.qty-input');if(!m||!p||!i)return;
      m.addEventListener('click',()=>i.value=Math.max(1,+i.value-1));
      p.addEventListener('click',()=>i.value=+i.value+1);
    });
  }

  /* --- pagination --- */
  function initPagination(){
    document.querySelectorAll('.pagination').forEach(pg=>{
      pg.addEventListener('click',e=>{
        const btn=e.target.closest('[data-page]');if(!btn||btn.disabled)return;
        pg.querySelectorAll('[data-page]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
        pg.dispatchEvent(new CustomEvent('pagechange',{detail:{page:+btn.dataset.page},bubbles:true}));
      });
    });
  }

  /* ============================================================
     INIT
     ============================================================ */

  /* =============================================
     ADMIN PANEL
     ============================================= */
  function showAdminPanel(user) {
    // Remove existing panel
    document.getElementById('admin-panel')?.remove();
    const panel = document.createElement('div');
    panel.id = 'admin-panel';
    panel.className = 'admin-panel';
    panel.innerHTML = `
      <div class="admin-panel-header">
        <span>👑 Админ: ${user.name}</span>
        <button class="admin-panel-close" type="button">×</button>
      </div>
      <div class="admin-panel-body">
        <div class="admin-panel-title">Панель управления</div>
        <div class="admin-btns">
          <a href="kategoriya.html" class="admin-btn">📦 Управление товарами</a>
          <a href="reviews.html" class="admin-btn">💬 Отзывы покупателей</a>
          <a href="blog.html" class="admin-btn">📝 Статьи блога</a>
          <a href="vacancies.html" class="admin-btn">👥 Вакансии</a>
          <button class="admin-btn admin-btn-danger" id="admin-logout">🚪 Выйти</button>
        </div>
      </div>`;
    document.body.appendChild(panel);
    panel.querySelector('.admin-panel-close').addEventListener('click', () => panel.remove());
    panel.querySelector('#admin-logout')?.addEventListener('click', () => {
      localStorage.removeItem('teleoptics.user');
      document.querySelectorAll('#auth-label,.header-top-auth').forEach(el => el.textContent = 'Вход / Регистрация');
      panel.remove();
      showToast('Вы вышли из системы');
    });
  }

  /* =============================================
     RESTORE SESSION
     ============================================= */
  function restoreSession() {
    const u = store(STORAGE.user);
    if (!u) return;
    document.querySelectorAll('#auth-label,.header-top-auth').forEach(el => {
      el.textContent = u.name.split(' ')[0];
    });
    if (u.role === 'admin') showAdminPanel(u);
  }

  async function init() {
    initPreloader();
    initTheme();
    applyIcons();
    updateBadges();
    initLang();
    initA11y();
    initReset();
    initMobileMenu();
    initTopMore();
    initNavDropdowns();
    initModals();
    initSearch();
    initCity();
    initForms();
    initHeroSlider();
    initAccordion();
    initFilter();
    initGallery();
    initQty();
    bindProductActions();
    initPagination();
    initKategoriyaPage();

    restoreSession();

    try {
      const db=await loadDb(); window._db=db;
      renderCategories(db.categories);
      renderBrands(db.brands);
      renderBanner(db.banners,db.products);
      renderHits(db.products);
      renderRecommended(db.products);
      applyIcons();
    } catch(err){console.warn('DB load error:',err);}
  }

  document.addEventListener('DOMContentLoaded', init);

  /* =============================================
     PAGINATION SYSTEM — sliding window
     ============================================= */

  // Build sliding window pagination: 1 2 3 4 5 … 18
  // When cur=2: 2 3 4 5 6 … 18
  function buildPagination(container, totalPages, curPage, onPageChange) {
    if (!container) return;

    function render(cur) {
      const btns = [];

      // Prev
      btns.push({label:'‹ Назад', page: cur-1, disabled: cur<=1, cls:'', aria:'Предыдущая'});

      // Window: show 5 pages around current
      const window_size = 5;
      let start = Math.max(1, cur - Math.floor(window_size/2));
      let end   = Math.min(totalPages, start + window_size - 1);
      // Adjust if near end
      if (end - start < window_size - 1) start = Math.max(1, end - window_size + 1);

      if (start > 1) {
        btns.push({label:'1', page:1, cls:''});
        if (start > 2) btns.push({label:'…', page:null, cls:'dots'});
      }

      for (let i = start; i <= end; i++) {
        btns.push({label:String(i), page:i, cls: i===cur ? 'active' : ''});
      }

      if (end < totalPages) {
        if (end < totalPages - 1) btns.push({label:'…', page:null, cls:'dots'});
        btns.push({label:String(totalPages), page:totalPages, cls:''});
      }

      // Next
      btns.push({label:'Далее ›', page: cur+1, disabled: cur>=totalPages, cls:'', aria:'Следующая'});

      container.innerHTML = btns.map(b => {
        if (b.cls === 'dots') return `<span class="pagination-dots">…</span>`;
        const disabled = b.disabled ? 'disabled' : '';
        const active   = b.cls === 'active' ? ' active' : '';
        const aria     = b.cls === 'active' ? ' aria-current="page"' : '';
        const pg       = b.page ? `data-page="${b.page}"` : '';
        return `<button class="pagination-btn${active}" type="button" ${pg} ${disabled} ${aria}>${b.label}</button>`;
      }).join('');

      // Bind clicks
      container.querySelectorAll('.pagination-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
          const pg = +btn.dataset.page;
          if (!pg || pg < 1 || pg > totalPages) return;
          render(pg);
          onPageChange(pg);
          // Scroll to top of list
          document.getElementById('kategoriya-grid')?.scrollIntoView({behavior:'smooth', block:'start'});
        });
      });
    }

    render(curPage);
  }

  /* =============================================
     KATEGORIYA PAGE — products + filter + pagination
     ============================================= */
  async function initKategoriyaPage() {
    const grid = document.getElementById('kategoriya-grid');
    if (!grid) return;

    let allProducts = [];
    let filteredProducts = [];
    const ITEMS_PER_PAGE = 12;
    let currentPage = 1;

    // Load products
    try {
      const db = await fetchJson('data/db.json');
      allProducts = db.products || [];
    } catch {
      try {
        const db = window._db || await fetchJson('data/db.json');
        allProducts = (db?.products) || [];
      } catch { return; }
    }

    // Get URL category from hash
    const hash = window.location.hash.replace('#','');
    const catSlug = new URLSearchParams(window.location.search).get('cat') || hash || '';
    const searchQ = new URLSearchParams(window.location.search).get('search') || '';

    function applyFilters() {
      filteredProducts = allProducts.filter(p => {
        if (searchQ) {
          const q = searchQ.toLowerCase();
          if (!p.name.toLowerCase().includes(q) && !(p.brand||'').toLowerCase().includes(q)) return false;
        }
        return true;
      });

      // Price filter
      const minInput = document.getElementById('price-min');
      const maxInput = document.getElementById('price-max');
      if (minInput && maxInput) {
        const min = +minInput.value || 0;
        const max = +maxInput.value || Infinity;
        filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
      }

      // Brand filter
      const checkedBrands = [...document.querySelectorAll('.filter-sidebar input[type=checkbox]:checked')]
        .map(cb => cb.value.toLowerCase())
        .filter(v => v);
      if (checkedBrands.length) {
        filteredProducts = filteredProducts.filter(p => checkedBrands.includes((p.brand||'').toLowerCase()));
      }

      // Sort
      const sortSel = document.querySelector('.sort-dropdown');
      if (sortSel) {
        switch(sortSel.value) {
          case 'price-asc':  filteredProducts.sort((a,b) => a.price - b.price); break;
          case 'price-desc': filteredProducts.sort((a,b) => b.price - a.price); break;
          case 'rating':     filteredProducts.sort((a,b) => (b.rating||0) - (a.rating||0)); break;
          case 'name':       filteredProducts.sort((a,b) => a.name.localeCompare(b.name,'ru')); break;
          default:           filteredProducts.sort((a,b) => (b.reviews||0) - (a.reviews||0));
        }
      }

      currentPage = 1;
      renderPage();
    }

    function renderPage() {
      const total = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const items = filteredProducts.slice(start, start + ITEMS_PER_PAGE);

      if (!items.length) {
        grid.innerHTML = '<div style="padding:40px;text-align:center;color:var(--clr-text-muted);grid-column:1/-1">Товары не найдены</div>';
      } else {
        grid.innerHTML = items.map(p => productCard(p)).join('');
        applyIcons(grid);
      }

      // Render pagination
      const pg = document.getElementById('kategoriya-pagination');
      buildPagination(pg, total, currentPage, (page) => {
        currentPage = page;
        renderPage();
      });

      // Update count label
      const filterBtn = document.querySelector('.filter-btn-count');
      if (filterBtn) filterBtn.textContent = 'Показать товары ' + filteredProducts.length;
    }

    // Init filters
    applyFilters();

    // Bind sort change
    document.querySelector('.sort-dropdown')?.addEventListener('change', applyFilters);

    // Bind filter apply
    document.querySelector('.filter-apply-btn')?.addEventListener('click', applyFilters);
    document.querySelector('.filter-reset-btn')?.addEventListener('click', () => {
      document.querySelectorAll('.filter-sidebar input[type=checkbox]').forEach(cb => cb.checked = false);
      const minI = document.getElementById('price-min');
      const maxI = document.getElementById('price-max');
      if (minI) { minI.value = minI.min || 0; }
      if (maxI) { maxI.value = maxI.max || 200000; }
      const minV = document.getElementById('price-min-val');
      const maxV = document.getElementById('price-max-val');
      if (minV) minV.textContent = '0';
      if (maxV) maxV.textContent = '200 000';
      applyFilters();
    });

    // Price range sliders
    const minS = document.getElementById('price-min');
    const maxS = document.getElementById('price-max');
    if (minS && maxS) {
      [minS, maxS].forEach(s => s.addEventListener('input', () => {
        if (+minS.value > +maxS.value) minS.value = maxS.value;
        const minV = document.getElementById('price-min-val');
        const maxV = document.getElementById('price-max-val');
        if (minV) minV.textContent = new Intl.NumberFormat('ru-RU').format(minS.value);
        if (maxV) maxV.textContent = new Intl.NumberFormat('ru-RU').format(maxS.value);
      }));
    }

    // Sidebar hits/new
    const sidebarHits = document.getElementById('sidebar-hits');
    if (sidebarHits) {
      const hits = allProducts.filter(p => p.isHit).slice(0,2);
      sidebarHits.innerHTML = hits.map(p => `
        <a href="product.html?id=${p.id}" class="sidebar-mini-card">
          <img src="${p.image||''}" alt="${p.name}" width="60" height="60" loading="lazy">
          <div>
            <div style="font-size:12px;line-height:1.3;color:var(--clr-text)">${p.name.substring(0,40)}…</div>
            <div style="font-size:13px;font-weight:700;color:var(--clr-text);margin-top:3px">${fmtPrice(p.price)}</div>
            ${p.oldPrice?`<div style="font-size:11px;color:var(--clr-text-muted);text-decoration:line-through">${fmtPrice(p.oldPrice)}</div>`:''}
          </div>
        </a>`).join('');
      applyIcons(sidebarHits);
    }
    const sidebarNew = document.getElementById('sidebar-new');
    if (sidebarNew) {
      const news = allProducts.filter(p => p.isNew).slice(0,1);
      sidebarNew.innerHTML = news.map(p => `
        <a href="product.html?id=${p.id}" class="sidebar-mini-card">
          <img src="${p.image||''}" alt="${p.name}" width="60" height="60" loading="lazy">
          <div>
            <div style="font-size:12px;line-height:1.3;color:var(--clr-text)">${p.name.substring(0,40)}…</div>
            <div style="font-size:13px;font-weight:700;color:var(--clr-text);margin-top:3px">${fmtPrice(p.price)}</div>
          </div>
        </a>`).join('');
      applyIcons(sidebarNew);
    }
  }

})();

/* =============================================
   VIEWED POPUP
   ============================================= */
function initViewedPopup() {
  const btn    = document.getElementById('viewed-popup-btn');
  const popup  = document.getElementById('viewed-popup');
  const closeB = popup?.querySelector('.viewed-popup-close');
  if (!btn || !popup) return;

  // Toggle open/close
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = !popup.hidden;
    popup.hidden = isOpen;
    btn.setAttribute('aria-expanded', !isOpen);
    if (!isOpen) renderViewedPopup();
  });

  // Close button
  closeB?.addEventListener('click', () => {
    popup.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!popup.hidden && !popup.contains(e.target) && e.target !== btn) {
      popup.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !popup.hidden) {
      popup.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

async function renderViewedPopup() {
  const list   = document.getElementById('viewed-popup-list');
  const footer = document.getElementById('viewed-popup-footer');
  if (!list) return;

  const viewedIds = getViewed();
  if (!viewedIds.length) {
    list.innerHTML = '<div class="viewed-popup-empty">Вы ещё не просматривали товары</div>';
    if (footer) footer.hidden = true;
    return;
  }

  let products = window._db?.products || [];
  if (!products.length) {
    try {
      const r = await fetch('data/db.json');
      const d = await r.json();
      products = d.products || [];
    } catch { return; }
  }

  const items = viewedIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 6);

  if (!items.length) {
    list.innerHTML = '<div class="viewed-popup-empty">Товары не найдены</div>';
    return;
  }

  list.innerHTML = items.map(p => {
    const price    = new Intl.NumberFormat('ru-RU').format(p.price) + ' ₽';
    const oldPrice = p.oldPrice ? new Intl.NumberFormat('ru-RU').format(p.oldPrice) + ' ₽' : '';
    const ratingStars = [1,2,3,4,5].map(i =>
      `<span style="color:${i <= Math.round(p.rating||0) ? '#ffd600' : '#d0d6dd'}">★</span>`
    ).join('');

    return `
<a class="viewed-mini-card" href="product.html?id=${p.id}">
  <div class="viewed-mini-stock">В наличии</div>
  <img src="${p.image || 'assets/images/MainBannerBig.png'}" alt="${p.name}" loading="lazy">
  <div class="viewed-mini-thumbs">
    <div class="viewed-mini-thumb active"></div>
    <div class="viewed-mini-thumb"></div>
    <div class="viewed-mini-thumb"></div>
  </div>
  <div class="viewed-mini-name">${p.name}</div>
  <div class="viewed-mini-rating">
    <span class="stars">${ratingStars}</span>
    <span>${p.rating ? p.rating.toFixed(2) : ''}</span>
    <span style="color:var(--clr-text-muted)">${p.reviews ? `(${p.reviews} отзывов)` : ''}</span>
  </div>
  <div class="viewed-mini-price-row">
    <div>
      <div class="viewed-mini-price">${price}</div>
      ${oldPrice ? `<div class="viewed-mini-price-old">${oldPrice}</div>` : ''}
    </div>
    <button class="viewed-mini-cart" type="button" aria-label="В корзину"
            data-action="add-to-cart" data-product-id="${p.id}"
            onclick="event.preventDefault();event.stopPropagation();">
      <img class="ui-icon" data-icon="cart" alt="" aria-hidden="true">
    </button>
  </div>
</a>`;
  }).join('');

  applyIcons(list);

  // Bind cart buttons inside popup
  list.querySelectorAll('[data-action="add-to-cart"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      addToCart(Number(btn.dataset.productId));
      btn.style.background = 'var(--clr-success)';
      setTimeout(() => btn.style.background = '', 1000);
    });
  });

  if (footer) footer.hidden = false;
}

/* =============================================
   PRODUCT CARD HOVER SPECS
   ============================================= */
function initCardHoverSpecs() {
  // Добавляем мини-характеристики в каждую карточку товара при рендере
  // Вызывается после рендера карусели/грида
  document.addEventListener('mouseenter', e => {
    const card = e.target.closest('.product-card');
    if (!card || card.querySelector('.product-card-specs')) return;

    const id = Number(card.dataset.productId);
    if (!id || !window._db) return;

    const p = window._db.products.find(pr => pr.id === id);
    if (!p?.specs && !p?.brand) return;

    const sp = p.specs || {};
    const lang = getLang();

    const lines = [
      p.brand                ? `<div class="spec-line"><span>${lang==='en'?'Brand':'Производитель'}:</span><strong>${p.brand}</strong></div>` : '',
      sp.diameter            ? `<div class="spec-line"><span>${lang==='en'?'Lens diameter':'Диаметр объектива'}:</span><strong>${sp.diameter} мм</strong></div>` : '',
      sp.magnification       ? `<div class="spec-line"><span>${lang==='en'?'Magnification':'Увеличение'}:</span><strong>${sp.magnification}</strong></div>` : '',
      p.categoryId === 1     ? `<div class="spec-line"><span>${lang==='en'?'Purpose':'Назначение'}:</span><strong>${lang==='en'?'Hunting & fishing':'Охота и рыбалка'}</strong></div>` : '',
      sp.coating             ? `<div class="spec-line"><span>${lang==='en'?'Coating':'Покрытие'}:</span><strong>${sp.coating}</strong></div>` : '',
    ].filter(Boolean).slice(0, 4).join('');

    if (!lines) return;

    const specsEl = document.createElement('div');
    specsEl.className = 'product-card-specs';
    specsEl.innerHTML = lines;
    card.appendChild(specsEl);
  }, true);
}

/* ── Добавляем вызовы в init ── */
const _origInit = document.addEventListener;
document.addEventListener('DOMContentLoaded', () => {
  initViewedPopup();
  initCardHoverSpecs();
});
