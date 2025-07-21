@echo off
echo === MySQL Connection Test ===
echo.

echo Testing MySQL connection...
echo.

REM Test if MySQL is in PATH
mysql --version >nul 2>&1
if %errorlevel% == 0 (
    echo MySQL found in PATH!
    echo Connecting to MySQL...
    echo.
    echo Enter your MySQL root password when prompted:
    mysql -u root -p -e "SELECT 'MySQL Connection Successful!' as status; SHOW DATABASES;"
) else (
    echo MySQL not found in PATH. Trying XAMPP location...
    if exist "C:\xampp\mysql\bin\mysql.exe" (
        echo XAMPP MySQL found!
        echo Connecting to MySQL...
        echo.
        echo Press Enter when prompted for password (XAMPP default):
        "C:\xampp\mysql\bin\mysql.exe" -u root -p -e "SELECT 'MySQL Connection Successful!' as status; SHOW DATABASES;"
    ) else (
        echo MySQL not found. Please install MySQL or XAMPP first.
        echo.
        echo Installation options:
        echo 1. XAMPP: https://www.apachefriends.org/download.html
        echo 2. MySQL: https://dev.mysql.com/downloads/installer/
    )
)

echo.
pause
