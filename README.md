# TELE-OPTICS — Курсовая работа

## Структура проекта

```
├── index.html          — Главная страница
├── catalog.html        — Каталог (все категории)
├── kategoriya.html     — Страница категории с фильтрами
├── product.html        — Карточка товара
├── cart.html           — Корзина
├── favorites.html      — Избранное
├── compare.html        — Сравнение товаров
├── viewed.html         — Просмотренные товары
├── contacts.html       — Контакты
├── about.html          — О нас
├── blog.html           — Блог
├── post.html           — Страница статьи
├── reviews.html        — Отзывы
├── delivery.html       — Доставка
├── payment.html        — Оплата
├── guarantee.html      — Гарантии
├── promotions.html     — Акции
├── sales.html          — Распродажа
├── vacancies.html      — Вакансии
├── css/style.css       — Главный CSS (2400+ строк)
├── js/app.js           — JavaScript (без фреймворков)
├── data/db.json        — База данных (JSON)
└── assets/
    ├── icons/          — 36 SVG иконок
    └── images/         — Изображения баннеров
```

## Запуск с JSON Server

```bash
# Установить json-server
npm install -g json-server

# Запустить сервер (в папке проекта)
json-server --watch data/db.json --port 3000

# Открыть index.html в браузере
```

## Технологии
- HTML5 (семантическая разметка)
- CSS3 (CSS Variables, Grid, Flexbox, Media Queries)
- Vanilla JavaScript (без фреймворков, без jQuery)
- JSON Server (локальный REST API)
- Fetch API (загрузка данных)
- localStorage (корзина, избранное, настройки)

## Функциональность
- ✅ Адаптивная верстка (1440px / 768px / 320px)
- ✅ Тёмная / светлая тема
- ✅ RU / EN интернационализация
- ✅ Версия для слабовидящих (5 цветовых схем, 3 размера шрифта)
- ✅ Корзина, Избранное, Сравнение
- ✅ Hero-слайдер с автопрокруткой
- ✅ Карусели товаров с пагинацией
- ✅ Фильтры каталога (цена, бренд)
- ✅ Аккордеон (гарантии, FAQ)
- ✅ Модальные окна (вход, регистрация, корзина, город)
- ✅ Форма консультации + Яндекс карта
- ✅ Бургер-меню (мобильная версия)
- ✅ localStorage — сохранение настроек
- ✅ Кнопка сброса настроек
- ✅ Прелоадер
- ✅ Toast-уведомления
