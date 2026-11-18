@echo off
title Ework APK Cleanup Tool
echo ====================================================
echo Cleaning up duplicate APKs...
echo Keeping ONLY 1 canonical APK in admin_dashboard/public/downloads/
echo ====================================================
echo.

set "PUBLIC_OLD=%~dp0e_workfroce-main\Ework-clean\Ework\admin_dashboard\public\downloads\eworkforce.apk"
set "DIST_OLD=%~dp0e_workfroce-main\Ework-clean\Ework\admin_dashboard\dist\downloads\eworkforce.apk"
set "DIST_MOBILE=%~dp0e_workfroce-main\Ework-clean\Ework\admin_dashboard\dist\downloads\eworkforce-mobile.apk"
set "CANONICAL_APK=%~dp0e_workfroce-main\Ework-clean\Ework\admin_dashboard\public\downloads\eworkforce-mobile.apk"

if exist "%PUBLIC_OLD%" (
    del /f /q "%PUBLIC_OLD%"
    echo [REMOVED] %PUBLIC_OLD%
)

if exist "%DIST_OLD%" (
    del /f /q "%DIST_OLD%"
    echo [REMOVED] %DIST_OLD%
)

if exist "%DIST_MOBILE%" (
    del /f /q "%DIST_MOBILE%"
    echo [REMOVED] %DIST_MOBILE%
)

echo.
echo ====================================================
if exist "%CANONICAL_APK%" (
    echo [SUCCESS] Exactly 1 APK file exists in this project:
    echo %CANONICAL_APK%
) else (
    echo [WARNING] Please put your APK file into:
    echo %CANONICAL_APK%
)
echo ====================================================
echo.
pause
