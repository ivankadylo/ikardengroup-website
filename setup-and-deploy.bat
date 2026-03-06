@echo off
chcp 65001 >nul
cls

echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║       🚀 IKARDEN WEBSITE - АВТОМАТИЧНИЙ ДЕПЛОЙ 🚀       ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Перехід в папку проекту
cd /d "%~dp0"

echo [1/8] Перевірка Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git не встановлено!
    echo.
    echo 📥 Завантажте Git: https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
)
echo ✅ Git встановлено

echo.
echo [2/8] Ініціалізація Git репозиторію...
if not exist ".git" (
    git init
    git branch -M main
    echo ✅ Репозиторій ініціалізовано
) else (
    echo ✅ Репозиторій вже існує
)

echo.
echo [3/8] Додавання файлів...
git add .
echo ✅ Файли додано

echo.
echo [4/8] Створення коміту...
git commit -m "Initial commit - IKarden website ready for production" >nul 2>&1
if errorlevel 1 (
    echo ℹ️  Немає нових змін для коміту
) else (
    echo ✅ Комміт створено
)

echo.
echo [5/8] Налаштування GitHub remote...
echo.
echo 📝 ІНСТРУКЦІЯ:
echo    1. Відкрийте https://github.com/new
echo    2. Назва репозиторію: ikarden-website
echo    3. Public (публічний)
echo    4. НЕ додавайте README, .gitignore, license
echo    5. Create repository
echo    6. Скопіюйте URL репозиторію
echo.

set /p github_url="📋 Вставте URL репозиторію (https://github.com/USERNAME/ikarden-website.git): "

REM Перевірка чи remote вже існує
git remote -v | findstr origin >nul 2>&1
if not errorlevel 1 (
    echo ℹ️  Remote origin вже існує, оновлюю...
    git remote remove origin
)

git remote add origin %github_url%
echo ✅ Remote додано

echo.
echo [6/8] Завантаження на GitHub...
echo ⏳ Це може зайняти хвилину...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Помилка при завантаженні!
    echo.
    echo 💡 МОЖЛИВІ ПРИЧИНИ:
    echo    1. Неправильний URL репозиторію
    echo    2. Проблема з авторизацією
    echo    3. Репозиторій не порожній
    echo.
    echo 🔐 ДЛЯ АВТОРИЗАЦІЇ використайте Personal Access Token:
    echo    1. GitHub → Settings → Developer settings
    echo    2. Personal access tokens → Tokens (classic)
    echo    3. Generate new token
    echo    4. Виберіть: repo (всі галочки)
    echo    5. Generate token
    echo    6. Скопіюйте токен
    echo    7. Використайте його як пароль при push
    echo.
    pause
    exit /b 1
)

echo ✅ Код завантажено на GitHub!

echo.
echo [7/8] Налаштування GitHub Pages...
echo.
echo 📝 ВИКОНАЙТЕ ЦІ КРОКИ НА GITHUB:
echo.
echo    1. Відкрийте ваш репозиторій на GitHub
echo    2. Перейдіть: Settings (вгорі)
echo    3. Знайдіть: Pages (ліворуч в меню)
echo    4. Source: Deploy from a branch
echo    5. Branch: виберіть "main" → "/ (root)"
echo    6. Натисніть "Save"
echo    7. Зачекайте 1-2 хвилини
echo.
pause

echo.
echo [8/8] Готово!
echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              ✅ САЙТ УСПІШНО РОЗМІЩЕНО! ✅              ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 🌍 Ваш сайт буде доступний через 1-2 хвилини на:
echo.

REM Витягнути username з URL
for /f "tokens=4 delims=/:." %%a in ("%github_url%") do set username=%%a
echo    https://%username%.github.io/ikarden-website/
echo.
echo 📧 Email: ikardengroup@gmail.com
echo.
echo 💡 КОРИСНІ КОМАНДИ:
echo    - Оновити сайт: запустіть update-site.bat
echo    - Переглянути історію: git log
echo    - Скасувати зміни: git reset --hard
echo.
echo 🎉 ВІТАЄМО! САЙТ В ІНТЕРНЕТІ!
echo.
pause
