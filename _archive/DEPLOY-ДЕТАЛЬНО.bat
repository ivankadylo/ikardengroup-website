@echo off
chcp 65001 > nul
title IKarden Deploy - ivankadylo
color 0A
cls

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║        🌍 IKARDEN - DEPLOY TO GITHUB 🌍                      ║
echo ║                                                              ║
echo ║        Username: ivankadylo                                  ║
echo ║        Репозиторій: ikarden-website                          ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo ПОЧАТО: %date% %time%
echo.
echo ════════════════════════════════════════════════════════════════
echo  КРОК 1 з 5: Перевірка Git
echo ════════════════════════════════════════════════════════════════
echo.

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌❌❌ ПОМИЛКА: Git НЕ ВСТАНОВЛЕНО! ❌❌❌
    echo.
    echo Git - це програма для роботи з GitHub.
    echo Без неї не можна завантажити код.
    echo.
    echo 📥 ЩО РОБИТИ:
    echo.
    echo 1. Відкрийте в браузері:
    echo    https://git-scm.com/download/win
    echo.
    echo 2. Натисніть "Click here to download"
    echo.
    echo 3. Встановіть Git (всюди Next/Install)
    echo.
    echo 4. Перезапустіть комп'ютер
    echo.
    echo 5. Запустіть цей файл знову
    echo.
    pause
    exit /b 1
)

echo ✅ Git встановлено!
git --version
echo.

echo ════════════════════════════════════════════════════════════════
echo  КРОК 2 з 5: Перевірка папки проекту
echo ════════════════════════════════════════════════════════════════
echo.
echo Поточна папка: %CD%
echo.

if not exist "index.html" (
    echo.
    echo ❌❌❌ ПОМИЛКА: index.html не знайдено! ❌❌❌
    echo.
    echo Ви не в папці проекту!
    echo.
    echo Правильна папка:
    echo C:\Users\ivank\muscle-diary\ikarden-website
    echo.
    echo Поточна папка:
    echo %CD%
    echo.
    pause
    exit /b 1
)

echo ✅ Файли проекту знайдено!
echo.

echo ════════════════════════════════════════════════════════════════
echo  КРОК 3 з 5: Налаштування Git
echo ════════════════════════════════════════════════════════════════
echo.

if not exist ".git" (
    echo Ініціалізую Git...
    git init
    echo ✅ Git ініціалізовано
) else (
    echo ✅ Git вже налаштовано
)
echo.

git remote -v | findstr "origin" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Додаю GitHub репозиторій...
    git remote add origin https://github.com/ivankadylo/ikarden-website.git
    echo ✅ GitHub репозиторій додано
) else (
    echo ✅ GitHub репозиторій вже підключено
)
echo.

echo ════════════════════════════════════════════════════════════════
echo  КРОК 4 з 5: Підготовка файлів
echo ════════════════════════════════════════════════════════════════
echo.

echo Додаю файли до Git...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Помилка додавання файлів
    pause
    exit /b 1
)
echo ✅ Файли додано!
echo.

echo Створюю commit...
git commit -m "Deploy IKarden website - %date% %time:~0,5%"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Немає нових змін для commit
    echo    (це нормально якщо ви вже завантажували код раніше)
    echo.
    echo Спробуємо завантажити існуючий код...
    echo.
)

echo Налаштовую гілку main...
git branch -M main
echo ✅ Гілка main готова
echo.

echo ════════════════════════════════════════════════════════════════
echo  КРОК 5 з 5: Завантаження на GitHub
echo ════════════════════════════════════════════════════════════════
echo.
echo Завантажую код на GitHub...
echo.
echo ⚠️  УВАГА: Може попросити Username і Password!
echo.
echo Username: ivankadylo
echo Password: Personal Access Token (НЕ звичайний пароль!)
echo.
echo Якщо не маєте Token - натисніть Ctrl+C щоб зупинити,
echo і я покажу як його створити.
echo.

git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ════════════════════════════════════════════════════════════════
    echo  ❌ ПОМИЛКА ЗАВАНТАЖЕННЯ
    echo ════════════════════════════════════════════════════════════════
    echo.
    echo Найчастіші причини:
    echo.
    echo 1. НЕ СТВОРЕНО РЕПОЗИТОРІЙ на GitHub
    echo    Рішення: https://github.com/new
    echo    Назва: ikarden-website
    echo.
    echo 2. ПОТРІБЕН Personal Access Token
    echo    Рішення: https://github.com/settings/tokens/new
    echo    Виберіть: repo (всі галочки)
    echo    Використайте token як пароль
    echo.
    echo 3. НЕПРАВИЛЬНИЙ USERNAME/PASSWORD
    echo    Username: ivankadylo
    echo    Password: ваш token (НЕ звичайний пароль!)
    echo.
    pause
    exit /b 1
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║           ✅✅✅ УСПІШНО ЗАВАНТАЖЕНО! ✅✅✅                   ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Код успішно завантажено на GitHub!
echo.
echo ════════════════════════════════════════════════════════════════
echo  НАСТУПНИЙ КРОК: Увімкніть GitHub Pages
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. Відкрийте в браузері:
echo    https://github.com/ivankadylo/ikarden-website
echo.
echo 2. Натисніть Settings (вгорі)
echo.
echo 3. Ліворуч натисніть Pages
echo.
echo 4. Source: Deploy from a branch
echo    Branch: main
echo    Folder: / (root)
echo    Save
echo.
echo 5. Зачекайте 2 хвилини
echo.
echo 6. Ваш сайт буде онлайн:
echo    https://ivankadylo.github.io/ikarden-website/
echo.
echo ════════════════════════════════════════════════════════════════
echo.
pause
