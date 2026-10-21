@echo off
title Trace - Full Stack Runner
echo ========================================================
echo        Starting Trace (Server + Client)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Launching Backend Server on port 5000...
start "Trace Backend Server" cmd /k "cd /d "%~dp0server" && npm start"

echo [2/2] Launching React Frontend on port 3000...
start "Trace Frontend Client" cmd /k "cd /d "%~dp0client" && npm start"

echo.
echo Both services have been launched in separate terminal windows!
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:3000
echo.
pause
