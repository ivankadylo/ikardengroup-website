@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo   GIT - ПЕРЕГЛЯД ІСТОРІЇ
echo ═══════════════════════════════════════════════════════════
echo.

cd /d "C:\Users\ivank\muscle-diary\ikarden-website"

echo 📊 ІСТОРІЯ ВСІХ ЗБЕРЕЖЕНЬ:
echo ═══════════════════════════════════════════════════════════
git log --oneline --graph --all --decorate
echo.

echo 📋 ДЕТАЛЬНА ІНФОРМАЦІЯ ПРО ОСТАННІЙ COMMIT:
echo ═══════════════════════════════════════════════════════════
git log -1 --stat
echo.

pause
