@echo off
title Complete Fix and Push to GitHub
echo ====================================================
echo Removing broken Git LFS pointers and pushing cleanly
echo Target: https://github.com/shreyasr982-hub/E-WorkForce.git
echo ====================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git is not installed or not in system PATH.
    pause
    exit /b 1
)

echo [1/6] Removing fake Git LFS pointer APKs...
del /f /q "%~dp0e_workfroce-main\Ework-clean\Ework\admin_dashboard\public\downloads\*.apk" >nul 2>nul
del /f /q "%~dp0e_workfroce-main\Ework-clean\Ework\admin_dashboard\dist\downloads\*.apk" >nul 2>nul

echo [2/6] Adding downloads README placeholder...
echo Place your real eworkforce-mobile.apk here when ready. > "%~dp0e_workfroce-main\Ework-clean\Ework\admin_dashboard\public\downloads\README.txt"

echo [3/6] Unstaging any cached APKs from Git...
git rm --cached -r -f *.apk >nul 2>nul
git rm --cached -r -f **/*.apk >nul 2>nul

echo [4/6] Creating a fresh clean branch with zero broken LFS objects...
git checkout --orphan main_clean >nul 2>nul
git add -A
git commit -m "Initial commit: E-WorkForce Full Platform"

echo [5/6] Resetting main branch...
git branch -D main >nul 2>nul
git branch -m main

echo [6/6] Pushing cleanly to GitHub...
git remote set-url origin https://github.com/shreyasr982-hub/E-WorkForce.git 2>nul || git remote add origin https://github.com/shreyasr982-hub/E-WorkForce.git
git push --force -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo ====================================================
    echo [SUCCESS] Your repository is now 100%% successfully pushed!
    echo URL: https://github.com/shreyasr982-hub/E-WorkForce
    echo ====================================================
) else (
    echo ====================================================
    echo [NOTICE] If you want to push to E-Workforce1.git instead, run:
    echo   git remote set-url origin https://github.com/shreyasr982-hub/E-Workforce1.git
    echo   git push --force -u origin main
    echo ====================================================
)

pause
