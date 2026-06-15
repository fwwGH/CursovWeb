/**
 * TELE-OPTICS — Full Application Script
 * Vanilla JS · No frameworks · No jQuery
 *
 * Разделы кода:
 *   STORAGE, TR        — константы хранилища и переводы (RU/EN)
 *   getLang/applyLang  — управление языком интерфейса
 *   getTheme/applyTheme — управление темой (светлая/тёмная)
 *   getA11y/applyA11y   — версия для слабовидящих
 *   loadDb/getAdminProducts — загрузка данных из JSON Server
 *   fmtPrice/stars     — форматирование цен и рейтинга
 *   addToCart/toggleFav/toggleCompare — корзина, избранное, сравнение
 *   productCard/renderHits/renderRecommended — рендер карточек товаров
 *   renderCategories/renderBanner — рендер категорий и баннеров
 *   makeCarousel        — карусель товаров
 *   initMobileMenu      — мобильное вложенное меню
 *   initModals/initSearch/initCity — модалки, поиск, выбор города
 *   initForms/initPhoneMask — формы обратной связи, маска телефона
 *   initAccordion/initFilter/initGallery — аккордеон, фильтры, галерея
 *   initHeroSlider      — hero-слайдер на главной/акциях
 *   initKategoriyaPage  — фильтрация на странице категории
 *   initLang/initA11y/initReset — инициализация языка, a11y, сброс
 *   updateAuthUI/buildUserMenu/logout — аутентификация и личный кабинет
 *   restoreSession/init — восстановление сессии и запуск
 */

(() => {
  'use strict';

  const API_BASE = 'http://localhost:3000';

  /* ═══════════════════════════════════════════
     Константы хранилища (localStorage keys)
     ═══════════════════════════════════════════ */
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
    const lang = store(STORAGE.lang) || 'ru';
    const labelKey = theme === 'dark' ? 'theme_light' : 'theme_dark';
    const label = TR && TR[lang] ? (TR[lang][labelKey] || (theme === 'dark' ? 'Светлая тема' : 'Тёмная тема')) : (theme === 'dark' ? 'Светлая тема' : 'Тёмная тема');
    document.querySelectorAll('.theme-toggle span').forEach(el => el.textContent = label);
    document.querySelectorAll('.theme-toggle').forEach(b => b.setAttribute('aria-pressed', theme === 'dark'));
  }
  /* ═══════════════════════════════════════════
     Управление темой (светлая / тёмная)
     ═══════════════════════════════════════════ */
  function initTheme() {
    applyTheme(getTheme());
    document.querySelectorAll('.theme-toggle').forEach(b => b.addEventListener('click', () => applyTheme(getTheme() === 'dark' ? 'light' : 'dark')));
  }

  /* --- translations --- */
  /* ═══════════════════════════════════════════
     Переводы интерфейса (RU / EN)
     Все ключи для навигации, кнопок, модалок
     ═══════════════════════════════════════════ */
  const TR = {
    ru:{
      // Navigation
      nav_about:'О компании', nav_delivery:'Доставка', nav_payment:'Оплата',
      nav_promos:'Акции', nav_sales:'Распродажа', nav_more:'Еще',
      nav_guarantee:'Гарантии', nav_blog:'Блог', nav_reviews:'Отзывы',
      nav_vacancies:'Вакансии', nav_contacts:'Контакты', nav_catalog:'Каталог',
      // Auth
      login_reg:'Вход / Регистрация', logout:'Выйти',
      // Action buttons / modals
      action_compare:'Сравнение товаров', action_fav:'Избранное', action_cart:'Корзина',
      modal_cart:'Корзина', modal_compare:'Сравнение', modal_fav:'Избранное',
      modal_login:'Авторизация', modal_reg:'Регистрация',
      modal_callback:'Заказать звонок', modal_request:'Оставить заявку', modal_city:'Укажите свой город',
      viewed_title:'Вы просмотрели эти товары', continue_shop:'Продолжить покупки →',
      // Buttons
      btn_login:'Войти', btn_register:'Зарегистрироваться', btn_buy:'Купить',
      btn_cart:'В корзину', btn_fav:'В избранное', btn_compare:'Сравнить',
      btn_subscribe:'Подписаться', btn_callback:'Оставить заявку',
      btn_clear_cart:'Очистить все', btn_checkout:'Купить', btn_continue:'Продолжить покупки',
      btn_continue2:'Продолжить выбор →', btn_reset:'Сбросить настройки',
      btn_close:'Закрыть', btn_search:'Найти', btn_all_brands:'Все Бренды',
      btn_all_cities:'Все города', btn_login_soc:'Войти через соцсети',
      btn_reg_soc:'Зарегистрироваться через соцсети', btn_vk:'ВКонтакте',
      btn_forgot:'Забыли пароль?',
      // Cart
      cart_total:'Итого:', cart_empty:'Корзина пуста',
      fav_empty:'Список избранного пуст', compare_empty:'Нет товаров для сравнения',
      remember_me:'Запомнить меня', no_account:'Зарегистрируйтесь',
      // Sections
      popular_categories:'Популярные категории', go_to_catalog:'Перейти в каталог',
      hits:'Хиты продаж', view_catalog:'Смотреть весь каталог',
      brands:'Бренды', all_brands:'Все Бренды',
      recommended:'Рекомендуемые', new:'Новинки',
      most_viewed:'Самые просматриваемые', discounts:'Скидки',
      our_goods:'Наши товары', show_all:'Показать все →', more_link:'Подробнее →',
      in_stock:'В наличии', out_of_stock:'Нет в наличии',
      items:'товаров', reviews:'отзывов', reviews_word:'отзывов',
      to_cart:'В корзину', to_fav:'В избранное', compare_btn:'Сравнить',
      consultation_title:'Вам нужна консультация?', consultation_desc:'Задайте их по телефону или оставьте свои координаты и наш менеджер перезвонит вам.',
      form_name:'Ваше имя', form_phone:'Ваш телефон', form_email:'Ваш email', form_question:'Ваш вопрос',
      btn_submit:'Оставить заявку', form_agree:'Нажимая «Оставить заявку», я соглашаюсь с обработкой персональных данных',
      about_title:'О компании TeleOptics', cat_binokli:'Бинокли', cat_teleskopy:'Телескопы',
      cat_dalnomery:'Дальномеры', cat_zritelnye:'Зрительные трубы', cat_pritsely:'Прицелы',
      cat_lupy:'Лупы', cat_monokulary:'Монокуляры', cat_mikroskopy:'Микроскопы',
      cat_teplovizory:'Тепловизоры', cat_kamery:'Цифровые камеры', cat_nightview:'Приборы ночного видения',
      subcat_army:'Армейско-полевой', subcat_astro:'Астрономический', subcat_kids:'Для детей',
      subcat_hunting:'Для охоты и рыбалки', subcat_city:'Для города', subcat_pro:'Для профессионалов',
      subcat_amateur:'Любительский',
      feat_delivery:'Быстрая доставка', feat_certified:'Весь товар сертифицирован',
      feat_consult:'Бесплатная консультация', feat_payment:'Удобная оплата',
      feat_lowprice:'Низкие цены', feat_warranty:'Гарантия на товар',
      feat_delivery_sub:'По всей России', feat_cert_sub:'Оригинальная продукция',
      feat_warranty_sub1:'3 года гарантии', feat_warranty_sub2:'На всю продукцию',
      feat_market_sub:'10 лет на рынке', feat_market_sub2:'Опыт и доверие',
      about_text:'Наша компания существует на рынке оптических приборов более 5 лет.',
      about_subtitle:'Наша компания ставит перед собой только самые реальные цели:',
      about_goal1:'сотрудничество с прямыми дистрибьюторами и производителями для получения исключительных условий;',
      about_goal2:'расширение возможностей доставки в любую точку Вашего Выбора;',
      about_goal3:'сотрудничество с ведущими производителями оптических приборов;',
      about_goal4:'бесплатные консультации по выбору предпочитаемого ассортимента;',
      about_goal5:'обеспечение безупречного качества постоянных поставщиков.',
      blog_relevant:'Актуально на сегодня', blog_comments:'Комментарии', city_search:'Поиск населённого пункта',
      // A11y
      a11y_title:'Версия для слабовидящих', a11y_fontsize:'Размер шрифта',
      a11y_scheme:'Цветовая схема', a11y_images:'Изображения',
      a11y_font:'Выбор шрифта', a11y_show:'Показать', a11y_hide:'Скрыть',
      // Footer
      footer_catalog:'Каталог', footer_info:'Полезная информация',
      footer_return:'Возврат', footer_makers:'Производители',
      footer_warranty:'Гарантия', footer_articles:'Статьи', footer_world:'МИР',
      footer_us:'О нас', footer_wholesale:'Оптовые продажи', footer_account:'Личный кабинет',
      footer_news:'Подписаться на новости', footer_price:'Скачать прайс-лист',
      footer_privacy:'Политика конфиденциальности', footer_terms:'Условия соглашения',
      footer_sitemap:'Карта сайта', footer_rating:'Рейтинг магазина',
      // Newsletter
      newsletter_title:'Магазин оптических приборов Tele-Optics.Ru',
      newsletter_sub:'Акции, скидки, распродажи ждут!',
      newsletter_consultation:'Вам нужна консультация?',
      // Theme / accessibility btn
      theme_dark:'Тёмная тема', theme_light:'Светлая тема', accessibility:'Для слабовидящих',
      // Admin
      admin_dashboard:'Дашборд', admin_products:'Товары', admin_users:'Пользователи',
      admin_orders:'Заказы', admin_logout:'Выйти', admin_on_site:'На сайт',
      admin_logged_as:'Вы вошли как:', admin_total_products:'Всего товаров',
      admin_in_catalog:'в каталоге', admin_total_users:'Пользователей',
      admin_total_orders:'Заказов', admin_revenue:'Оборот',
      admin_last_added:'Последние добавленные товары', admin_add_product:'Добавить товар',
      admin_search_placeholder:'Поиск товара...',
      // Settings widget
      swp_settings:'Настройки', swp_theme:'Тема',
      swp_theme_light:'Светлая', swp_theme_dark:'Тёмная',
      swp_lang_label:'Язык / Language',
      swp_a11y_label:'Доступность', swp_a11y_btn:'Версия для слабовидящих',
      footer_news_sub:'Подписаться на новости', footer_price_dl:'Скачать прайс-лист',
      settings_reset:'Настройки сброшены', max_compare:'Максимум 4 товара',
      phone_must_375:'Номер телефона должен начинаться с +375',
      fill_all_fields:'Заполните все поля', wrong_email_pass:'Неверный email или пароль',
      server_error:'Не удалось связаться с сервером данных',
      fill_required:'Заполните все обязательные поля', passwords_mismatch:'Пароли не совпадают',
      password_min8:'Пароль: минимум 8 символов', email_exists:'Пользователь с таким email уже существует',
      welcome:'Добро пожаловать',

    },
    en:{
      nav_about:'About us', nav_delivery:'Delivery', nav_payment:'Payment',
      nav_promos:'Promotions', nav_sales:'Sale', nav_more:'More',
      nav_guarantee:'Warranty', nav_blog:'Blog', nav_reviews:'Reviews',
      nav_vacancies:'Vacancies', nav_contacts:'Contacts', nav_catalog:'Catalog',
      login_reg:'Sign in / Register', logout:'Log out',
      action_compare:'Compare', action_fav:'Wishlist', action_cart:'Cart',
      modal_cart:'Cart', modal_compare:'Compare', modal_fav:'Wishlist',
      modal_login:'Sign in', modal_reg:'Register',
      modal_callback:'Request a call', modal_request:'Send request', modal_city:'Select your city',
      viewed_title:'Recently viewed', continue_shop:'Continue shopping →',
      btn_login:'Sign in', btn_register:'Create account', btn_buy:'Buy now',
      btn_cart:'Add to cart', btn_fav:'Wishlist', btn_compare:'Compare',
      btn_subscribe:'Subscribe', btn_callback:'Send request',
      btn_clear_cart:'Clear all', btn_checkout:'Checkout', btn_continue:'Continue shopping',
      btn_continue2:'Continue →', btn_reset:'Reset settings',
      btn_close:'Close', btn_search:'Search', btn_all_brands:'All Brands',
      btn_all_cities:'All cities', btn_login_soc:'Sign in with social',
      btn_reg_soc:'Register with social', btn_vk:'VKontakte', btn_forgot:'Forgot password?',
      cart_total:'Total:', cart_empty:'Your cart is empty',
      fav_empty:'Wishlist is empty', compare_empty:'No products to compare',
      remember_me:'Remember me', no_account:'Register',
      popular_categories:'Popular categories', go_to_catalog:'Go to catalog',
      hits:'Best sellers', view_catalog:'View all',
      brands:'Brands', all_brands:'All Brands',
      recommended:'Recommended', new:'New arrivals',
      most_viewed:'Most viewed', discounts:'Discounts',
      our_goods:'Our products', show_all:'Show all →', more_link:'Learn more →',
      in_stock:'In stock', out_of_stock:'Out of stock',
      items:'items', reviews:'reviews', reviews_word:'reviews',
      to_cart:'Add to cart', to_fav:'To favorites', compare_btn:'Compare',
      consultation_title:'Need a consultation?', consultation_desc:'Call us or leave your details and our manager will call you back.',
      form_name:'Your name', form_phone:'Your phone', form_email:'Your email', form_question:'Your question',
      btn_submit:'Send request', form_agree:'By clicking "Send request", I agree to the processing of personal data',
      about_title:'About TeleOptics', cat_binokli:'Binoculars', cat_teleskopy:'Telescopes',
      cat_dalnomery:'Rangefinders', cat_zritelnye:'Spotting scopes', cat_pritsely:'Scopes',
      cat_lupy:'Magnifiers', cat_monokulary:'Monoculars', cat_mikroskopy:'Microscopes',
      cat_teplovizory:'Thermal imagers', cat_kamery:'Digital cameras', cat_nightview:'Night vision',
      subcat_army:'Field/Tactical', subcat_astro:'Astronomical', subcat_kids:'Kids',
      subcat_hunting:'Hunting & fishing', subcat_city:'Urban', subcat_pro:'Professional',
      subcat_amateur:'Amateur',
      feat_delivery:'Fast delivery', feat_certified:'All products certified',
      feat_consult:'Free consultation', feat_payment:'Easy payment',
      feat_lowprice:'Low prices', feat_warranty:'Warranty on products',
      feat_delivery_sub:'Across Russia', feat_cert_sub:'Original products',
      feat_warranty_sub1:'3 year warranty', feat_warranty_sub2:'On all products',
      feat_market_sub:'10 years on market', feat_market_sub2:'Experience and trust',
      about_text:'Our company has been in the optical instruments market for over 5 years.',
      about_subtitle:'Our company sets only the most realistic goals:',
      about_goal1:'cooperation with direct distributors and manufacturers for exclusive terms;',
      about_goal2:'expanding delivery options to any location of your choice;',
      about_goal3:'cooperation with leading manufacturers of optical instruments;',
      about_goal4:'free consultations on choosing the desired product range;',
      about_goal5:'ensuring impeccable quality from our suppliers.',
      blog_relevant:'Trending now', blog_comments:'Comments', city_search:'Search city',
      a11y_title:'Accessibility', a11y_fontsize:'Font size',
      a11y_scheme:'Color scheme', a11y_images:'Images',
      a11y_font:'Font family', a11y_show:'Show', a11y_hide:'Hide',
      footer_catalog:'Catalog', footer_info:'Useful info',
      footer_return:'Returns', footer_makers:'Brands',
      footer_warranty:'Warranty', footer_articles:'Articles', footer_world:'WORLD',
      footer_us:'About us', footer_wholesale:'Wholesale', footer_account:'My account',
      footer_news:'Subscribe to news', footer_price:'Download price list',
      footer_privacy:'Privacy policy', footer_terms:'Terms of use',
      footer_sitemap:'Sitemap', footer_rating:'Store rating',
      newsletter_title:'Tele-Optics.Ru — Optical instruments store',
      newsletter_sub:'Deals, discounts and sales await!',
      newsletter_consultation:'Need a consultation?',
      theme_dark:'Dark theme', theme_light:'Light theme', accessibility:'Accessibility',
      admin_dashboard:'Dashboard', admin_products:'Products', admin_users:'Users',
      admin_orders:'Orders', admin_logout:'Log out', admin_on_site:'To store',
      admin_logged_as:'Logged in as:', admin_total_products:'Total products',
      admin_in_catalog:'in catalog', admin_total_users:'Users',
      admin_total_orders:'Orders', admin_revenue:'Revenue',
      admin_last_added:'Recently added products', admin_add_product:'Add product',
      admin_search_placeholder:'Search product...',
      // Settings widget
      swp_settings:'Settings', swp_theme:'Theme',
      swp_theme_light:'Light', swp_theme_dark:'Dark',
      swp_lang_label:'Language / Язык',
      swp_a11y_label:'Accessibility', swp_a11y_btn:'Accessibility mode',
      footer_news_sub:'Subscribe to news', footer_price_dl:'Download price list',
      settings_reset:'Settings reset', max_compare:'Maximum 4 items',
      phone_must_375:'Phone number must start with +375',
      fill_all_fields:'Fill in all fields', wrong_email_pass:'Wrong email or password',
      server_error:'Failed to connect to server',
      fill_required:'Fill in all required fields', passwords_mismatch:'Passwords do not match',
      password_min8:'Password: minimum 8 characters', email_exists:'User with this email already exists',
      welcome:'Welcome',

    },
  };
  /* ═══════════════════════════════════════════
     Управление языком интерфейса
     ═══════════════════════════════════════════ */
  function getLang() { return store(STORAGE.lang) || 'ru'; }
  function t(key) { return (TR[getLang()] || TR.ru)[key] || key; }
  function applyLang(lang) {
    store(STORAGE.lang, lang);
    document.documentElement.lang = lang;
    // Update lang-toggle button label
    document.querySelectorAll('.lang-toggle span').forEach(el => el.textContent = lang === 'ru' ? 'EN' : 'RU');
    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key === 'theme_dark' || key === 'theme_light') return;
      const v = (TR[lang] || TR.ru)[key] || key;
      if (el.tagName === 'INPUT') el.placeholder = v;
      else if (el.children.length) {
        // Preserve child elements (like <span> with numbers)
        const firstText = el.childNodes[0];
        if (firstText && firstText.nodeType === 3) firstText.textContent = v + ' ';
        else { el.prepend(document.createTextNode(v + ' ')); }
      } else el.textContent = v;
    });
    // Re-sync theme button label after lang change
    const theme = getTheme();
    const themeKey = theme === 'dark' ? 'theme_light' : 'theme_dark';
    document.querySelectorAll('.theme-toggle span').forEach(el => el.textContent = (TR[lang] || TR.ru)[themeKey] || themeKey);
  }
  function initLang() {
    applyLang(getLang());
    document.querySelectorAll('.lang-toggle').forEach(b => b.addEventListener('click', () => {
      applyLang(getLang() === 'ru' ? 'en' : 'ru');
      if (window._db) { renderCategories(window._db.categories); renderHits(window._db.products); renderRecommended(window._db.products); renderBanner(window._db.banners, window._db.products); }
    }));
  }

  /* --- a11y --- */
  /* ═══════════════════════════════════════════
     Версия для слабовидящих
     ═══════════════════════════════════════════ */
  function getA11y() { return store(STORAGE.a11y) || { on:false, fontSize:'normal', scheme:'default', images:'show', fontFamily:'default' }; }
  function applyA11y(state) {
    store(STORAGE.a11y, state);
    const fsSizes = { small:'13px', normal:'15px', large:'18px' };
    const fsVal = fsSizes[state.fontSize] || '15px';
    // Применяем только к контентной зоне, НЕ к html/root — иначе ломается header/footer/sticky-bar
    document.documentElement.style.fontSize = '';   // сбрасываем root
    document.body.style.setProperty('--a11y-font-size', fsVal);
    document.querySelectorAll('.main-content, .section, .catalog-main, .product-detail, .page-content, .container > *:not(.header-top):not(.sticky-bar)')
      .forEach(el => { if (!el.closest('header') && !el.closest('footer') && !el.closest('.sticky-bar')) el.style.fontSize = fsVal; });
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
    const fonts = { default:"'PT Root UI','Inter','Arial',sans-serif", arial:'Arial,sans-serif', times:"'Times New Roman',serif", verdana:'Verdana,sans-serif' };
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
      /* Close settings widget panel if open */
      const swPanel = document.getElementById('settings-widget-panel');
      const swTrigger = document.getElementById('settings-widget-trigger');
      if (swPanel && swPanel.classList.contains('open')) {
        swPanel.classList.remove('open');
        swTrigger?.classList.remove('open');
        swTrigger?.setAttribute('aria-expanded', 'false');
        swPanel.setAttribute('aria-hidden', 'true');
      }
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
      showToast(t('settings_reset'),'success');
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
  /* ═══════════════════════════════════════════
     Загрузка данных из JSON Server
     ═══════════════════════════════════════════ */
  async function loadDb() {
    let categories, products, brands, banners;
    try {
      ([categories, products, brands, banners] = await Promise.all([
        fetchJson(`${API_BASE}/categories`),
        fetchJson(`${API_BASE}/products`),
        fetchJson(`${API_BASE}/brands`),
        fetchJson(`${API_BASE}/banners`),
      ]));
    } catch {
      const db = await fetchJson('data/db.json');
      categories = db.categories || [];
      products   = db.products   || [];
      brands     = db.brands     || [];
      banners    = db.banners    || [];
    }
    // Применить правки администратора из localStorage
    const localProds = getAdminProducts();
    if (localProds) products = localProds;
    return { categories, products, brands, banners };
  }

  /** Вернуть список товаров с учётом правок администратора */
  function getAdminProducts() {
    try {
      const raw = localStorage.getItem('teleoptics.admin_products');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  /* --- format --- */
  /* ═══════════════════════════════════════════
     Утилиты: форматирование цен, рейтинга
     ═══════════════════════════════════════════ */
  function fmtPrice(n) { return new Intl.NumberFormat('ru-RU').format(n)+' ₽'; }
  function stars(r,max=5) { let h=''; for(let i=1;i<=max;i++) h+=`<span style="color:${i<=Math.round(r)?'#ffd600':'#d0d6dd'}">★</span>`; return h; }

  /* --- cart / favs / compare / viewed --- */
  const getCart=()=>store(STORAGE.cart)||[];
  const getFavs=()=>store(STORAGE.favorites)||[];
  const getCompare=()=>store(STORAGE.compare)||[];
  const getViewed=()=>store(STORAGE.viewed)||[];

  /* ═══════════════════════════════════════════
     Корзина, избранное, сравнение, просмотренные
     ═══════════════════════════════════════════ */
  function addToCart(id) {
    const c=getCart(); const it=c.find(i=>i.productId===id);
    const qtyInput = document.querySelector('.quantity-wrap .qty-input');
    const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value) || 1) : 1;
    if(it) it.quantity=(it.quantity||1)+qty; else c.push({productId:id,quantity:qty});
    store(STORAGE.cart,c); updateBadges(); showToast(t('to_cart'),'success');
  }
  window.addToCart = addToCart;
  function toggleFav(id) {
    const f=getFavs(); const i=f.indexOf(id);
    if(i===-1){f.push(id);showToast(t('to_fav'),'success');}else{f.splice(i,1);}
    store(STORAGE.favorites,f); updateBadges(); return i===-1;
  }
  function toggleCompare(id) {
    const l=getCompare(); const i=l.indexOf(id);
    if(i===-1){if(l.length>=4){showToast(t('max_compare'),'error');return false;}l.push(id);showToast(t('compare_btn'),'success');}else{l.splice(i,1);}
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
    // Toggle has-items class on header action buttons
    document.querySelectorAll('.header-action-btn[data-open]').forEach(btn => {
      const target = btn.getAttribute('data-open');
      let count = 0;
      if (target === 'cart') count = cc;
      else if (target === 'favorites') count = fc;
      else if (target === 'compare') count = cp;
      btn.classList.toggle('has-items', count > 0);
    });
  }
  window.updateBadges = updateBadges;

  /* --- product card --- */
  /* ═══════════════════════════════════════════
     Рендер карточек товаров, каруселей
     ═══════════════════════════════════════════ */
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
      <img src="${p.image||'assets/images/BigBanner1.png'}" alt="${name}" loading="lazy" width="200" height="160">
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
        <img class="ui-icon ui-icon-sm" data-icon="cart" alt="" aria-hidden="true">
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

  /* ═══════════════════════════════════════════
     Рендер категорий, баннеров
     ═══════════════════════════════════════════ */
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
    10: 'assets/icons/digitalcamera.svg',};
  function renderCategories(cats) {
    const g=document.getElementById('categories-grid'); if(!g) return;
    const lang=getLang();
    g.innerHTML=cats.map((c,i)=>{
      const name=lang==='en'?(c.nameEn||c.name):c.name;
      const icon=CAT_ICONS[c.id]||'assets/icons/category-binokli.svg';
      return `<a href="kategoriya.html?cat=${c.slug}" class="category-card" aria-label="${name}">
  <div class="category-icon">
    <img src="${icon}" alt="" aria-hidden="true" width="48" height="48" loading="lazy">
  </div>
  <div class="category-name">${name}</div>
  <div class="category-count">${c.count?`${c.count} ${t('items')}`:''}</div>
</a>`;
    }).join('');
  }

  /* ═══════════════════════════════════════════
     Карусель товаров (хиты, рекомендуемые)
     ═══════════════════════════════════════════ */
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
  

  /* ═══════════════════════════════════════════
     Мобильное вложенное меню (index, catalog)
     ═══════════════════════════════════════════ */
  /* --- mobile menu --- */
  function initMobileMenu() {
    const menu=document.getElementById('mobile-menu'); const burger=document.querySelector('.burger-btn');
    if(!menu||!burger) return;
    const viewMain=menu.querySelector('.mobile-menu-view-main');
    const viewCat=menu.querySelector('.mobile-menu-view-catalog');
    const open=()=>{menu.classList.add('open');menu.setAttribute('aria-hidden','false');burger.classList.add('open');burger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';resetMenuView();};
    const shut=()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true');burger.classList.remove('open');burger.setAttribute('aria-expanded','false');document.body.style.overflow='';resetMenuView();};
    const resetMenuView=()=>{if(viewMain)viewMain.hidden=false;if(viewCat)viewCat.hidden=true;};
    burger.addEventListener('click',()=>menu.classList.contains('open')?shut():open());
    document.querySelector('.mobile-menu-close')?.addEventListener('click',shut);
    menu.addEventListener('click',e=>{if(e.target===menu)shut();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')shut();});
    /* Catalog submenu toggle */
    document.getElementById('mobile-catalog-btn')?.addEventListener('click',()=>{if(viewMain)viewMain.hidden=true;if(viewCat)viewCat.hidden=false;});
    document.getElementById('mobile-catalog-back')?.addEventListener('click',()=>{resetMenuView();});
  }

  /* ═══════════════════════════════════════════
     Модальные окна: вход, регистрация, город
     ═══════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════
     Выпадающее меню навигации (header)
     ═══════════════════════════════════════════ */
  /* --- nav dropdown --- */
  function initNavDropdowns(){
    document.querySelectorAll('.nav-item').forEach(item=>{
      const dd=item.querySelector('.nav-dropdown');if(!dd)return;
      item.addEventListener('mouseenter',()=>dd.classList.add('open'));
      item.addEventListener('mouseleave',()=>dd.classList.remove('open'));
    });
  }

  /* ═══════════════════════════════════════════
     Маска ввода телефона (+375 XX) XXX-XX-XX
     ═══════════════════════════════════════════ */
  /* --- phone mask --- */
  function initPhoneMask(){
    document.querySelectorAll('.phone-wrap input[name="phone"]').forEach(inp=>{
      inp.addEventListener('input',()=>{
        let v=inp.value.replace(/\D/g,'');
        if(v.startsWith('375'))v=v.substring(3);
        v=v.substring(0,9);
        let formatted='';
        if(v.length>0) formatted='('+v.substring(0,2);
        if(v.length>=2) formatted+=') '+v.substring(2,5);
        if(v.length>=5) formatted+='-'+v.substring(5,7);
        if(v.length>=7) formatted+='-'+v.substring(7);
        inp.value=formatted;
      });
      inp.addEventListener('keydown',e=>{
        if(e.key==='Backspace' && inp.value.length<=1){e.preventDefault();inp.value='';}
      });
    });
  }

  /* ═══════════════════════════════════════════
     Поиск по товарам (строка в шапке)
     ═══════════════════════════════════════════ */
  /* --- search --- */
  function initSearch(){
    const inp=document.getElementById('search-input'); if(!inp) return;
    const go=()=>{const q=inp.value.trim();if(q)window.location.href=`catalog.html?search=${encodeURIComponent(q)}`;};
    document.querySelector('.search-btn')?.addEventListener('click',go);
    inp.addEventListener('keydown',e=>{if(e.key==='Enter')go();});
  }

  /* ═══════════════════════════════════════════
     Выбор города (модальное окно)
     ═══════════════════════════════════════════ */
  /* --- city --- */
  function initCity(){
    const saved=store(STORAGE.city)||'Москва';
    document.querySelectorAll('#city-label').forEach(el=>el.textContent=saved);
    document.querySelector('.city-selector')?.addEventListener('click',()=>openModal('city-modal'));
    document.addEventListener('click',e=>{
      const opt=e.target.closest('.city-option');if(!opt)return;e.preventDefault();
      const city=opt.dataset.city; store(STORAGE.city,city);
      document.querySelectorAll('#city-label').forEach(el=>el.textContent=city);
      closeModal(document.getElementById('city-modal')); showToast(getLang()==='en'?'City: '+city:'\u0413\u043e\u0440\u043e\u0434: '+city);
    });
    document.getElementById('city-search')?.addEventListener('input',function(){
      const q=this.value.trim().toLowerCase();
      document.querySelectorAll('.city-option').forEach(o=>{o.style.display=o.textContent.toLowerCase().includes(q)?'':'none';});
    });
  }

  /* ═══════════════════════════════════════════
     Формы: консультация, рассылка, авторизация
     ═══════════════════════════════════════════ */
  /* --- forms --- */
  function initForms(){
    const subForm=(id,msg,close_id)=>{
      document.getElementById(id)?.addEventListener('submit',async e=>{
        e.preventDefault();
        const phoneInput = e.target.querySelector('[name="phone"]');
        if (phoneInput && phoneInput.value.trim()) {
          const pc = phoneInput.value.replace(/\D/g, '');
          if (pc.length !== 9) { showToast(t('phone_must_375'), 'error'); return; }
        }
        const btn=e.target.querySelector('[type=submit]');
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

    document.getElementById('login-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value?.trim();
      const pass  = document.getElementById('login-password')?.value;
      if (!email || !pass) { showToast(t('fill_all_fields'), 'error'); return; }
      try {
        const db = await fetchJson('data/db.json');
        const u  = (db.users || []).find(u => u.email === email && u.password === pass);
        if (u) {
          closeModal(document.getElementById('login-modal'));
          if (u.role === 'admin') {
            showAdminRoleModal(u);
          } else {
            finishLogin({ id: u.id, name: u.name, role: u.role, email: u.email, mode: 'user' });
          }
        } else {
          showToast(t('wrong_email_pass'), 'error');
        }
      } catch (err) {
        console.error('Login error:', err);
        showToast(t('server_error'), 'error');
      }
    });

    document.getElementById('register-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const name   = e.target.querySelector('[name="name"]')?.value?.trim();
      const phone  = e.target.querySelector('[name="phone"]')?.value?.trim();
      const email  = e.target.querySelector('[name="email"]')?.value?.trim();
      const p      = document.getElementById('reg-password')?.value;
      const c      = document.getElementById('reg-confirm')?.value;
      if (!name || !phone || !email) { showToast(t('fill_required'), 'error'); return; }
      const phoneClean = phone.replace(/\D/g, '');
      if (phoneClean.length !== 9) { showToast(t('phone_must_375'), 'error'); return; }
      const fullPhone = '+375' + phoneClean;
      if (p !== c)        { showToast(t('passwords_mismatch'), 'error'); return; }
      if ((p || '').length < 8) { showToast(t('password_min8'), 'error'); return; }
      const localUsers = JSON.parse(localStorage.getItem('teleoptics.reg_users') || '[]');
      if (localUsers.some(u => u.email === email)) {
        showToast(t('email_exists'), 'error'); return;
      }
      if (localUsers.some(u => u.phone === fullPhone)) {
        showToast('\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u0441 \u0442\u0430\u043a\u0438\u043c \u043d\u043e\u043c\u0435\u0440\u043e\u043c \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442', 'error'); return;
      }
      // Also check db.json users
      try {
        const dbUsers = window._db?.users || [];
        if (dbUsers.some(u => u.email === email)) {
          showToast(t('email_exists'), 'error'); return;
        }
        if (dbUsers.some(u => u.phone === fullPhone)) {
          showToast('\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c \u0441 \u0442\u0430\u043a\u0438\u043c \u043d\u043e\u043c\u0435\u0440\u043e\u043c \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442', 'error'); return;
        }
      } catch(e) {}
      if (localUsers.some(u => u.phone === fullPhone)) {
        showToast('Пользователь с таким номером уже существует', 'error'); return;
      }
      const allUsers = [...(window._db?.users || []), ...localUsers];
      const maxId = allUsers.reduce((max, u) => Math.max(max, u.id || 0), 0);
      const newUser = { id: maxId + 1, name, phone: fullPhone, email, role: 'user', mode: 'user' };
      localUsers.push(newUser);
      localStorage.setItem('teleoptics.reg_users', JSON.stringify(localUsers));
      // Save to db.json via json-server
      try {
        const resp = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });
        if (resp.ok) {
          const saved = await resp.json();
          newUser.id = saved.id;
          if (window._db) window._db.users.push(saved);
        }
      } catch(e) { console.warn('Failed to save to db.json:', e); }
      closeModal(document.getElementById('register-modal'));
      finishLogin(newUser);
    });

    document.querySelectorAll('.password-toggle').forEach(btn => btn.addEventListener('click', () => {
      const inp = btn.previousElementSibling; if (!inp) return;
      inp.type = inp.type === 'password' ? 'text' : 'password';
    }));
  }

  /* ── Завершить логин (сохранить + обновить UI) ── */
  function finishLogin(userData) {
    store(STORAGE.user, userData);
    updateAuthUI(userData);
    showToast(t('welcome') + ', ' + userData.name.split(' ')[0] + '!', 'success');
    if (userData.mode === 'admin') {
      setTimeout(() => { window.location.href = 'admin.html'; }, 800);
    }
  }

  /* ── Модал выбора роли для администратора ── */
  function showAdminRoleModal(rawUser) {
    let modal = document.getElementById('admin-role-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'admin-role-modal';
      modal.className = 'modal-overlay';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Выбор режима входа');
      modal.innerHTML = `
        <div class="modal" style="max-width:440px;text-align:center">
          <h2 class="modal-title" style="font-size:20px">Выберите режим входа</h2>
          <p class="modal-subtitle" id="admin-role-greeting"></p>
          <div style="display:flex;gap:14px;margin-top:28px">
            <button id="admin-role-admin-btn" class="btn btn-primary" style="flex:1;padding:18px 12px;flex-direction:column;display:flex;align-items:center;gap:6px;line-height:1.3">
              <span style="font-size:28px">⚙️</span>
              <strong>Администратор</strong>
              <small style="font-weight:400;opacity:.85">Управление товарами и каталогом</small>
            </button>
            <button id="admin-role-user-btn" class="btn btn-outline" style="flex:1;padding:18px 12px;flex-direction:column;display:flex;align-items:center;gap:6px;line-height:1.3">
              <span style="font-size:28px">🛒</span>
              <strong>Покупатель</strong>
              <small style="font-weight:400;opacity:.85">Просмотр и покупка товаров</small>
            </button>
          </div>
        </div>`;
      document.body.appendChild(modal);
    }
    document.getElementById('admin-role-greeting').textContent =
      rawUser.name + ', вы входите с правами администратора.';
    modal.removeAttribute('hidden');
    modal.classList.add('open');

    document.getElementById('admin-role-admin-btn').onclick = () => {
      modal.classList.remove('open');
      modal.setAttribute('hidden', '');
      finishLogin({ id: rawUser.id, name: rawUser.name, role: 'admin', email: rawUser.email, mode: 'admin' });
    };
    document.getElementById('admin-role-user-btn').onclick = () => {
      modal.classList.remove('open');
      modal.setAttribute('hidden', '');
      finishLogin({ id: rawUser.id, name: rawUser.name, role: 'admin', email: rawUser.email, mode: 'user' });
    };
    modal.addEventListener('click', e => {
      if (e.target === modal) { modal.classList.remove('open'); modal.setAttribute('hidden', ''); }
    }, { once: true });
  }

  /* ── Выход ── */
  function logout() {
    localStorage.removeItem(STORAGE.user);
    // Перезагрузить страницу на главную или текущую
    if (window.location.pathname.includes('admin.html')) {
      window.location.href = 'index.html';
    } else {
      window.location.reload();
    }
  }

  /* ── Обновить UI (имя + выпадающее меню) ── */
  /* ═══════════════════════════════════════════
     Обновление UI: шапка, аватар, личный кабинет
     ═══════════════════════════════════════════ */
  function updateAuthUI(userData) {
    const short   = userData.name.split(' ')[0];
    const isAdmin = userData.role === 'admin' && userData.mode === 'admin';

    document.querySelectorAll('.header-top-auth').forEach(el => {
      // Уже обёрнут?
      if (el.parentElement.classList.contains('user-dd-wrap')) {
        el.textContent = short + (isAdmin ? ' ⚙' : '');
        if (isAdmin) el.style.color = '#ffd600'; else el.style.color = '';
        // Пересобрать меню
        const oldMenu = el.parentElement.querySelector('.user-dd-menu');
        if (oldMenu) oldMenu.remove();
        el.parentElement.appendChild(buildUserMenu(isAdmin));
        return;
      }
      // Первый раз — обернуть
      el.textContent = short + (isAdmin ? ' ⚙' : '');
      if (isAdmin) el.style.color = '#ffd600'; else el.style.color = '';
      el.removeAttribute('data-open');
      el.href = '#';
      el.setAttribute('aria-haspopup', 'true');
      el.setAttribute('aria-expanded', 'false');

      const wrap = document.createElement('div');
      wrap.className = 'user-dd-wrap';
      el.replaceWith(wrap);
      wrap.appendChild(el);
      wrap.appendChild(buildUserMenu(isAdmin));

      el.addEventListener('click', ev => {
        ev.preventDefault();
        const menu = wrap.querySelector('.user-dd-menu');
        const open = !menu.classList.contains('open');
        // Закрыть все открытые
        document.querySelectorAll('.user-dd-menu.open').forEach(m => m.classList.remove('open'));
        menu.classList.toggle('open', open);
        el.setAttribute('aria-expanded', open);
      });
      document.addEventListener('click', ev => {
        if (!wrap.contains(ev.target)) {
          wrap.querySelector('.user-dd-menu')?.classList.remove('open');
          el.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Кнопка в header-main
    document.querySelectorAll('#auth-label').forEach(el => { el.textContent = short; });
    document.querySelectorAll('[data-auth-name]').forEach(el => { el.textContent = short; });
  }

  /* ═══════════════════════════════════════════
     Меню пользователя (dropdown в шапке)
     ═══════════════════════════════════════════ */
  function buildUserMenu(isAdmin) {
    const menu = document.createElement('div');
    menu.className = 'user-dd-menu';
    menu.innerHTML = `
      ${isAdmin
        ? `<a class="user-dd-item" href="admin.html"><span>⚙</span> Панель администратора</a>
           <div class="user-dd-divider"></div>`
        : ''}
      <a class="user-dd-item" href="#" id="profile-link"><span>👤</span> Личный кабинет</a>
      <a class="user-dd-item" href="cart.html"><span>🛒</span> Мои заказы</a>
      <div class="user-dd-divider"></div>
      <button class="user-dd-item user-dd-logout" type="button"><span>🚪</span> Выйти</button>`;
    menu.querySelector('.user-dd-logout')?.addEventListener('click', logout);
    menu.querySelector('#profile-link')?.addEventListener('click', e => {
      e.preventDefault();
      openModal('profile-modal');
      loadProfileData();
    });
    return menu;
  }

  function loadProfileData() {
    const u = store(STORAGE.user);
    if (!u) return;
    const initials = (u.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl) avatarEl.textContent = initials;
    const nameDisp = document.getElementById('profile-name-display');
    if (nameDisp) nameDisp.textContent = u.name || '—';
    const roleDisp = document.getElementById('profile-role-display');
    if (roleDisp) roleDisp.textContent = (u.role === 'admin' && u.mode === 'admin') ? 'Администратор' : 'Покупатель';
    document.getElementById('profile-name').value = u.name || '';
    document.getElementById('profile-phone').value = u.phone || '';
    document.getElementById('profile-email').value = u.email || '';
    document.getElementById('profile-name').readOnly = true;
    document.getElementById('profile-phone').readOnly = true;
    document.getElementById('profile-email').readOnly = true;
    document.getElementById('profile-edit-btn').style.display = '';
    document.getElementById('profile-save-btn').style.display = 'none';
    document.getElementById('profile-cancel-btn').style.display = 'none';
    document.getElementById('profile-admin-btn').style.display = (u.role === 'admin' && u.mode === 'admin') ? '' : 'none';
  }

  document.getElementById('profile-edit-btn')?.addEventListener('click', () => {
    document.getElementById('profile-name').readOnly = false;
    document.getElementById('profile-phone').readOnly = false;
    document.getElementById('profile-email').readOnly = false;
    document.getElementById('profile-edit-btn').style.display = 'none';
    document.getElementById('profile-save-btn').style.display = '';
    document.getElementById('profile-cancel-btn').style.display = '';
  });

  document.getElementById('profile-cancel-btn')?.addEventListener('click', loadProfileData);

  document.getElementById('profile-save-btn')?.addEventListener('click', () => {
    const u = store(STORAGE.user);
    if (!u) return;
    u.name = document.getElementById('profile-name').value.trim();
    u.phone = document.getElementById('profile-phone').value.trim();
    u.email = document.getElementById('profile-email').value.trim();
    store(STORAGE.user, u);
    updateAuthUI(u);
    showToast(t('settings_reset'), 'success');
    loadProfileData();
  });

  document.getElementById('profile-logout-btn')?.addEventListener('click', logout);

  /* ═══════════════════════════════════════════
     Аккордеон (вакансии, гарантии, оплата)
     ═══════════════════════════════════════════ */
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
  /* ═══════════════════════════════════════════
     Фильтрация и сортировка (kategoriya.html)
     ═══════════════════════════════════════════ */
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
  /* ═══════════════════════════════════════════
     Галерея изображений (product.html)
     ═══════════════════════════════════════════ */
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
  /* ═══════════════════════════════════════════
     Пагинация (blog, kategoriya, sales)
     ═══════════════════════════════════════════ */
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

  /* ── Восстановить сессию при загрузке страницы ── */
  /* ═══════════════════════════════════════════
     Восстановление сессии при загрузке
     ═══════════════════════════════════════════ */
  function restoreSession() {
    const u = store(STORAGE.user);
    if (!u) return;
    updateAuthUI(u);
  }

  /* ═══════════════════════════════════════════
     Инициализация всего приложения
     ═══════════════════════════════════════════ */
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
    initPhoneMask();
    initSearch();
    initCity();
    initForms();
    initAccordion();
    initFilter();
    initGallery();
    initQty();
    bindProductActions();
    initPagination();
    restoreSession();

    // Track viewed products on card click
    document.addEventListener('click', e => {
      const link = e.target.closest('a.product-image-wrap, a.product-name');
      if (!link) return;
      const card = link.closest('[data-product-id]');
      if (card) addViewed(Number(card.dataset.productId));
    });

    try {
      const db = await loadDb(); window._db = db;
      renderCategories(db.categories);
      renderBrands(db.brands);
      renderBanner(db.banners, db.products);
      renderHits(db.products);
      renderRecommended(db.products);
      initKategoriyaPage(db);
      applyIcons();
    } catch(err) { console.warn('DB load error:', err); }
  }

  /* =============================================
     KATEGORIYA PAGE — фильтрация по категории
     ============================================= */
  function initKategoriyaPage(db) {
    const grid = document.getElementById('kategoriya-grid');
    if (!grid) return; // не страница категории

    const params      = new URLSearchParams(window.location.search);
    const catSlug     = params.get('cat') || 'binokli';
    const categories  = db.categories || [];
    const allProducts = db.products   || [];

    // Найти категорию по slug
    const cat = categories.find(c => c.slug === catSlug) || categories[0];
    if (!cat) { grid.innerHTML = '<div class="kategoriya-empty">Категория не найдена</div>'; return; }

    // Обновить <title>
    document.title = cat.name + ' — TELE-OPTICS';

    // Обновить «хлебные крошки»
    const crumbCurrent = document.querySelector('.breadcrumbs .current');
    if (crumbCurrent) crumbCurrent.textContent = cat.name;

    // Подсветить активный пункт навигации
    document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(a => {
      const href = a.getAttribute('href') || '';
      const isActive = href.includes('cat=' + catSlug);
      a.classList.toggle('active', isActive);
      if (isActive) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    // Продукты данной категории
    const catProducts = allProducts.filter(p => p.categoryId === cat.id);

    // --- Состояние ---
    let sortVal      = 'popular';
    let perPage      = 24;
    let currentPage  = 1;
    let priceMin     = 0;
    let priceMax     = Infinity;
    let checkedBrands = new Set();

    // Актуальные цены для слайдера
    const prices  = catProducts.map(p => p.price || 0);
    const maxPriceAll = prices.length ? Math.max(...prices) : 19500;

    // Настроить ползунки цен
    const minSlider = document.getElementById('price-min');
    const maxSlider = document.getElementById('price-max');
    if (minSlider && maxSlider) {
      minSlider.max   = maxPriceAll;
      maxSlider.max   = maxPriceAll;
      maxSlider.value = maxPriceAll;
      const priceInputs = document.querySelectorAll('.price-input');
      if (priceInputs[0]) priceInputs[0].value = 0;
      if (priceInputs[1]) priceInputs[1].value = maxPriceAll;
      const minValLbl = document.getElementById('price-min-val');
      const maxValLbl = document.getElementById('price-max-val');
      if (minValLbl) minValLbl.textContent = '0';
      if (maxValLbl) maxValLbl.textContent = new Intl.NumberFormat('ru-RU').format(maxPriceAll);

      const onPriceChange = () => {
        if (+minSlider.value > +maxSlider.value) minSlider.value = maxSlider.value;
        priceMin = +minSlider.value;
        priceMax = +maxSlider.value;
        if (minValLbl) minValLbl.textContent = new Intl.NumberFormat('ru-RU').format(priceMin);
        if (maxValLbl) maxValLbl.textContent = new Intl.NumberFormat('ru-RU').format(priceMax);
        if (priceInputs[0]) priceInputs[0].value = priceMin;
        if (priceInputs[1]) priceInputs[1].value = priceMax;
        currentPage = 1; renderPage();
      };
      minSlider.addEventListener('input', onPriceChange);
      maxSlider.addEventListener('input', onPriceChange);
    }

    // Числовые инпуты цены
    const priceInputEls = document.querySelectorAll('.price-input');
    if (priceInputEls[0] && priceInputEls[1]) {
      priceInputEls[0].addEventListener('change', () => {
        priceMin = Math.max(0, +priceInputEls[0].value || 0);
        if (minSlider) minSlider.value = priceMin;
        currentPage = 1; renderPage();
      });
      priceInputEls[1].addEventListener('change', () => {
        priceMax = +priceInputEls[1].value || Infinity;
        if (maxSlider) maxSlider.value = Math.min(priceMax, maxPriceAll);
        currentPage = 1; renderPage();
      });
    }

    // Чекбоксы брендов
    document.querySelectorAll('.filter-sidebar .filter-checkbox input[type=checkbox]').forEach(cb => {
      cb.checked = false;
      cb.addEventListener('change', () => {
        checkedBrands = new Set(
          [...document.querySelectorAll('.filter-sidebar .filter-checkbox input:checked')].map(x => x.value)
        );
        currentPage = 1; renderPage();
      });
    });

    // Сброс фильтров
    document.querySelector('.filter-sidebar .btn-outline')?.addEventListener('click', () => {
      checkedBrands.clear();
      priceMin = 0; priceMax = Infinity;
      if (minSlider) { minSlider.value = 0; }
      if (maxSlider) { maxSlider.value = maxPriceAll; }
      if (priceInputEls[0]) priceInputEls[0].value = 0;
      if (priceInputEls[1]) priceInputEls[1].value = maxPriceAll;
      const minValLbl = document.getElementById('price-min-val');
      const maxValLbl = document.getElementById('price-max-val');
      if (minValLbl) minValLbl.textContent = '0';
      if (maxValLbl) maxValLbl.textContent = new Intl.NumberFormat('ru-RU').format(maxPriceAll);
      document.querySelectorAll('.filter-sidebar .filter-checkbox input').forEach(cb => cb.checked = false);
      currentPage = 1; renderPage();
    });

    // Сортировка
    const sortSel = document.querySelector('.sort-dropdown');
    if (sortSel) sortSel.addEventListener('change', () => { sortVal = sortSel.value; currentPage = 1; renderPage(); });

    // Количество на странице
    const perPageSel = document.querySelector('.per-page select');
    if (perPageSel) perPageSel.addEventListener('change', () => { perPage = +perPageSel.value; currentPage = 1; renderPage(); });

    // Переключатель вид (сетка / список)
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        grid.classList.toggle('products-grid--list', btn.dataset.view === 'list');
      });
    });

    // --- Хиты и Новинки в сайдбаре ---
    const sidebarHits = document.getElementById('sidebar-hits');
    const sidebarNew  = document.getElementById('sidebar-new');
    const miniCard = p => `
      <div class="sidebar-mini-card" data-product-id="${p.id}">
        <a href="product.html?id=${p.id}" class="sidebar-mini-img-wrap">
          <img src="${p.image || 'assets/images/BigBanner1.png'}" alt="${p.name}" loading="lazy">
        </a>
        <div class="sidebar-mini-info">
          <a href="product.html?id=${p.id}" class="sidebar-mini-name">${p.name}</a>
          <div class="sidebar-mini-price">${new Intl.NumberFormat('ru-RU').format(p.price)} ₽</div>
        </div>
      </div>`;
    const empty = '<div style="color:var(--clr-muted);font-size:13px;padding:4px 0">Нет товаров</div>';
    if (sidebarHits) sidebarHits.innerHTML = catProducts.filter(p => p.isHit || p.inStock).slice(0,3).map(miniCard).join('') || empty;
    if (sidebarNew)  sidebarNew.innerHTML  = catProducts.filter(p => p.isNew).slice(0,3).map(miniCard).join('') || empty;

    // --- Главный рендер ---
    function getFiltered() {
      return catProducts.filter(p => {
        const price = p.price || 0;
        if (price < priceMin) return false;
        if (priceMax !== Infinity && price > priceMax) return false;
        if (checkedBrands.size > 0 && !checkedBrands.has((p.brand || '').toLowerCase())) return false;
        return true;
      });
    }

    function renderPage() {
      let items = getFiltered();

      if (sortVal === 'price-asc')  items.sort((a,b) => a.price - b.price);
      else if (sortVal === 'price-desc') items.sort((a,b) => b.price - a.price);
      else if (sortVal === 'rating')     items.sort((a,b) => (b.rating||0) - (a.rating||0));
      else if (sortVal === 'name')       items.sort((a,b) => (a.name||'').localeCompare(b.name||'','ru'));
      else if (sortVal === 'date')       items.sort((a,b) => (b.id||0) - (a.id||0));

      const total      = items.length;
      const totalPages = Math.max(1, Math.ceil(total / perPage));
      currentPage      = Math.min(currentPage, totalPages);
      const start      = (currentPage - 1) * perPage;
      const pageItems  = items.slice(start, start + perPage);

      grid.innerHTML = pageItems.length
        ? pageItems.map(p => productCard(p)).join('')
        : '<div class="kategoriya-empty" style="padding:40px;text-align:center;color:var(--clr-muted)">По данным фильтрам товары не найдены</div>';

      applyIcons();
      renderPagination(totalPages);
      updateCountBtn(total);
    }

    function updateCountBtn(total) {
      const btn = document.querySelector('.filter-sidebar .btn-primary');
      if (btn) btn.textContent = 'Показать товары ' + total;
    }

    function renderPagination(totalPages) {
      const nav = document.querySelector('.pagination');
      if (!nav) return;
      const parts = [];

      parts.push(`<button class="pagination-btn" type="button" id="pag-prev"${currentPage===1?' disabled':''}>‹ Назад</button>`);

      const range = buildRange(currentPage, totalPages);
      let lastN = 0;
      range.forEach(n => {
        if (n - lastN > 1) parts.push('<span class="pagination-dots">…</span>');
        parts.push(`<button class="pagination-btn${n===currentPage?' active':''}" type="button" data-page="${n}"${n===currentPage?' aria-current="page"':''}>${n}</button>`);
        lastN = n;
      });
      if (lastN < totalPages) {
        if (totalPages - lastN > 1) parts.push('<span class="pagination-dots">…</span>');
        parts.push(`<button class="pagination-btn${totalPages===currentPage?' active':''}" type="button" data-page="${totalPages}">${totalPages}</button>`);
      }
      parts.push(`<button class="pagination-btn" type="button" id="pag-next"${currentPage===totalPages?' disabled':''}>Далее ›</button>`);

      nav.innerHTML = parts.join('');
      nav.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', () => { currentPage = +btn.dataset.page; renderPage(); nav.scrollIntoView({behavior:'smooth',block:'nearest'}); });
      });
      nav.querySelector('#pag-prev')?.addEventListener('click', () => { if(currentPage>1){currentPage--;renderPage();} });
      nav.querySelector('#pag-next')?.addEventListener('click', () => { if(currentPage<totalPages){currentPage++;renderPage();} });
    }

    function buildRange(cur, total, delta=2) {
      const r = [];
      for (let i = Math.max(1, cur-delta); i <= Math.min(total, cur+delta); i++) r.push(i);
      if (!r.includes(1)) r.unshift(1);
      return r;
    }

    // Первый рендер
    renderPage();
  }

  document.addEventListener('DOMContentLoaded', init);

  // Scroll-to-top button (index.html only)
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('scroll-top-btn');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  });

  // Expose utility functions globally so out-of-IIFE code can use them
  window.applyIcons   = applyIcons;
  window.addToCart    = addToCart;
  window.updateBadges = updateBadges;
  window.showToast    = showToast;
  window.applyTheme   = applyTheme;
  window.applyLang    = applyLang;
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
  <img src="${p.image || 'assets/images/BigBanner1.png'}" alt="${p.name}" loading="lazy">
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

// Buy button — attach ONCE, outside renderCartModal
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.btn-cart-buy')?.addEventListener('click', () => {
    window.location.href = 'checkout.html';
  });
});

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
  <img class="cart-modal-item-img" src="${p.image || 'assets/images/BigBanner1.png'}" alt="${p.name}" loading="lazy">
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
    <img src="${p.image || 'assets/images/BigBanner1.png'}" alt="${p.name}" loading="lazy">
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
    <img src="${p.image || 'assets/images/BigBanner1.png'}" alt="${p.name}" loading="lazy">
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

/* =============================================
   SETTINGS WIDGET — FAB (bottom-left)
   ============================================= */
function initSettingsWidget() {
  const widget  = document.getElementById('settings-widget');
  const trigger = document.getElementById('settings-widget-trigger');
  const panel   = document.getElementById('settings-widget-panel');
  const closeBtn= document.getElementById('settings-widget-close');
  if (!widget || !trigger || !panel) return;

  /* ── open / close ── */
  function openPanel() {
    panel.classList.add('open');
    trigger.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');
    syncWidgetState();
  }
  function closePanel() {
    panel.classList.remove('open');
    trigger.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');
  }
  function togglePanel() {
    panel.classList.contains('open') ? closePanel() : openPanel();
  }

  trigger.addEventListener('click', e => { e.stopPropagation(); togglePanel(); });
  closeBtn?.addEventListener('click', closePanel);

  // Close on outside click
  document.addEventListener('click', e => {
    if (panel.classList.contains('open') && !widget.contains(e.target)) closePanel();
  });
  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });

  /* ── Theme buttons ── */
  panel.querySelectorAll('[data-theme-set]').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.themeSet;
      // applyTheme is inside the IIFE, exposed via initTheme setup — call global setter
      if (typeof applyTheme === 'function') {
        applyTheme(theme);
      } else {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('teleoptics.theme', theme);
      }
      syncWidgetState();
    });
  });

  /* ── Lang buttons ── */
  panel.querySelectorAll('[data-lang-set]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.langSet;
      if (typeof applyLang === 'function') {
        applyLang(lang);
      } else {
        localStorage.setItem('teleoptics.lang', lang);
        location.reload();
      }
      syncWidgetState();
    });
  });

  /* ── Sync active state of theme/lang buttons ── */
  function syncWidgetState() {
    const theme = document.documentElement.getAttribute('data-theme') ||
                  localStorage.getItem('teleoptics.theme') || 'light';
    const lang  = localStorage.getItem('teleoptics.lang') || 'ru';

    panel.querySelectorAll('[data-theme-set]').forEach(b => {
      b.classList.toggle('active', b.dataset.themeSet === theme);
    });
    panel.querySelectorAll('[data-lang-set]').forEach(b => {
      b.classList.toggle('active', b.dataset.langSet === lang);
    });
  }

  // Sync on page load
  syncWidgetState();

  // Keep old lang-toggle / theme-toggle handlers working too (header buttons etc.)
  // Re-expose applyLang so it's accessible outside the IIFE
  window._syncSettingsWidget = syncWidgetState;
}

document.addEventListener('DOMContentLoaded', initSettingsWidget);

// Patch applyLang & applyTheme to keep widget in sync after external calls
(function patchGlobals() {
  const _orig = document.addEventListener.bind(document);
  const whenReady = cb => {
    if (document.readyState !== 'loading') cb();
    else _orig('DOMContentLoaded', cb);
  };
  whenReady(() => {
    // Patch lang-toggle clicks (header) to also sync widget
    document.querySelectorAll('.lang-toggle').forEach(b => {
      b.addEventListener('click', () => {
        setTimeout(() => { if (window._syncSettingsWidget) window._syncSettingsWidget(); }, 50);
      });
    });
    // Patch theme-toggle clicks (header) to also sync widget
    document.querySelectorAll('.theme-toggle').forEach(b => {
      b.addEventListener('click', () => {
        setTimeout(() => { if (window._syncSettingsWidget) window._syncSettingsWidget(); }, 50);
      });
    });
  });
})();
