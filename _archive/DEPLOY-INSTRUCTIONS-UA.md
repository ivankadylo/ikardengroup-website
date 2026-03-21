# 🚀 ПОКРОКОВА ІНСТРУКЦІЯ - ВИСТАВЛЕННЯ САЙТУ

**Email:** ikardengroup@gmail.com

---

## ⚡ МЕТОД 1: АВТОМАТИЧНИЙ (НАЙПРОСТІШИЙ!)

### 1️⃣ Двічі клікніть на файл:
```
setup-and-deploy.bat
```

### 2️⃣ Слідуйте інструкціям на екрані:
```
✅ Створіть репозиторій на GitHub
✅ Скопіюйте URL
✅ Вставте в термінал
✅ Увімкніть GitHub Pages
✅ ГОТОВО!
```

### 3️⃣ Для оновлення сайту:
```
Змініть файли → update-site.bat → ГОТОВО!
```

---

## 📋 МЕТОД 2: РУЧНИЙ (КРОК ЗА КРОКОМ)

### КРОК 1: Створення GitHub репозиторію

1. **Відкрийте браузер:**
   ```
   https://github.com/new
   ```

2. **Заповніть форму:**
   ```
   Repository name: ikarden-website
   Description: Profesionální web výrobce nábytku
   
   ☑ Public (публічний)
   
   ☐ Add a README file
   ☐ Add .gitignore
   ☐ Choose a license
   ```

3. **Натисніть:**
   ```
   Create repository
   ```

4. **Скопіюйте URL:**
   ```
   https://github.com/ВАШ_USERNAME/ikarden-website.git
   ```

---

### КРОК 2: Завантаження коду

1. **Відкрийте термінал:**
   ```
   Windows + R
   Напишіть: cmd
   Enter
   ```

2. **Перейдіть у папку:**
   ```bash
   cd C:\Users\ivank\muscle-diary\ikarden-website
   ```

3. **Виконайте команди:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - IKarden website"
   git branch -M main
   git remote add origin https://github.com/ВАШ_USERNAME/ikarden-website.git
   git push -u origin main
   ```

4. **Якщо попросить авторизацію:**
   ```
   Username: ваш_username
   Password: ваш_токен
   ```

**УВАГА:** Використовуйте Personal Access Token як пароль!

---

### КРОК 3: Створення Personal Access Token (якщо потрібно)

1. **GitHub → Settings → Developer settings**
2. **Personal access tokens → Tokens (classic)**
3. **Generate new token (classic)**
4. **Налаштування:**
   ```
   Note: ikarden-website-deploy
   Expiration: 90 days (або більше)
   
   Виберіть:
   ☑ repo (всі галочки під ним)
   ```
5. **Generate token**
6. **СКОПІЮЙТЕ ТОКЕН!** (Більше не побачите)
7. **Використайте як пароль при git push**

---

### КРОК 4: Увімкнення GitHub Pages

1. **Відкрийте репозиторій:**
   ```
   https://github.com/ВАШ_USERNAME/ikarden-website
   ```

2. **Перейдіть у Settings** (вгорі)

3. **Знайдіть Pages** (ліворуч в меню)

4. **Налаштуйте:**
   ```
   Source: Deploy from a branch
   
   Branch:
   ☑ main
   📁 / (root)
   
   [Save]
   ```

5. **Зачекайте 1-2 хвилини**

6. **Оновіть сторінку** - побачите:
   ```
   ✅ Your site is live at:
   https://ВАШ_USERNAME.github.io/ikarden-website/
   ```

---

## 🌍 ВАШ САЙТ ОНЛАЙН!

### URL сайту:
```
https://ВАШ_USERNAME.github.io/ikarden-website/
```

### Контакт:
```
📧 ikardengroup@gmail.com
```

---

## ✏️ ЯК ОНОВЛЮВАТИ САЙТ

### Варіант 1: Автоматично
```
1. Змініть файли
2. Двічі клікніть update-site.bat
3. Введіть опис змін
4. ГОТОВО!
```

### Варіант 2: Через GitHub онлайн
```
1. GitHub → знайдіть файл
2. Натисніть олівець (Edit)
3. Змініть код
4. Commit changes
5. ГОТОВО!
```

### Варіант 3: Через VS Code онлайн
```
1. GitHub → натисніть "."
2. Відкриється VS Code
3. Редагуйте файли
4. Source Control → Commit → Push
5. ГОТОВО!
```

### Варіант 4: Вручну через термінал
```bash
cd C:\Users\ivank\muscle-diary\ikarden-website

git add .
git commit -m "Опис змін"
git push

# Сайт оновиться через 1-2 хвилини!
```

---

## 🎯 КОРИСНІ КОМАНДИ

### Перевірити статус:
```bash
git status
```

### Подивитись історію:
```bash
git log --oneline
```

### Скасувати зміни:
```bash
git reset --hard HEAD
```

### Повернутись до попередньої версії:
```bash
git log  # знайдіть hash коміту
git reset --hard HASH
git push --force
```

### Подивитись різницю:
```bash
git diff
```

---

## 🔧 ВИРІШЕННЯ ПРОБЛЕМ

### Проблема: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/ikarden-website.git
```

### Проблема: "failed to push"
```bash
git pull origin main
git push origin main
```

### Проблема: "Permission denied"
```
Використайте Personal Access Token як пароль!
```

### Проблема: "Сайт не оновлюється"
```
1. Перевірте GitHub Actions (вкладка Actions)
2. Очистіть кеш браузера (Ctrl + Shift + R)
3. Зачекайте 5 хвилин
```

---

## 🌐 ПІДКЛЮЧЕННЯ СВОГО ДОМЕНУ (опціонально)

Якщо маєте домен (наприклад, ikarden.cz):

### 1. У налаштуваннях домену:
```
Додайте A Records:
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153

Додайте CNAME:
www → ВАШ_USERNAME.github.io
```

### 2. На GitHub → Settings → Pages:
```
Custom domain: ikarden.cz
☑ Enforce HTTPS
[Save]
```

### 3. Зачекайте 24 години для DNS

### 4. Сайт буде на ikarden.cz! 🎉

---

## 📊 GOOGLE ANALYTICS (опціонально)

### 1. Створіть акаунт:
```
https://analytics.google.com
```

### 2. Отримайте Tracking ID:
```
G-XXXXXXXXXX
```

### 3. Додайте в index.html перед </head>:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 4. Commit → Push

### 5. Статистика з'явиться через 24 години!

---

## 💡 ПОРАДИ

### ✅ РОБІТЬ:
```
✓ Регулярні бекапи (GitHub автоматично)
✓ Описові коміти
✓ Тестування локально перед push
✓ Оновлення контенту регулярно
```

### ❌ НЕ РОБІТЬ:
```
✗ Великі файли (>100MB)
✗ Конфіденційні дані в коді
✗ Push без тестування
✗ Розміщення паролів в коді
```

---

## 📞 ДОПОМОГА

### Документація GitHub Pages:
```
https://docs.github.com/pages
```

### Git документація:
```
https://git-scm.com/doc
```

### Контакт:
```
📧 ikardengroup@gmail.com
```

---

## ✅ ЧЕКЛИСТ

```
☐ Створено GitHub репозиторій
☐ Код завантажено на GitHub
☐ GitHub Pages увімкнено
☐ Сайт доступний онлайн
☐ Перевірено на телефоні
☐ Додано Google Analytics (опціонально)
☐ Підключено домен (опціонально)
☐ Протестовано оновлення сайту
```

---

## 🎉 ГОТОВО!

**ФАЙЛИ ДЛЯ ДЕПЛОЮ:**
```
✅ setup-and-deploy.bat ........ Автоматичний деплой
✅ update-site.bat ............. Оновлення сайту
✅ README.md ................... Документація
✅ .gitignore .................. Git конфігурація
```

**ВАШІ ДІЇ:**
```
1. Двічі клік → setup-and-deploy.bat
2. Слідуйте інструкціям
3. ВАШ САЙТ ОНЛАЙН! 🌍
```

**КОНТАКТ:**
```
📧 ikardengroup@gmail.com
🌐 https://ВАШ_USERNAME.github.io/ikarden-website/
```

---

**Створено: 6 березня 2026**
**Статус: ✅ ГОТОВО ДО ДЕПЛОЮ**

🎊 ВІТАЄМО! ВАШ САЙТ МАЙЖЕ В ІНТЕРНЕТІ! 🎊
