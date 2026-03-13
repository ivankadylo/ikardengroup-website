@echo off
title IKarden - Оновлення сайту
color 0A
cls

echo.
echo =====================================================
echo   IKARDEN - ОНОВЛЕННЯ САЙТУ
echo =====================================================
echo.

cd /d "%~dp0"

echo Завантажую всі зміни на GitHub...
echo.

git add .
git commit -m "Site update %date% %time%"
git push

echo.
echo =====================================================
echo   ГОТОВО! Сайт оновиться за 2-3 хвилини!
echo   https://ikardengroup.com
echo =====================================================
echo.
pause
