@echo off
chcp 65001 > nul
color 0A
title IKARDEN GIT - Головне меню

:MENU
cls
echo ═══════════════════════════════════════════════════════════
echo   🔄 IKARDEN E-SHOP - GIT УПРАВЛІННЯ
echo ═══════════════════════════════════════════════════════════
echo.
echo   Поточна директорія: %CD%
echo.
echo ═══════════════════════════════════════════════════════════
echo   ГОЛОВНЕ МЕНЮ:
echo ═══════════════════════════════════════════════════════════
echo.
echo   [1] 💾 ЗБЕРЕГТИ поточну версію
echo   [2] 📊 ПЕРЕГЛЯНУТИ історію збережень
echo   [3] 🔄 ВІДНОВИТИ до попередньої версії
echo   [4] 📋 СТАТУС проекту
echo   [5] 🏷️  СТВОРИТИ мітку версії (tag)
echo   [6] 📚 ВІДКРИТИ Git інструкцію
echo   [0] ❌ ВИХІД
echo.
echo ═══════════════════════════════════════════════════════════
echo.
set /p choice="Виберіть дію (0-6): "

if "%choice%"=="1" goto SAVE
if "%choice%"=="2" goto LOG
if "%choice%"=="3" goto RESTORE
if "%choice%"=="4" goto STATUS
if "%choice%"=="5" goto TAG
if "%choice%"=="6" goto GUIDE
if "%choice%"=="0" goto EXIT
goto MENU

:SAVE
cls
echo ═══════════════════════════════════════════════════════════
echo   💾 ЗБЕРЕЖЕННЯ ПОТОЧНОЇ ВЕРСІЇ
echo ═══════════════════════════════════════════════════════════
echo.
cd /d "C:\Users\ivank\muscle-diary\ikarden-website"

echo 📋 Файли що будуть збережені:
echo ───────────────────────────────────────────────────────────
git status --short
echo.

set /p message="📝 Введіть опис змін: "
if "%message%"=="" set message=Збережено зміни

echo.
echo 📝 Додавання файлів...
git add -A

echo 💾 Створення збереження...
git commit -m "%message%"

echo.
echo ✅ ЗБЕРЕЖЕНО!
echo.
echo 📊 Останні 3 збереження:
git log --oneline -3
echo.
pause
goto MENU

:LOG
cls
echo ═══════════════════════════════════════════════════════════
echo   📊 ІСТОРІЯ ЗБЕРЕЖЕНЬ
echo ═══════════════════════════════════════════════════════════
echo.
cd /d "C:\Users\ivank\muscle-diary\ikarden-website"

git log --oneline --graph --all --decorate
echo.
echo ───────────────────────────────────────────────────────────
echo 💡 Перші 7 символів = HASH версії для відновлення
echo.
pause
goto MENU

:RESTORE
cls
echo ═══════════════════════════════════════════════════════════
echo   🔄 ВІДНОВЛЕННЯ ДО ПОПЕРЕДНЬОЇ ВЕРСІЇ
echo ═══════════════════════════════════════════════════════════
echo.
echo ⚠️  УВАГА! Незбережені зміни будуть втрачені!
echo.
cd /d "C:\Users\ivank\muscle-diary\ikarden-website"

echo 📊 ДОСТУПНІ ВЕРСІЇ:
echo ───────────────────────────────────────────────────────────
git log --oneline -10
echo.

set /p hash="📝 Введіть HASH версії (7 символів): "
if "%hash%"=="" (
    echo ❌ Не введено hash!
    pause
    goto MENU
)

echo.
echo 🔄 Відновлення до версії %hash%...
git checkout %hash% .

echo.
echo ✅ ГОТОВО! Файли відновлені
echo.
echo 💡 Щоб зберегти відновлену версію - виберіть пункт [1]
echo 💡 Щоб повернутись до останньої - введіть: git checkout main .
echo.
pause
goto MENU

:STATUS
cls
echo ═══════════════════════════════════════════════════════════
echo   📋 СТАТУС ПРОЕКТУ
echo ═══════════════════════════════════════════════════════════
echo.
cd /d "C:\Users\ivank\muscle-diary\ikarden-website"

git status
echo.
echo ───────────────────────────────────────────────────────────
echo 💡 Зелені файли = готові до збереження
echo 💡 Червоні файли = змінені але не додані
echo.
pause
goto MENU

:TAG
cls
echo ═══════════════════════════════════════════════════════════
echo   🏷️ СТВОРЕННЯ МІТКИ ВЕРСІЇ
echo ═══════════════════════════════════════════════════════════
echo.
cd /d "C:\Users\ivank\muscle-diary\ikarden-website"

echo 📋 Існуючі мітки:
git tag
echo.

set /p tagname="📝 Введіть назву мітки (наприклад: v1.0.0): "
if "%tagname%"=="" (
    echo ❌ Не введено назву!
    pause
    goto MENU
)

set /p tagmsg="📝 Опис мітки: "
if "%tagmsg%"=="" set tagmsg=Version %tagname%

git tag -a %tagname% -m "%tagmsg%"

echo.
echo ✅ Мітку %tagname% створено!
echo.
echo 📋 Всі мітки:
git tag
echo.
pause
goto MENU

:GUIDE
cls
echo ═══════════════════════════════════════════════════════════
echo   📚 ВІДКРИТТЯ GIT ІНСТРУКЦІЇ
echo ═══════════════════════════════════════════════════════════
echo.
start notepad "C:\Users\ivank\muscle-diary\ikarden-website\GIT-GUIDE.md"
echo ✅ Інструкція відкрита в Notepad
echo.
pause
goto MENU

:EXIT
cls
echo ═══════════════════════════════════════════════════════════
echo   👋 ДО ПОБАЧЕННЯ!
echo ═══════════════════════════════════════════════════════════
echo.
echo   Дякую за використання IKarden Git Manager!
echo.
timeout /t 2 > nul
exit

