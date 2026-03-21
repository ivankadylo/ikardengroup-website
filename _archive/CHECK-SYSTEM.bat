@echo off
title System Check
cls

echo.
echo ==============================================================
echo   SYSTEM CHECK FOR IKARDEN DEPLOY
echo ==============================================================
echo.
echo Checking your computer...
echo.

echo [1/3] Checking Git installation...
echo.

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Git is NOT installed!
    echo.
    echo Git is a program needed to upload code to GitHub.
    echo.
    echo What to do:
    echo 1. Open this link in browser:
    echo    https://git-scm.com/download/win
    echo.
    echo 2. Click "Click here to download"
    echo.
    echo 3. Install Git (click Next everywhere)
    echo.
    echo 4. Restart your computer
    echo.
    echo 5. Run this file again
    echo.
    pause
    exit /b 1
)

echo [OK] Git is installed!
git --version
echo.

echo [2/3] Checking project folder...
echo.
echo Current folder: %CD%
echo.

if not exist "index.html" (
    echo [X] index.html NOT found!
    echo.
    echo You are in the WRONG folder!
    echo.
    echo Correct folder should be:
    echo C:\Users\ivank\muscle-diary\ikarden-website
    echo.
    echo Your current folder:
    echo %CD%
    echo.
    pause
    exit /b 1
)

echo [OK] index.html found
echo.

if exist "css" (
    echo [OK] css folder found
) else (
    echo [X] css folder NOT found
)

if exist "js" (
    echo [OK] js folder found
) else (
    echo [X] js folder NOT found
)

if exist "images" (
    echo [OK] images folder found
) else (
    echo [X] images folder NOT found
)

echo.

echo [3/3] Checking Git setup...
echo.

if exist ".git" (
    echo [OK] Git is initialized
) else (
    echo [!] Git not initialized yet (will be done automatically)
)

git remote -v | findstr "origin" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] GitHub repository connected
    git remote -v
) else (
    echo [!] GitHub repository not connected yet (will be done automatically)
)

echo.
echo ==============================================================
echo   CHECK COMPLETE!
echo ==============================================================
echo.
echo If you see all [OK] marks above, you can run:
echo SIMPLE-DEPLOY.bat
echo.
echo If you see [X] marks, fix those problems first.
echo.
pause
