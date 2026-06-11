@echo off
echo Iniciando SEM-Web-Advisor...

echo [1/2] Iniciando Backend (FastAPI)...
cd backend
start cmd /k "python -m uvicorn app.main:app --reload --port 8000"
cd ..

echo [2/2] Iniciando Frontend (React/Vite)...
cd frontend
start cmd /k "npm run dev"
cd ..

echo.
echo ========================================================
echo Los servidores estan arrancando en nuevas ventanas.
echo.
echo Backend API : http://localhost:8000/docs
echo Frontend UI : http://localhost:5173
echo ========================================================
echo.
pause
