@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo   GIT COMMIT - IKARDEN E-SHOP v1.0.0
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "C:\Users\ivank\muscle-diary\ikarden-website"

echo 📂 Поточна директорія:
cd
echo.

echo 🔍 Перевірка Git статусу...
git status
echo.

echo 📝 Додавання всіх файлів...
git add -A
echo.

echo 💾 Створення commit...
git commit -m "v1.0.0 - Complete e-commerce site with gallery, video, discounts, custom orders and admin panel"
echo.

echo ✅ ГОТОВО! Зміни збережені в Git!
echo.
echo 📊 Історія commits:
git log --oneline -5
echo.

pause
