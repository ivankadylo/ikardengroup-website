# 🔄 ЯК ОНОВИТИ КОНТЕНТ - ІНСТРУКЦІЯ

## Після отримання ваших даних

---

## 1. 📞 **ОНОВИТИ КОНТАКТИ**

### **Файл:** `index.html`

### **Знайти:**
```html
<div class="contact-item">
    <span class="contact-icon">📍</span>
    <h3>Adresa</h3>
    <p>Praha, Česká republika</p>
    <p class="contact-note">(Čekáme na vaši přesnou adresu)</p>
</div>
```

### **Замінити на:**
```html
<div class="contact-item">
    <span class="contact-icon">📍</span>
    <h3>Adresa</h3>
    <p>[ВАША АДРЕСА]</p>
    <p>[МІСТО, ІНДЕКС]</p>
</div>
```

### **Приклад:**
```html
<div class="contact-item">
    <span class="contact-icon">📍</span>
    <h3>Adresa</h3>
    <p>Hlavní 123</p>
    <p>Praha 1, 110 00</p>
</div>
```

---

### **Телефон:**

**Знайти:**
```html
<p>+420 XXX XXX XXX</p>
<p class="contact-note">(Čekáme na vaše číslo)</p>
```

**Замінити на:**
```html
<p>+420 [ВАШ НОМЕР]</p>
```

**Приклад:**
```html
<p>+420 123 456 789</p>
```

---

### **Email:**

**Знайти:**
```html
<p>info@ikarden.cz</p>
<p class="contact-note">(Čekáme na váš email)</p>
```

**Замінити на:**
```html
<p>[ВАШ EMAIL]</p>
```

**Приклад:**
```html
<p>info@ikarden.cz</p>
```

---

## 2. 📱 **ОНОВИТИ WHATSAPP**

### **Файл:** `index.html`

### **Знайти:**
```html
<a href="https://wa.me/420XXXXXXXXX" class="whatsapp-btn">
```

### **Замінити на:**
```html
<a href="https://wa.me/420[ВАШ НОМЕР]" class="whatsapp-btn">
```

### **Приклад:**
```html
<a href="https://wa.me/420123456789" class="whatsapp-btn">
```

**ВАЖЛИВО:**
- Без пробілів
- Без тире
- Тільки цифри
- Починається з 420

---

## 3. 📘 **ОНОВИТИ СОЦМЕРЕЖІ**

### **Файл:** `index.html`

### **Знайти в Footer:**
```html
<a href="#" class="social-link" title="Facebook">📸 Facebook</a>
<a href="#" class="social-link" title="Instagram">📷 Instagram</a>
<p class="contact-note">(Čekáme na odkazy)</p>
```

### **Замінити на:**
```html
<a href="[FACEBOOK URL]" class="social-link" title="Facebook" target="_blank">📸 Facebook</a>
<a href="[INSTAGRAM URL]" class="social-link" title="Instagram" target="_blank">📷 Instagram</a>
```

### **Приклад:**
```html
<a href="https://facebook.com/ikarden" class="social-link" title="Facebook" target="_blank">📸 Facebook</a>
<a href="https://instagram.com/ikarden.cz" class="social-link" title="Instagram" target="_blank">📷 Instagram</a>
```

**Якщо немає:**
- Можна видалити рядки
- Або залишити з `href="#"` (не будуть працювати)

---

## 4. 📸 **ДОДАТИ ФОТО ГАЛЕРЕЇ**

### **Крок 1: Підготовка фото**

**Структура папок:**
```
ikarden-website/
  images/
    gallery/
      projekt-1.jpg
      projekt-2.jpg
      projekt-3.jpg
      ...
```

**Вимоги до фото:**
- Формат: JPG або PNG
- Розмір: оптимально 1200x900px
- Якість: висока
- Вага: до 500KB (я стисну якщо треба)

---

### **Крок 2: Створити масив в JavaScript**

### **Файл:** `js/script.js`

### **Знайти:**
```javascript
const galleryItems = [
    {
        title: 'Obývací stěna',
        location: 'Praha, 2024',
        image: '' // Will use placeholder
    },
    ...
];
```

### **Замінити на:**
```javascript
const galleryItems = [
    {
        title: '[НАЗВА ПРОЕКТУ 1]',
        location: '[МІСТО, РІК]',
        image: 'images/gallery/projekt-1.jpg'
    },
    {
        title: '[НАЗВА ПРОЕКТУ 2]',
        location: '[МІСТО, РІК]',
        image: 'images/gallery/projekt-2.jpg'
    },
    // ... додати більше
];
```

### **Приклад:**
```javascript
const galleryItems = [
    {
        title: 'Obývací stěna z masivu',
        location: 'Praha 5, 2024',
        image: 'images/gallery/obyvaci-stena.jpg'
    },
    {
        title: 'Jídelní sestava',
        location: 'Brno, 2024',
        image: 'images/gallery/jidelni-stul.jpg'
    },
    {
        title: 'Knihovna na míru',
        location: 'Ostrava, 2023',
        image: 'images/gallery/knihovna.jpg'
    }
];
```

---

### **Крок 3: Видалити placeholder код**

**Знайти в `js/script.js`:**
```javascript
if (galleryItems.length === 0 || !galleryItems[0].image) {
    galleryGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center...">
            <p>📸 Galerie bude brzy doplěněna</p>
        </div>
    `;
    return;
}
```

**Замінити на:**
```javascript
if (galleryItems.length === 0) {
    return;
}
```

Або просто **видалити весь блок if**.

---

## 5. 🎨 **ОНОВИТИ FAQ (опційно)**

### **Файл:** `index.html`

### **Додати нове питання:**

```html
<div class="faq-item">
    <button class="faq-question">
        [ВАШЕ ПИТАННЯ]?
        <span class="faq-icon">+</span>
    </button>
    <div class="faq-answer">
        [ВАША ВІДПОВІДЬ]
    </div>
</div>
```

### **Приклад:**
```html
<div class="faq-item">
    <button class="faq-question">
        Nabízíte montáž nábytku?
        <span class="faq-icon">+</span>
    </button>
    <div class="faq-answer">
        Ano, nabízíme profesionální montáž všeho nábytku. 
        Cena montáže je individuální podle složitosti.
    </div>
</div>
```

---

## 6. ⏰ **ОНОВИТИ РОБОЧІ ГОДИНИ**

### **Файл:** `index.html`

### **Знайти:**
```html
<div class="contact-item">
    <span class="contact-icon">⏰</span>
    <h3>Otevírací doba</h3>
    <p>Po-Pá: 9:00-17:00</p>
    <p>So: 9:00-13:00</p>
</div>
```

### **Змінити на свої:**
```html
<div class="contact-item">
    <span class="contact-icon">⏰</span>
    <h3>Otevírací doba</h3>
    <p>[ВАШ ГРАФІК]</p>
    <p>[ВАШ ГРАФІК]</p>
</div>
```

### **Приклади:**

**Варіант 1:**
```html
<p>Po-Pá: 8:00-18:00</p>
<p>So-Ne: Zavřeno</p>
```

**Варіант 2:**
```html
<p>Po-Pá: 9:00-17:00</p>
<p>So: 10:00-14:00</p>
<p>Ne: Zavřeno</p>
```

**Варіант 3:**
```html
<p>Po-Ne: 24/7</p>
<p>(Pouze online objednávky)</p>
```

---

## 7. 🔗 **ТЕСТУВАННЯ ПІСЛЯ ОНОВЛЕННЯ**

### **Чеклист:**

```
□ Відкрити index.html в браузері
□ Ctrl + Shift + R (hard refresh)
□ Прокрутити вниз до контактів
□ Перевірити адресу - ✅ правильна
□ Перевірити телефон - ✅ правильний
□ Перевірити email - ✅ правильний
□ Клікнути на WhatsApp - ✅ відкривається
□ Прокрутити до галереї - ✅ фото показуються
□ Hover на фото - ✅ overlay з'являється
□ Клікнути Facebook - ✅ відкривається
□ Клікнути Instagram - ✅ відкривається
□ Тест на мобільному - ✅ все responsive
```

---

## 8. 📤 **ЯК НАДІСЛАТИ ФАЙЛИ**

### **Варіант 1: Надіслати всі файли**
```
Створити ZIP:
  ikarden-website.zip
    ├── index.html (оновлений)
    ├── js/script.js (оновлений)
    ├── images/
    │   └── gallery/
    │       ├── foto1.jpg
    │       ├── foto2.jpg
    │       └── ...

Надіслати:
- Email
- WeTransfer
- Google Drive
```

### **Варіант 2: Надіслати тільки данні**
```
Створити текстовий файл:

dane.txt:
━━━━━━━━━━━━━━━━━━━━━━━━━
KONTAKTY:
Adresa: [ваша адреса]
Telefon: [ваш телефон]
Email: [ваш email]
Hodiny: [ваш графік]

SOCIÁLNÍ SÍTĚ:
Facebook: [URL nebo "nemáme"]
Instagram: [URL nebo "nemáme"]

WHATSAPP:
Číslo: [420XXXXXXXXX]

FOTKY:
[přiložit nebo odkaz]
━━━━━━━━━━━━━━━━━━━━━━━━━

Я САМ ВСЕ ОНОВЛЮ!
```

---

## 9. ⚡ **ШВИДКЕ ОНОВЛЕННЯ (я зроблю за 30 хв)**

**Надішліть мені:**
```
1. Текст з контактами
2. Посилання на фото (Google Drive / WeTransfer)
3. Соцмережі URL

Я:
✅ Оновлю всі файли
✅ Додам фото
✅ Перевірю
✅ Надішлю назад
✅ Або одразу завантажу на хостинг (якщо є)
```

**Час:** 20-30 хвилин

---

## 10. 🚀 **ПІСЛЯ ОНОВЛЕННЯ:**

```
✅ Сайт з реальними контактами
✅ Галерея з вашими роботами
✅ Працюючий WhatsApp
✅ Соцмережі підключені
✅ Все професійно

Готово до запуску! 🎉
```

---

## 📞 **ЯКЩО ВИНИКЛИ ПИТАННЯ:**

```
Напишіть мені:
"Не можу знайти де змінити [ЩО]"
або
"Як додати [ЩО]"
або
"Зроби сам, я надішлю дані"

Я ДОПОМОЖУ! 💪
```

---

**НАДІШЛІТЬ ДАНІ → Я ВСЕ ОНОВЛЮ → ГОТОВО! ✅**
