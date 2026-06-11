@echo off
cls
setlocal enabledelayedexpansion

echo ========================================
echo    Auto-Commit Loop (Ctrl+C to stop)
echo    Delay: 60 seconds between cycles
echo ========================================
echo.

:loop
set timestamp=%date% %time%
echo [!timestamp!] Cycle starting...

git pull >nul 2>&1
git add --all

git diff --cached --quiet
if errorlevel 1 (
    echo [!timestamp!] Changes found - committing...
    git commit -m "auto commit !timestamp!"
    git push
    echo [!timestamp!] Push complete!
) else (
    echo [!timestamp!] No changes detected.
)

echo Waiting 60 seconds...
timeout /t 60 /nobreak >nul
cls
goto loop