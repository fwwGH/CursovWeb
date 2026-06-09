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
    const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};
    set('cart-badge',cc);set('cart-badge-bottom',cc);
    set('favorites-badge',fc);set('favorites-badge-bottom',fc);
    set('compare-badge',cp);set('compare-badge-bottom',cp);
    set('viewed-badge',vw);
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
      const email=document.getElementById('login-email')?.value;
      const pass=document.getElementById('login-password')?.value;
      if(!email||!pass){showToast('Заполните все поля','error');return;}
      try{
        const db=await fetchJson('data/db.json');
        const u=(db.users||[]).find(u=>u.email===email&&u.password===pass);
        if(u){
          const userData={id:u.id,name:u.name,role:u.role,email:u.email};
          store(STORAGE.user, userData);
          showToast('Добро пожаловать, '+u.name+'!','success');
          closeModal(document.getElementById('login-modal'));
          updateAuthUI(u.name);
          if(u.role==='admin') showAdminPanel(u);
        } else {
          showToast('Неверный email или пароль','error');
        }
      } catch(err) {
        console.error('Login error:',err);
        showToast('Ошибка входа','error');
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

  // Update all auth-related UI elements with user name
  function updateAuthUI(name) {
    const short = name.split(' ')[0];
    // header-top auth link
    document.querySelectorAll('.header-top-auth').forEach(el => {
      el.textContent = short;
      el.removeAttribute('data-open');
      el.href = '#';
    });
    // header-main auth button span
    document.querySelectorAll('#auth-label').forEach(el => {
      el.textContent = short;
    });
    // Any other auth labels
    document.querySelectorAll('[data-auth-name]').forEach(el => {
      el.textContent = short;
    });
  }

  // Restore session on page load
  function restoreSession() {
    const u = store(STORAGE.user);
    if (!u) return;
    updateAuthUI(u.name);
    if (u.role === 'admin') {
      // Show admin indicator subtly
      document.querySelectorAll('.header-top-auth').forEach(el => {
        el.style.color = '#ffd600';
      });
    }
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
    initAccordion();
    initFilter();
    initGallery();
    initQty();
    bindProductActions();

  // ── Track viewed on card click ──
  document.addEventListener('click', e => {
    const link = e.target.closest('a.product-image-wrap, a.product-name');
    if (!link) return;
    const card = link.closest('[data-product-id]');
    if (card) addViewed(Number(card.dataset.productId));
  });


  // Track viewed products on card click
  document.addEventListener('click', e => {
    const link = e.target.closest('a.product-image-wrap, a.product-name, .product-card a');
    if (!link) return;
    const card = link.closest('[data-product-id]');
    if (card) addViewed(Number(card.dataset.productId));
  });

    initPagination();

    const u=store(STORAGE.user);
    if(u){const l=document.getElementById('auth-label');if(l)l.textContent=u.name.split(' ')[0];}

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

  // Expose utility functions globally so out-of-IIFE code can use them
  window.applyIcons   = applyIcons;
  window.addToCart    = addToCart;
  window.updateBadges = updateBadges;
  window.showToast    = showToast;
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

  const viewedIds = JSON.parse(localStorage.getItem('teleoptics.viewed') || '[]');
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

/* =============================================
   CART MODAL — рабочая всплывашка
   ============================================= */
function fmtP(n) { return new Intl.NumberFormat('ru-RU').format(n) + ' ₽'; }

async function openCartModal() {
  const overlay = document.getElementById('cart-modal');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  await renderCartModal();
}

async function renderCartModal() {
  const list     = document.getElementById('cart-modal-list');
  const summary  = document.getElementById('cart-modal-summary');
  const subtitle = document.getElementById('cart-modal-subtitle');
  const totalEl  = document.getElementById('cart-modal-total');
  if (!list) return;

  const cartItems = JSON.parse(localStorage.getItem('teleoptics.cart') || '[]');
  if (!cartItems.length) {
    list.innerHTML = '<div class="popup-modal-empty">Ваша корзина пуста</div>';
    if (summary) summary.style.display = 'none';
    if (subtitle) subtitle.textContent = '';
    return;
  }

  let products = [];
  try {
    const db = window._db || (await fetch('data/db.json').then(r => r.json()));
    products = db.products || [];
  } catch {}

  let total = 0;
  let totalQty = 0;

  const rows = cartItems.map(item => {
    const p = products.find(x => x.id === item.productId);
    if (!p) return '';
    const qty   = item.quantity || 1;
    const price = p.price * qty;
    total    += price;
    totalQty += qty;
    return `
<div class="cart-modal-item" data-product-id="${p.id}">
  <img class="cart-modal-item-img" src="${p.image || 'assets/images/MainBannerBig.png'}" alt="${p.name}" loading="lazy">
  <a class="cart-modal-item-name" href="product.html?id=${p.id}">${p.name}</a>
  <div class="cart-modal-item-qty">
    <button class="cart-modal-qty-btn" data-dir="-1" aria-label="Уменьшить">−</button>
    <input class="cart-modal-qty-val" type="number" value="${qty}" min="1" aria-label="Количество" readonly>
    <button class="cart-modal-qty-btn" data-dir="1" aria-label="Увеличить">+</button>
  </div>
  <div class="cart-modal-item-price">${fmtP(price)}</div>
  <button class="cart-modal-item-remove" aria-label="Удалить">×</button>
</div>`;
  }).join('');

  list.innerHTML = rows || '<div class="popup-modal-empty">Ваша корзина пуста</div>';
  if (summary) summary.style.display = 'flex';
  if (subtitle) subtitle.textContent = `Вы выбрали ${totalQty} товара на сумму ${fmtP(total).replace(' ₽', '')} рублей`;
  if (totalEl)  totalEl.textContent = fmtP(total);

  // Qty buttons
  list.querySelectorAll('.cart-modal-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row   = btn.closest('.cart-modal-item');
      const id    = Number(row.dataset.productId);
      const input = row.querySelector('.cart-modal-qty-val');
      const dir   = Number(btn.dataset.dir);
      const cart  = JSON.parse(localStorage.getItem('teleoptics.cart') || '[]');
      const it    = cart.find(x => x.productId === id);
      if (!it) return;
      it.quantity = Math.max(1, (it.quantity || 1) + dir);
      input.value = it.quantity;
      localStorage.setItem('teleoptics.cart', JSON.stringify(cart));
      renderCartModal();
      updateBadges();
    });
  });

  // Remove buttons
  list.querySelectorAll('.cart-modal-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const row  = btn.closest('.cart-modal-item');
      const id   = Number(row.dataset.productId);
      const cart = JSON.parse(localStorage.getItem('teleoptics.cart') || '[]')
        .filter(x => x.productId !== id);
      localStorage.setItem('teleoptics.cart', JSON.stringify(cart));
      updateBadges();
      renderCartModal();
    });
  });

  // Clear all
  document.getElementById('cart-modal-clear')?.addEventListener('click', () => {
    localStorage.removeItem('teleoptics.cart');
    updateBadges();
    renderCartModal();
  });
}

/* =============================================
   COMPARE MODAL — всплывашка сравнения
   ============================================= */
async function openCompareModal() {
  const overlay = document.getElementById('compare-modal');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  await renderCompareModal();
}

async function renderCompareModal() {
  const list = document.getElementById('compare-modal-list');
  if (!list) return;

  const ids = JSON.parse(localStorage.getItem('teleoptics.compare') || '[]');
  if (!ids.length) {
    list.innerHTML = '<div class="popup-modal-empty">Вы ещё не добавили товары к сравнению</div>';
    return;
  }

  let products = [];
  try {
    const db = window._db || (await fetch('data/db.json').then(r => r.json()));
    products = (db.products || []).filter(p => ids.includes(p.id));
  } catch {}

  if (!products.length) {
    list.innerHTML = '<div class="popup-modal-empty">Товары не найдены</div>';
    return;
  }

  list.innerHTML = products.map(p => `
<div class="popup-mini-card" data-product-id="${p.id}">
  <button class="popup-mini-card-remove" type="button" aria-label="Удалить из сравнения">×</button>
  <a href="product.html?id=${p.id}" style="text-decoration:none">
    <img src="${p.image || 'assets/images/MainBannerBig.png'}" alt="${p.name}" loading="lazy">
    <div class="popup-mini-card-name">${p.name}</div>
    <div class="popup-mini-card-price">${fmtP(p.price)}</div>
  </a>
</div>`).join('');

  // Remove from compare
  list.querySelectorAll('.popup-mini-card-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id   = Number(btn.closest('[data-product-id]').dataset.productId);
      const list2 = JSON.parse(localStorage.getItem('teleoptics.compare') || '[]')
        .filter(x => x !== id);
      localStorage.setItem('teleoptics.compare', JSON.stringify(list2));
      updateBadges();
      renderCompareModal();
    });
  });
}

/* =============================================
   FAVORITES MODAL — всплывашка избранного
   ============================================= */
async function openFavoritesModal() {
  const overlay = document.getElementById('favorites-modal');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  await renderFavoritesModal();
}

async function renderFavoritesModal() {
  const list = document.getElementById('favorites-modal-list');
  if (!list) return;

  const ids = JSON.parse(localStorage.getItem('teleoptics.favorites') || '[]');
  if (!ids.length) {
    list.innerHTML = '<div class="popup-modal-empty">Вы ещё ничего не добавили в избранное</div>';
    return;
  }

  let products = [];
  try {
    const db = window._db || (await fetch('data/db.json').then(r => r.json()));
    products = (db.products || []).filter(p => ids.includes(p.id));
  } catch {}

  if (!products.length) {
    list.innerHTML = '<div class="popup-modal-empty">Товары не найдены</div>';
    return;
  }

  list.innerHTML = products.map(p => `
<div class="popup-mini-card" data-product-id="${p.id}">
  <button class="popup-mini-card-remove" type="button" aria-label="Удалить из избранного">×</button>
  <a href="product.html?id=${p.id}" style="text-decoration:none">
    <img src="${p.image || 'assets/images/MainBannerBig.png'}" alt="${p.name}" loading="lazy">
    <div class="popup-mini-card-name">${p.name}</div>
    <div class="popup-mini-card-price">${fmtP(p.price)}</div>
  </a>
  <button class="btn btn-primary" type="button"
    style="width:100%;margin-top:8px;font-size:11px;padding:6px"
    data-action="add-to-cart" data-product-id="${p.id}">В корзину</button>
</div>`).join('');

  // Remove from favorites
  list.querySelectorAll('.popup-mini-card-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id   = Number(btn.closest('[data-product-id]').dataset.productId);
      const favs = JSON.parse(localStorage.getItem('teleoptics.favorites') || '[]')
        .filter(x => x !== id);
      localStorage.setItem('teleoptics.favorites', JSON.stringify(favs));
      updateBadges();
      renderFavoritesModal();
    });
  });

  // Add to cart from favorites
  list.querySelectorAll('[data-action="add-to-cart"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = Number(btn.dataset.productId);
      addToCart(id);
      btn.style.background = 'var(--clr-success)';
      setTimeout(() => btn.style.background = '', 1000);
    });
  });

  applyIcons(list);
}

/* =============================================
   INTERCEPT data-open CLICKS → custom handlers
   ============================================= */
function initPopupModals() {
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-open]');
    if (!trigger) return;
    const target = trigger.getAttribute('data-open');
    if (target === 'cart') {
      e.preventDefault(); e.stopPropagation();
      openCartModal(); return;
    }
    if (target === 'compare') {
      e.preventDefault(); e.stopPropagation();
      openCompareModal(); return;
    }
    if (target === 'favorites') {
      e.preventDefault(); e.stopPropagation();
      openFavoritesModal(); return;
    }
    // login/register/callback/city — обычный modal
    openModal(target + '-modal');
  }, true); // capture phase — перехватываем до других handlers
}

/* =============================================
   HERO SLIDER — two independent sliders
   ============================================= */
function initHeroSlider() {
  function makeSlider(containerId, slideSelector) {
    const wrap = document.getElementById(containerId);
    if (!wrap) return;
    const slides = wrap.querySelectorAll(slideSelector);
    const dots   = wrap.querySelectorAll('.hero-dot');
    if (!slides.length) return;

    let cur = 0, timer;

    function go(n) {
      slides[cur].classList.remove('active');
      if (dots[cur]) { dots[cur].classList.remove('active'); dots[cur].setAttribute('aria-selected','false'); }
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('active');
      if (dots[cur]) { dots[cur].classList.add('active'); dots[cur].setAttribute('aria-selected','true'); }
    }
    const nav = n => { clearInterval(timer); go(n); if (slides.length > 1) timer = setInterval(() => go(cur+1), 5000); };

    wrap.querySelector('.hero-arrow-btn--prev')?.addEventListener('click', () => nav(cur-1));
    wrap.querySelector('.hero-arrow-btn--next')?.addEventListener('click', () => nav(cur+1));
    dots.forEach((d,i) => d.addEventListener('click', () => nav(i)));

    // Swipe
    let tx = 0;
    wrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, {passive:true});
    wrap.addEventListener('touchend',   e => { const dx = e.changedTouches[0].clientX - tx; if(Math.abs(dx)>50) nav(dx<0?cur+1:cur-1); });

    if (slides.length > 1) timer = setInterval(() => go(cur+1), 5000);
  }

  makeSlider('hero-main', '.hero-main-slide');
  makeSlider('hero-side', '.hero-side-slide');
}

/* ── Add to init ── */
document.addEventListener('DOMContentLoaded', () => {
  initPopupModals();
  initHeroSlider();
});
