# MySQL Installation and Migration Guide

## 📥 Step 1: Install MySQL Server

### Option A: MySQL Installer (Recommended)
1. **Download**: https://dev.mysql.com/downloads/installer/
2. **Choose**: `mysql-installer-community-8.0.xx.x.msi` (Windows)
3. **Run installer** and select:
   - **Setup Type**: Developer Default
   - **Root Password**: `password` (or your choice)
   - **Port**: `3306` (default)
   - **Windows Service**: ✅ Start MySQL Server at System Startup

### Option B: MySQL Workbench (GUI Tool)
- Download MySQL Workbench for easier database management
- URL: https://dev.mysql.com/downloads/workbench/

## 🔧 Step 2: Verify MySQL Installation

Open Command Prompt and run:
```cmd
mysql -u root -p
```
Enter your password when prompted.

## 🗄️ Step 3: Create Database and Tables

### Method A: Using Command Line
```sql
-- Connect to MySQL
mysql -u root -p

-- Run the migration script
source C:\Users\prash\OneDrive\Desktop\System\financial-management-system\migrate_h2_to_mysql.sql
```

### Method B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Open the file: `migrate_h2_to_mysql.sql`
4. Execute the script

## ⚙️ Step 4: Update Application Configuration

The application is already configured to use MySQL. Just update the password in:
`backend/src/main/resources/application-mysql.properties`

```properties
spring.datasource.password=your_mysql_password
```

## 🚀 Step 5: Start the Application

1. **Stop current backend** (if running)
2. **Start backend**: `mvnw.cmd spring-boot:run`
3. **Frontend should already be running** on http://localhost:5174

## 🔍 Step 6: Verify Migration

### Check Database:
```sql
USE financial_management_db;
SELECT * FROM users;
SELECT * FROM expenses;
SELECT * FROM incomes;
```

### Test Application:
1. Go to: http://localhost:5174
2. Login with: `abcd@gmail.com` / `password123`
3. Check if data appears correctly

## 🛠️ Troubleshooting

### Common Issues:
1. **Connection refused**: Make sure MySQL service is running
2. **Access denied**: Check username/password in config
3. **Database not found**: Run the migration script first

### Check MySQL Service:
```cmd
# Windows
net start mysql80

# Or check services
services.msc
```

## 📊 Database Management

### MySQL Workbench (Recommended):
- Visual interface for database management
- Query editor with syntax highlighting
- Data import/export tools

### Command Line:
```sql
-- Show databases
SHOW DATABASES;

-- Use database
USE financial_management_db;

-- Show tables
SHOW TABLES;

-- View table structure
DESCRIBE users;
```

## 🔄 Data Migration from H2

If you have existing data in H2 that you want to migrate:

1. **Export from H2**: Use H2 console to export data as SQL
2. **Import to MySQL**: Run the exported SQL in MySQL
3. **Update IDs**: Ensure auto-increment IDs are properly set

Your financial management system will now use MySQL for permanent data storage! 🎉
