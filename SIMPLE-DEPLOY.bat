@echo off
title IKarden Deploy
cls

echo.
echo ==============================================================
echo   IKARDEN DEPLOY TO GITHUB
echo   Username: ivankadylo
echo ==============================================================
echo.
echo Step 1/5: Checking Git...
echo.

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Git is NOT installed!
    echo.
    echo You need to install Git first:
    echo https://git-scm.com/download/win
    echo.
    echo Download, install, restart computer, then run this again.
    echo.
    pause
    exit /b 1
)

echo OK! Git is installed
git --version
echo.

echo ==============================================================
echo Step 2/5: Checking project folder...
echo ==============================================================
echo.
echo Current folder: %CD%
echo.

if not exist "index.html" (
    echo.
    echo ERROR: index.html not found!
    echo Wrong folder!
    echo.
    echo You need to be in:
    echo C:\Users\ivank\muscle-diary\ikarden-website
    echo.
    pause
    exit /b 1
)

echo OK! Project files found
echo.

echo ==============================================================
echo Step 3/5: Setting up Git...
echo ==============================================================
echo.

if not exist ".git" (
    echo Initializing Git...
    git init
    echo OK!
) else (
    echo Git already initialized
)
echo.

git remote -v | findstr "origin" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Adding GitHub repository...
    git remote add origin https://github.com/ivankadylo/ikarden-website.git
    echo OK!
) else (
    echo GitHub repository already connected
)
echo.

echo ==============================================================
echo Step 4/5: Preparing files...
echo ==============================================================
echo.

echo Adding files to Git...
git add .
echo OK!
echo.

echo Creating commit...
git commit -m "Deploy IKarden website"
if %ERRORLEVEL% NEQ 0 (
    echo No new changes to commit (this is OK)
)
echo.

echo Setting main branch...
git branch -M main
echo OK!
echo.

echo ==============================================================
echo Step 5/5: Uploading to GitHub...
echo ==============================================================
echo.
echo WARNING: You may need to enter credentials:
echo.
echo Username: ivankadylo
echo Password: Personal Access Token (NOT regular password!)
echo.
echo If you don't have a token, press Ctrl+C to stop
echo and I will show you how to create one.
echo.
pause
echo.

git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ==============================================================
    echo ERROR: Upload failed!
    echo ==============================================================
    echo.
    echo Common reasons:
    echo.
    echo 1. Repository not created on GitHub
    echo    Go to: https://github.com/new
    echo    Name: ikarden-website
    echo.
    echo 2. Need Personal Access Token
    echo    Go to: https://github.com/settings/tokens/new
    echo    Select: repo (all checkboxes)
    echo    Use token as password
    echo.
    echo 3. Wrong credentials
    echo    Username: ivankadylo
    echo    Password: your token (NOT regular password)
    echo.
    pause
    exit /b 1
)

echo.
echo ==============================================================
echo SUCCESS! Code uploaded to GitHub!
echo ==============================================================
echo.
echo Next step: Enable GitHub Pages
echo.
echo 1. Open in browser:
echo    https://github.com/ivankadylo/ikarden-website
echo.
echo 2. Click Settings (top menu)
echo.
echo 3. Click Pages (left menu)
echo.
echo 4. Configure:
echo    Source: Deploy from a branch
echo    Branch: main
echo    Folder: / (root)
echo    Save
echo.
echo 5. Wait 2 minutes
echo.
echo 6. Your site will be online at:
echo    https://ivankadylo.github.io/ikarden-website/
echo.
echo ==============================================================
echo.
pause
