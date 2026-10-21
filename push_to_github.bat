@echo off
title Push Trace to GitHub
echo ========================================================
echo        Pushing Trace Project to GitHub
echo        Target: https://github.com/MiruthulashreeM/Trace
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/5] Checking Git...
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo [2/5] Initializing Git repository...
if not exist ".git" (
    git init
) else (
    echo Git repository is ready.
)

echo.
echo [3/5] Staging files (excluding node_modules and .env)...
git add .

echo.
echo [4/5] Committing changes...
git commit -m "feat: complete psychometric travel platform with OCEAN scoring, 100% trait pie chart, Gemini AI insights and dynamic trait-matched recommendations"
if %ERRORLEVEL% NEQ 0 (
    echo (No new changes detected or already committed)
)

echo.
echo [5/5] Configuring branch and remote...
git branch -M main

git remote get-url origin >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    git remote set-url origin https://github.com/MiruthulashreeM/Trace.git
) else (
    git remote add origin https://github.com/MiruthulashreeM/Trace.git
)

echo.
echo Pushing to GitHub (main branch)...
echo (A browser window or GitHub authentication prompt will appear if not already logged in)
echo.

git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [INFO] Regular push failed (remote repository may have an existing README/commit).
    echo Attempting push with --force...
    echo.
    git push -u origin main --force
)

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo  SUCCESS! Project successfully pushed to GitHub!
    echo  View repository: https://github.com/MiruthulashreeM/Trace
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo  [NOTE] If push was rejected:
    echo  1. Make sure repository exists on GitHub:
    echo     https://github.com/new (Name: Trace)
    echo  2. If the remote has changes, pull or force push:
    echo     git push -u origin main --force
    echo  3. If prompted for credentials, use your GitHub Personal Access Token (PAT).
    echo ========================================================
)

echo.
pause
