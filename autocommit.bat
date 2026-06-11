@echo off
cls
:loop
git pull
git add --all
git commit -m "auto commit"
git push
goto loop