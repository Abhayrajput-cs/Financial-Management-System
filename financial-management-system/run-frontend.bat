@echo off
echo Starting Financial Management Frontend...
echo.

cd frontend

echo Installing dependencies (if needed)...
npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Dependencies installed successfully! Starting the development server...
    echo.
    echo The application will be available at:
    echo - Frontend: http://localhost:5173
    echo - Make sure the backend is running on http://localhost:8080
    echo.
    echo Press Ctrl+C to stop the development server
    echo.
    npm run dev
) else (
    echo.
    echo Failed to install dependencies. Please check the error messages above.
    echo.
    echo Common issues:
    echo 1. Node.js not installed or not in PATH
    echo 2. Network connectivity issues
    echo 3. Permission issues
    echo.
    pause
)
