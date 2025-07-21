# Database Setup Guide

This project supports both H2 (in-memory) and MySQL databases. H2 is configured by default for easy development.

## Option 1: H2 Database (Recommended for Development)

### ✅ Already Configured!
The project is pre-configured to use H2 database, which requires no additional setup.

### Features:
- **No installation required** - H2 runs in memory
- **Web console** - Access at `http://localhost:8080/api/h2-console`
- **Sample data** - Pre-loaded with test users and transactions
- **Fast startup** - Perfect for development and testing

### H2 Console Access:
1. Start the Spring Boot application
2. Open browser to `http://localhost:8080/api/h2-console`
3. Use these connection details:
   - **JDBC URL**: `jdbc:h2:mem:financial_management_db`
   - **Username**: `sa`
   - **Password**: (leave empty)

## Option 2: MySQL Database (Production)

### Installation:
1. **Download MySQL**: https://dev.mysql.com/downloads/mysql/
2. **Install MySQL Server** with these settings:
   - Port: 3306
   - Username: root
   - Password: password (or update in application.properties)

### Setup Steps:
1. **Create Database**:
   ```sql
   CREATE DATABASE financial_management_db;
   ```

2. **Switch to MySQL Configuration**:
   - Rename `application.properties` to `application-h2.properties`
   - Rename `application-mysql.properties` to `application.properties`
   - Or use Spring profiles: `--spring.profiles.active=mysql`

3. **Update Connection Details** in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/financial_management_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### MySQL Schema:
The `schema.sql` file will automatically create all required tables:
- `users` - User accounts and authentication
- `incomes` - Income tracking with sources and dates
- `expenses` - Expense tracking with categories
- Indexes for optimal performance

## Switching Between Databases

### To use H2 (default):
```bash
mvn spring-boot:run
```

### To use MySQL:
```bash
mvn spring-boot:run -Dspring.profiles.active=mysql
```

## Database Schema

### Users Table:
- `id` (Primary Key)
- `name` (User's full name)
- `email` (Unique login identifier)
- `password_hash` (Encrypted password)
- `created_at`, `updated_at` (Timestamps)

### Incomes Table:
- `id` (Primary Key)
- `user_id` (Foreign Key to users)
- `amount` (Income amount)
- `source` (Income source description)
- `date` (Income date)
- `description` (Optional details)
- `created_at`, `updated_at` (Timestamps)

### Expenses Table:
- `id` (Primary Key)
- `user_id` (Foreign Key to users)
- `amount` (Expense amount)
- `category` (Expense category)
- `description` (Expense details)
- `date` (Expense date)
- `created_at`, `updated_at` (Timestamps)

## Sample Data

The H2 configuration includes sample data:
- **Test User**: test@example.com / password
- **Sample Incomes**: Salary and freelance income
- **Sample Expenses**: Rent, groceries, utilities, transportation

This allows you to test the application immediately without manual data entry.

## Troubleshooting

### H2 Console Not Accessible:
- Ensure application is running on port 8080
- Check that H2 console is enabled in application.properties
- Try: `http://localhost:8080/api/h2-console`

### MySQL Connection Issues:
- Verify MySQL service is running
- Check username/password in application.properties
- Ensure database `financial_management_db` exists
- Verify port 3306 is not blocked by firewall

### Schema Not Created:
- Check `spring.sql.init.mode=always` in properties
- Verify schema file path in `spring.sql.init.schema-locations`
- Check application logs for SQL errors
