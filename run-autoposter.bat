@echo off
REM =====================================================
REM BharatOne Spaces — Auto Blog Poster
REM Usage: 
REM   run-autoposter.bat       (generates 1 article)
REM   run-autoposter.bat 10    (generates 10 articles)
REM =====================================================

set COUNT=%1
if "%COUNT%"=="" set COUNT=10

echo.
echo   Starting BharatOne Auto-Poster (%COUNT% articles)...
echo.

cd /d "%~dp0"

REM Log to file as well as show on screen
echo === Auto-Poster Run: %date% %time% (Count: %COUNT%) === >> auto-poster-output.log
node auto-poster.js --count=%COUNT% >> auto-poster-output.log 2>&1

echo.
echo   Done!== Auto-poster run complete! Check auto-poster-output.log for details
