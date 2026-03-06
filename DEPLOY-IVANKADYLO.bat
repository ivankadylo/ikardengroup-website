@echo off
chcp 65001 > nul
cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║        🌍 IKARDEN - DEPLOY TO GITHUB PAGES 🌍             ║
echo ║                                                            ║
echo ║        Username: ivankadylo                                ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📍 Папка: %CD%
echo.

REM Перевірка Git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git не встановлено!
    echo.
    echo 📥 Завантажте Git: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git встановлено
echo.

REM Перевірка remote
git remote -v | findstr "origin" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 🔗 Додаю GitHub репозиторій...
    git remote add origin https://github.com/ivankadylo/ikarden-website.git
    echo ✅ Remote додано!
    echo.
)

echo 📦 Статус файлів:
git status --short
echo.

REM Додавання файлів
echo [1/4] 📝 Додаю файли...
git add .
echo ✅ Файли додано
echo.

REM Commit
echo [2/4] 💾 Створюю commit...
git commit -m "Deploy IKarden website - %date% %time:~0,5%"
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Немає нових змін
    pause
    exit /b 0
)
echo ✅ Commit створено
echo.

REM Перевірка гілки
echo [3/4] 🌿 Налаштовую гілку main...
git branch -M main
echo ✅ Гілка: main
echo.

REM Push
echo [4/4] 🚀 Завантажую на GitHub...
echo.
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Помилка завантаження!
    echo.
    echo 🔐 Потрібна авторизація GitHub:
    echo.
    echo 1️⃣  Username: ivankadylo
    echo 2️⃣  Password: Personal Access Token
    echo.
    echo 📖 Як створити Token:
    echo     GitHub → Settings → Developer settings
    echo     Personal access tokens → Generate new token
    echo     Виберіть: repo (всі галочки)
    echo     Скопіюйте token і використайте як пароль
    echo.
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║              ✅ УСПІШНО ЗАВАНТАЖЕНО! ✅                    ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🎯 ТЕПЕР УВІМКНІТЬ GITHUB PAGES:
echo.
echo 1️⃣  Відкрийте:
echo     https://github.com/ivankadylo/ikarden-website
echo.
echo 2️⃣  Натисніть Settings (вгорі)
echo.
echo 3️⃣  Ліворуч знайдіть Pages
echo.
echo 4️⃣  Source: Deploy from a branch
echo     Branch: main
echo     Folder: / (root)
echo     Save
echo.
echo ⏱️  Через 1-2 хвилини сайт буде онлайн:
echo.
echo 🌐 https://ivankadylo.github.io/ikarden-website/
echo.
echo 🎉 ГОТОВО!
echo.
pause
