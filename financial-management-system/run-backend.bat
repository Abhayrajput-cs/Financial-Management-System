@echo off
echo Starting Financial Management Backend...
echo.
echo Note: This requires Maven to be installed.
echo If Maven is not installed, please install it from: https://maven.apache.org/download.cgi
echo.

cd backend

echo Compiling the application...
mvn clean compile

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Compilation successful! Starting the application...
    echo.
    echo The application will be available at:
    echo - API Base URL: http://localhost:8080/api
    echo - H2 Database Console: http://localhost:8080/api/h2-console
    echo.
    echo Press Ctrl+C to stop the application
    echo.
    mvn spring-boot:run
) else (
    echo.
    echo Compilation failed. Please check the error messages above.
    echo.
    echo Common issues:
    echo 1. Maven not installed or not in PATH
    echo 2. Java version compatibility (requires Java 17+)
    echo 3. Missing dependencies
    echo.
    pause
)
