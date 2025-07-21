# MySQL Installation Script for Windows
# Run this script as Administrator

Write-Host "=== MySQL Installation Helper ===" -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script requires Administrator privileges. Please run PowerShell as Administrator." -ForegroundColor Red
    exit 1
}

# Option 1: Try to install via Chocolatey
Write-Host "Checking if Chocolatey is available..." -ForegroundColor Yellow
try {
    choco --version
    Write-Host "Chocolatey found! Installing MySQL..." -ForegroundColor Green
    choco install mysql --version=8.0.35 -y
    Write-Host "MySQL installation completed via Chocolatey!" -ForegroundColor Green
} catch {
    Write-Host "Chocolatey not available. Please install MySQL manually." -ForegroundColor Yellow
    
    # Option 2: Download MySQL Installer
    Write-Host "Opening MySQL download page..." -ForegroundColor Yellow
    Start-Process "https://dev.mysql.com/downloads/installer/"
    
    Write-Host @"
=== Manual Installation Steps ===
1. Download: mysql-installer-community-8.0.35.0.msi
2. Run the installer
3. Choose 'Developer Default' setup type
4. Set root password to: password
5. Keep default port: 3306
6. Start MySQL as Windows Service

After installation, run this command to test:
mysql -u root -p
"@ -ForegroundColor Cyan
}

# Check if MySQL service exists
Write-Host "Checking for MySQL service..." -ForegroundColor Yellow
$service = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
if ($service) {
    Write-Host "MySQL service found: $($service.Name) - Status: $($service.Status)" -ForegroundColor Green
    if ($service.Status -ne "Running") {
        Write-Host "Starting MySQL service..." -ForegroundColor Yellow
        Start-Service $service.Name
    }
} else {
    Write-Host "MySQL service not found. Please complete the installation first." -ForegroundColor Red
}

Write-Host "=== Next Steps ===" -ForegroundColor Green
Write-Host "1. Ensure MySQL is installed and running" -ForegroundColor White
Write-Host "2. Test connection: mysql -u root -p" -ForegroundColor White
Write-Host "3. Run the migration script" -ForegroundColor White
Write-Host "4. Restart your Spring Boot application" -ForegroundColor White
