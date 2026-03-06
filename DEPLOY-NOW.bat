@echo off
chcp 65001 > nul
cls
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║        🌍 IKARDEN WEBSITE - DEPLOY TO GITHUB 🌍           ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📍 Поточна папка: %CD%
echo.

REM Перевірка чи є Git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Git не встановлено!
    echo.
    echo 📥 Завантажте Git:
    echo    https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✅ Git встановлено
echo.

REM Перевірка чи є remote origin
git remote -v | findstr "origin" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Remote origin не налаштовано
    echo.
    echo 📝 ІНСТРУКЦІЯ:
    echo.
    echo 1️⃣  Створіть репозиторій на GitHub:
    echo     👉 https://github.com/new
    echo.
    echo     Назва: ikarden-website
    echo     Тип: Public
    echo     ☑ Без README, без .gitignore
    echo.
    echo 2️⃣  Скопіюйте URL репозиторію
    echo     Приклад: https://github.com/USERNAME/ikarden-website.git
    echo.
    set /p github_url="📎 Вставте URL вашого репозиторію: "
    
    if "%github_url%"=="" (
        echo ❌ URL не може бути порожнім!
        pause
        exit /b 1
    )
    
    echo.
    echo 🔗 Додаю remote origin...
    git remote add origin %github_url%
    
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Помилка додавання remote!
        pause
        exit /b 1
    )
    
    echo ✅ Remote додано!
    echo.
)

echo 📦 Поточний статус:
echo.
git status --short
echo.

REM Додавання файлів
echo [1/4] 📝 Додаю файли до Git...
git add .

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Помилка додавання файлів!
    pause
    exit /b 1
)
echo ✅ Файли додано
echo.

REM Створення коміту
echo [2/4] 💾 Створюю commit...
set /p commit_msg="📝 Опис змін (Enter = автоматичний): "

if "%commit_msg%"=="" (
    set commit_msg=Update website - %date% %time:~0,5%
)

git commit -m "%commit_msg%"

if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Немає змін для commit або помилка
    echo.
    git status
    pause
    exit /b 0
)
echo ✅ Commit створено
echo.

REM Перевірка гілки
echo [3/4] 🌿 Перевіряю гілку...
git branch -M main
echo ✅ Гілка: main
echo.

REM Push на GitHub
echo [4/4] 🚀 Завантажую на GitHub...
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Помилка завантаження!
    echo.
    echo 🔐 Можливі причини:
    echo     • Потрібна авторизація
    echo     • Використайте Personal Access Token як пароль
    echo     • Або налаштуйте Git Credential Manager
    echo.
    echo 📖 Детальніше:
    echo     https://docs.github.com/en/authentication
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
echo 🌐 Тепер увімкніть GitHub Pages:
echo.
echo 1️⃣  Відкрийте: https://github.com/ВАШ_USERNAME/ikarden-website
echo 2️⃣  Settings → Pages
echo 3️⃣  Source: Deploy from a branch
echo 4️⃣  Branch: main → / (root) → Save
echo.
echo ⏱️  Через 1-2 хвилини сайт буде онлайн!
echo.
echo 🔗 URL: https://ВАШ_USERNAME.github.io/ikarden-website/
echo.
pause
