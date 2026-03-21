@echo off
chcp 65001 >nul
cls

echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║           🔄 ОНОВЛЕННЯ IKARDEN WEBSITE 🔄                ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Перехід в папку проекту
cd /d "%~dp0"

echo [1/4] Перевірка змін...
git status --short
echo.

set /p continue="❓ Продовжити оновлення? (Y/N): "
if /i not "%continue%"=="Y" (
    echo ❌ Скасовано
    pause
    exit /b 0
)

echo.
echo [2/4] Додавання файлів...
git add .
echo ✅ Файли додано

echo.
set /p commit_msg="📝 Опис змін (або Enter для автоматичного): "
if "%commit_msg%"=="" (
    set commit_msg=Оновлення сайту %date% %time%
)

echo [3/4] Створення коміту...
git commit -m "%commit_msg%"
if errorlevel 1 (
    echo ℹ️  Немає нових змін
    pause
    exit /b 0
)
echo ✅ Комміт створено

echo.
echo [4/4] Завантаження на GitHub...
git push
if errorlevel 1 (
    echo ❌ Помилка при завантаженні!
    echo 💡 Спробуйте: git pull origin main
    pause
    exit /b 1
)

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              ✅ САЙТ ОНОВЛЕНО! ✅                        ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 🌍 Сайт оновиться через 1-2 хвилини
echo 📧 Email: ikardengroup@gmail.com
echo.
pause
