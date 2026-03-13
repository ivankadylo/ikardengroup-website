@echo off
title IKarden - Редагування товарів
color 0A
cls

echo.
echo =====================================================
echo   IKARDEN - РЕДАГУВАННЯ ТОВАРІВ
echo =====================================================
echo.
echo Відкриваю файл з товарами у Notepad...
echo.

start notepad "js\products-data.js"

echo Файл відкрився у Notepad!
echo.
echo =====================================================
echo   ЯК РЕДАГУВАТИ:
echo =====================================================
echo.
echo 1. Змінюй name: "Назва товару"
echo 2. Змінюй price: 12000  (тільки цифри!)
echo 3. Змінюй description: "Опис"
echo 4. Збережи файл: Ctrl+S
echo 5. Поверніся сюди і натисни ENTER
echo.
echo =====================================================
echo.
pause

echo.
echo Завантажую зміни на сайт...
echo.

cd /d "%~dp0"

git add js/products-data.js
git commit -m "Update products data"
git push

echo.
echo =====================================================
echo   ГОТОВО! Сайт оновиться за 2-3 хвилини!
echo   Перевір: https://ikardengroup.com
echo =====================================================
echo.
pause
