@echo off
echo ========================================
echo    DEPLOY IKARDEN WEBSITE TO GITHUB
echo ========================================
echo.

REM Перехід в папку проекту
cd /d C:\Users\ivank\muscle-diary\ikarden-website

echo [1/5] Додавання файлів...
git add .

echo [2/5] Створення коміту...
set /p commit_msg="Введіть опис змін: "
git commit -m "%commit_msg%"

echo [3/5] Перевірка remote...
git remote -v | findstr origin >nul 2>&1
if errorlevel 1 (
    echo Remote origin не знайдено!
    set /p github_url="Введіть URL репозиторію (https://github.com/USERNAME/ikarden-website.git): "
    git remote add origin %github_url%
    git branch -M main
)

echo [4/5] Завантаження на GitHub...
git push -u origin main

echo [5/5] Готово!
echo.
echo ========================================
echo    САЙТ ОНОВЛЕНО!
echo ========================================
echo.
echo Перевірте сайт через 1-2 хвилини на:
echo https://ВАШ_USERNAME.github.io/ikarden-website/
echo.
pause
