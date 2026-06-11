@echo off
cls
echo Auto-commit loop started. Press Ctrl+C to stop.
echo.

:loop
echo [%date% %time%] Checking for updates...

REM Pull latest changes
git pull

REM Add all changes
git add --all

REM Only commit if there are changes
git diff --cached --quiet
if errorlevel 1 (
    echo Changes detected, committing...
    git commit -m "auto commit %date% %time%"
    echo Pushing to GitHub...
    git push
) else (
    echo No changes to commit.
)

REM Wait 60 seconds before next check (optional)
timeout /t 60 /nobreak >nul

goto loop