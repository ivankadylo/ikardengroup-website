@echo off
chcp 65001 > nul
cls
echo.
echo ════════════════════════════════════════════════════════════
echo     ПЕРЕВІРКА СИСТЕМИ
echo ════════════════════════════════════════════════════════════
echo.
echo [1/3] Перевірка Git...
echo.

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git НЕ ВСТАНОВЛЕНО!
    echo.
    echo Git - це програма для роботи з кодом.
    echo Без неї не можна завантажити код на GitHub.
    echo.
    echo 📥 ТРЕБА ВСТАНОВИТИ Git:
    echo.
    echo 1. Відкрийте цю адресу в браузері:
    echo    https://git-scm.com/download/win
    echo.
    echo 2. Завантажте Git для Windows
    echo.
    echo 3. Встановіть (всюди натискайте Next)
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

echo [2/3] Перевірка папки...
echo.
echo Поточна папка: %CD%
echo.

if not exist ".git" (
    echo ⚠️  Папка .git не знайдена!
    echo Ініціалізую Git...
    git init
    echo ✅ Git ініціалізовано
) else (
    echo ✅ Git вже налаштовано
)
echo.

echo [3/3] Перевірка файлів...
echo.

if exist "index.html" (
    echo ✅ index.html знайдено
) else (
    echo ❌ index.html НЕ ЗНАЙДЕНО!
    echo Перевірте що ви в правильній папці!
)

if exist "css" (
    echo ✅ папка css знайдена
) else (
    echo ❌ папка css НЕ ЗНАЙДЕНА!
)

if exist "js" (
    echo ✅ папка js знайдена
) else (
    echo ❌ папка js НЕ ЗНАЙДЕНА!
)

echo.
echo ════════════════════════════════════════════════════════════
echo     ПЕРЕВІРКА ЗАВЕРШЕНА
echo ════════════════════════════════════════════════════════════
echo.
pause
