@echo off
title Push E-WorkForce to GitHub
echo ====================================================
echo Resetting Git Repository and Pushing Cleanly to GitHub
echo Target: https://github.com/shreyasr982-hub/E-WorkForce.git
echo ====================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git is not installed or not in system PATH.
    pause
    exit /b 1
)

echo [1/6] Removing broken APK pointers and temporary files...
del /f /q "%~dp0e_workfroce-main\Ework-clean\Ework\admin_dashboard\public\downloads\*.apk" >nul 2>nul
del /f /q "%~dp0e_workfroce-main\Ework-clean\Ework\admin_dashboard\dist\downloads\*.apk" >nul 2>nul
echo Place your real eworkforce-mobile.apk here when ready. > "%~dp0e_workfroce-main\Ework-clean\Ework\admin_dashboard\public\downloads\README.txt"

echo [2/6] Deleting old .git folder with corrupted Git LFS history...
cd /d "%~dp0"
if exist ".git" rd /s /q ".git"

echo [3/6] Initializing a brand-new, clean Git repository...
git init
git branch -M main

echo [4/6] Staging all project source files...
git add .
git commit -m "Initial commit of E-WorkForce platform"

echo [5/6] Setting remote origin...
git remote add origin https://github.com/shreyasr982-hub/E-WorkForce.git

echo [6/6] Pushing to GitHub...
git push -u origin main --force

echo.
if %ERRORLEVEL% equ 0 (
    echo ====================================================
    echo [SUCCESS] Your project is now 100%% successfully pushed to GitHub!
    echo URL: https://github.com/shreyasr982-hub/E-WorkForce
    echo ====================================================
) else (
    echo ====================================================
    echo [NOTICE] If your target repo is E-Workforce1.git, run:
    echo   git remote set-url origin https://github.com/shreyasr982-hub/E-Workforce1.git
    echo   git push -u origin main --force
    echo ====================================================
)

pause
