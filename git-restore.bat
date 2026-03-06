@echo off
chcp 65001 > nul
echo ═══════════════════════════════════════════════════════════
echo   GIT - ВІДНОВЛЕННЯ ДО ПОПЕРЕДНЬОЇ ВЕРСІЇ
echo ═══════════════════════════════════════════════════════════
echo.
echo ⚠️  УВАГА! Ця команда скасує всі незбережені зміни!
echo.

cd /d "C:\Users\ivank\muscle-diary\ikarden-website"

echo 📊 ДОСТУПНІ ВЕРСІЇ:
echo ═══════════════════════════════════════════════════════════
git log --oneline -10
echo.

set /p COMMIT_HASH="📝 Введіть HASH версії (7 символів) для відновлення: "

if "%COMMIT_HASH%"=="" (
    echo ❌ Не введено hash!
    pause
    exit /b 1
)

echo.
echo 🔄 Відновлення до версії %COMMIT_HASH%...
git checkout %COMMIT_HASH% .

echo.
echo ✅ ГОТОВО! Файли відновлені до версії %COMMIT_HASH%
echo.
echo 💡 Щоб повернутись до останньої версії, запустіть:
echo    git checkout main .
echo.

pause
