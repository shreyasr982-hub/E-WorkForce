@echo off
title Ework Full Stack Development Runner
echo ====================================================
echo Starting Ework Platform (Backend + Admin Dashboard)
echo ====================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js was not found on your system or not added to PATH.
    echo Please download and install Node.js v22+ from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

node scripts/dev.js
pause
