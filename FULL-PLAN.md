# 🎯 ПЛАН РОБІТ: МАКСИМАЛЬНО ФУНКЦІОНАЛЬНИЙ САЙТ

---

## 📊 **ЗАГАЛЬНА КАРТИНА:**

```
МЕТА: Простий, зрозумілий, функціональний сайт для покупців

ПРІОРИТЕТИ:
1. Швидкість ⚡
2. Зручність 👍
3. Зрозумілість 💡
4. Стильність 🎨

ЗАГАЛЬНИЙ ЧАС: ~18 годин
РОЗДІЛЕНО: 4 сесії по 4-5 годин
```

---

## 📋 **ДЕТАЛЬНИЙ СПИСОК ЗАДАЧ:**

### **🔴 СЕСІЯ 1: ОСНОВНИЙ ФУНКЦІОНАЛ (9 год)**

#### **1.1 ВАЛІДАЦІЯ ФОРМ (2 год)** ⏰
```
ЩО РОБИМО:
✓ Newsletter форма
  - Email формат перевірка
  - Зелена галочка при OK
  - Червона рамка при помилці
  - Текст помилки під полем

✓ Форма "На міру"
  - Телефон формат (+420 XXX XXX XXX)
  - Email формат
  - Обов'язкові поля (червона *)
  - Розміри (тільки числа > 0)
  - Disable кнопки під час відправки

✓ Візуальний feedback
  - input.valid → зелена рамка + ✓
  - input.invalid → червона рамка + ✗
  - Підказки що виправити

ФАЙЛИ:
- index.html (додати error spans)
- css/style.css (стилі помилок)
- js/script.js (validation функції)

РЕЗУЛЬТАТ:
→ Неможливо відправити невірні дані
→ Користувач бачить що не так
→ Професійний вигляд
```

#### **1.2 ПОШУК ТОВАРІВ (3 год)** 🔍
```
ЩО РОБИМО:
✓ Поле пошуку в header
  - Іконка 🔍
  - Placeholder "Hledat produkty..."
  - Автофокус при "/" клавіші
  - Кнопка очистити (×)

✓ Логіка пошуку
  - По назві товару
  - По опису товару
  - Real-time (при вводі)
  - Без урахування регістру
  - Підсвітка знайденого

✓ Результати
  - "Znalezeno X produktů"
  - Якщо 0 → "Nic nenalezeno"
  - Smooth scroll до результатів
  - Показати категорію товару

✓ UX деталі
  - ESC → очистити
  - Enter → показати результати
  - Мінімум 2 символи
  - Затримка 300ms (debounce)

ФАЙЛИ:
- index.html (search input)
- css/style.css (search стилі)
- js/script.js (search функції)

РЕЗУЛЬТАТ:
→ Легко знайти будь-який товар
→ Швидко і зручно
→ Без перезавантаження
```

#### **1.3 ФІЛЬТРИ + СОРТУВАННЯ (4 год)** 💰
```
ЩО РОБИМО:
✓ Панель фільтрів
  - Над товарами
  - Horizontal layout
  - Responsive

✓ Фільтр "Ціна"
  - Dual-range slider
  - Від: ___ До: ___
  - Показує мін/макс ціни
  - Real-time update

✓ Чекбокси
  - ☑ Pouze slevy (тільки знижки)
  - ☑ Pouze novinky (тільки новинки)
  - Лічильник скільки товарів

✓ Сортування (dropdown)
  - Výchozí (за замовчуванням)
  - Cena: nejlevnější (дешеві→дорогі)
  - Cena: nejdražší (дорогі→дешеві)
  - Název: A-Z
  - Slevy (знижки спочатку)
  - Novinky (новинки спочатку)

✓ Кнопка "Vymazat filtry"
  - Скидає все
  - Показує всі товари

✓ Інтеграція
  - Працює з категоріями
  - Працює з пошуком
  - Зберігає стан

ФАЙЛИ:
- index.html (filters panel)
- css/style.css (filters стилі)
- js/script.js (filtering + sorting)

РЕЗУЛЬТАТ:
→ Легко знайти потрібне
→ Гнучка фільтрація
→ Інтуїтивно зрозуміло
```

---

### **🟡 СЕСІЯ 2: ПОКРАЩЕННЯ UX (4 год)**

#### **2.1 LAZY LOADING (1 год)** ⚡
```
ЩО РОБИМО:
✓ Images
  - loading="lazy" attribute
  - Intersection Observer
  - Placeholder blur effect
  - Fade in коли завантажено

✓ Optimize
  - Тільки видимі фото завантажуються
  - Економія 60% трафіку
  - Швидше Initial Load

ФАЙЛИ:
- js/script.js (lazy loading init)
- css/style.css (placeholder styles)

РЕЗУЛЬТАТ:
→ Сторінка завантажується швидше
→ Менше трафіку
→ Краще для мобільних
```

#### **2.2 LOADING STATES (1 год)** ⏳
```
ЩО РОБИМО:
✓ При фільтрації
  - Показати spinner
  - "Načítání produktů..."
  - Dim товари

✓ При пошуку
  - Loading в search input
  - Animated dots: "Hledám..."

✓ При submit форм
  - Disable кнопка
  - Spinner на кнопці
  - "Odesílám..."

✓ Skeleton screens
  - Для product cards
  - Сірі прямокутники
  - Pulse animation

ФАЙЛИ:
- index.html (loading elements)
- css/style.css (loading animations)
- js/script.js (show/hide loading)

РЕЗУЛЬТАТ:
→ Користувач бачить що щось відбувається
→ Не клацає 100 разів
→ Професійно
```

#### **2.3 EMPTY STATES (30 хв)** 📭
```
ЩО РОБИМО:
✓ Немає результатів пошуку
  "😕 Nic nenalezeno pro '{query}'
   Zkuste jiný výraz"

✓ Немає товарів після фільтрів
  "🔍 Žádné produkty neodpovídají filtrům
   [Vymazat filtry]"

✓ Порожня категорія
  "📦 V této kategorii zatím nejsou produkty
   Podívejte se na jiné kategorie"

✓ Порожня корзина
  (Вже є, але покращити)

ФАЙЛИ:
- js/script.js (empty state logic)
- css/style.css (empty state design)

РЕЗУЛЬТАТ:
→ Зрозуміло що робити далі
→ Не залишаємо користувача наодинці
```

#### **2.4-2.6 ДРІБНІ ПОКРАЩЕННЯ (1.5 год)** 🔢📜💵
```
2.4 Лічильники:
  - "Zobrazeno 6 z 12 produktů"
  - В категоріях: "Stoly (3)"
  - При фільтрах: "Nalezeno: 5"

2.5 Smooth Scroll:
  - Плавна прокрутка до секцій
  - Offset 80px для header
  - Easing function

2.6 Price Format:
  - 12000 → 12 000 Kč
  - Функція formatPrice()
  - Всюди однаково

ФАЙЛИ:
- js/script.js (utility functions)
- css/style.css (scroll behavior)

РЕЗУЛЬТАТ:
→ Деталі роблять сайт приємним
```

---

### **🟢 СЕСІЯ 3: ДЕТАЛІ ЯКОСТІ (3 год)**

#### **3.1 BREADCRUMBS (1 год)** 🔗
```
ЩО РОБИМО:
✓ Структура
  Domů > Produkty > [Kategorie] > [Produkt]

✓ Де показувати
  - Під header
  - На всіх сторінках
  - Адаптується до контексту

✓ Функціонал
  - Клікабельні посилання
  - Поточна сторінка не клікається
  - Separator: >
  - Responsive на mobile

ФАЙЛИ:
- index.html (breadcrumb element)
- css/style.css (breadcrumb styles)
- js/script.js (breadcrumb update)

РЕЗУЛЬТАТ:
→ Легко повернутись назад
→ Розумієш де ти
→ SEO+
```

#### **3.2 TOOLTIPS (1 год)** 💡
```
ЩО РОБИМО:
✓ На іконках
  🔍 → "Hledat produkty"
  ❤️ → "Přidat do oblíbených"
  📐 → "Objednat na míru"
  🛒 → "Přidat do košíku"

✓ На кнопках
  При hover показувати підказку

✓ Дизайн
  - Темний background
  - Біла стрілочка
  - Fade in 200ms
  - Position: dynamic

ФАЙЛИ:
- css/style.css (tooltip styles)
- js/script.js (tooltip init)

РЕЗУЛЬТАТ:
→ Зрозуміло що робить кожна кнопка
→ Для новачків особливо корисно
```

#### **3.3-3.4 ФІНАЛЬНІ ШТРИХИ (1 год)** 🧹⌨️
```
3.3 Кнопки очистки:
  - "× Vymazat vyhledávání"
  - "🧹 Vymazat všechny filtry"
  - Smooth fade out

3.4 Keyboard Support:
  - ESC → close modal/search
  - / → focus search
  - Enter → submit
  - Tab → navigation
  - Arrows → lightbox

ФАЙЛИ:
- js/script.js (keyboard events)

РЕЗУЛЬТАТ:
→ Power users люблять це
→ Accessibility++
```

---

### **⚪ СЕСІЯ 4: ДОВЕДЕННЯ (2 год)**

#### **4.1 ANIMATIONS (1 год)** ✨
```
ЩО РОБИМО:
✓ Scroll animations
  - Секції fade in при появі
  - Товари стaggered появи
  - Intersection Observer

✓ Micro-interactions
  - Button hover scale
  - Card lift on hover
  - Icon animations
  - Smooth всюди

✓ Page transitions
  - Category change smooth
  - Filter apply smooth
  - Search results smooth

ФАЙЛИ:
- css/style.css (animations)
- js/script.js (scroll observer)

РЕЗУЛЬТАТ:
→ Живий, приємний сайт
→ Не нудний
```

#### **4.2 ERROR HANDLING (1 год)** 🐛
```
ЩО РОБИМО:
✓ Try/catch blocks
  - Всі async операції
  - localStorage operations
  - JSON parsing

✓ Fallbacks
  - Якщо localStorage не працює
  - Якщо товари не завантажились
  - Якщо форма не відправилась

✓ User messages
  - "⚠️ Něco se pokazilo"
  - "🔄 Zkuste to znovu"
  - Console.error для debug

ФАЙЛИ:
- js/script.js (error handling)

РЕЗУЛЬТАТ:
→ Сайт не ламається
→ Завжди є план B
```

---

## 📊 **TIMELINE:**

```
ДЕНЬ 1: Сесія 1 (9 год)
├── Валідація (2 год) ✓
├── Пошук (3 год) 🔍
└── Фільтри (4 год) 💰

ДЕНЬ 2: Сесія 2 (4 год)
├── Lazy Loading (1 год) ⚡
├── Loading States (1 год) ⏳
└── Дрібниці (2 год) 🔢

ДЕНЬ 3: Сесія 3 (3 год)
├── Breadcrumbs (1 год) 🔗
├── Tooltips (1 год) 💡
└── Keyboard (1 год) ⌨️

ДЕНЬ 4: Сесія 4 (2 год)
├── Animations (1 год) ✨
└── Error Handling (1 год) 🐛
```

---

## ✅ **РЕЗУЛЬТАТ ПІСЛЯ ВСЬОГО:**

```
ШВИДКІСТЬ:
✅ Lazy loading → швидше на 60%
✅ Optimized code
✅ Smooth всюди

ЗРУЧНІСТЬ:
✅ Пошук anything
✅ Фільтри powerful
✅ Валідація clear
✅ Loading states visible

ЗРОЗУМІЛІСТЬ:
✅ Tooltips everywhere
✅ Empty states helpful
✅ Breadcrumbs clear
✅ Errors zрозумілі

СТИЛЬНІСТЬ:
✅ Animations smooth
✅ Transitions beautiful
✅ Details polished
✅ Professional look

ГОТОВНІСТЬ: 100% 🎉
```

---

## 🚀 **ПОЧИНАЄМО!**

**Зараз буду виконувати по порядку:**
1. Валідація форм
2. Пошук
3. Фільтри
4. І так далі...

**Після кожної задачі:**
- ✅ Mark as done
- 📝 Тестування
- 📄 Documentation

---

**ГОТОВИЙ ПОЧИНАТИ! ЛЕТ'С ГОУ! 💪**
