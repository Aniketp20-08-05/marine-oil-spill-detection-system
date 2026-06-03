@echo off
title Marine Oil Spill Detection System - Local Launcher
echo =======================================================================
echo   LAUNCHING MARINE OIL SPILL DETECTION SYSTEM (LOCAL DEMO ENVIRONMENT)
echo =======================================================================
echo.
echo [1/3] Starting FastAPI Backend Service in a new window...
start "Marine Backend" powershell -NoExit -Command "cd backend; .venv\Scripts\activate; python -m uvicorn app.main:app --reload"

echo.
echo [2/3] Starting Next.js Frontend Service in a new window...
start "Marine Frontend" powershell -NoExit -Command "cd frontend; npm run dev"

echo.
echo [3/3] Launching web browser at http://localhost:3000 in 15 seconds...
timeout /t 15 >nul
start http://localhost:3000

echo.
echo =======================================================================
echo   System launched successfully! 
echo   Please keep both terminal windows open during your presentation.
echo =======================================================================
echo.
pause
