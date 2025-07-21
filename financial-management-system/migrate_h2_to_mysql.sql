-- Migration Script: H2 to MySQL
-- Run this script after installing MySQL and creating the database

-- Step 1: Create database (run this first)
CREATE DATABASE IF NOT EXISTS financial_management_db;
USE financial_management_db;

-- Step 2: Create tables with proper MySQL syntax
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incomes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    source VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 3: Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_incomes_user_id ON incomes(user_id);
CREATE INDEX idx_incomes_date ON incomes(date);
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);

-- Step 4: Insert sample data (optional - remove if you want to migrate real data)
-- Sample user
INSERT IGNORE INTO users (name, email, password_hash, created_at, updated_at) VALUES
('Test User', 'test@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW()),
('Your User', 'abcd@gmail.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW());

-- Sample expenses (adjust user_id based on actual user IDs)
INSERT IGNORE INTO expenses (user_id, amount, category, description, date, created_at, updated_at) VALUES
(2, 1200.00, 'Housing', 'Monthly rent', CURDATE() - INTERVAL 5 DAY, NOW(), NOW()),
(2, 400.00, 'Food & Dining', 'Groceries', CURDATE() - INTERVAL 4 DAY, NOW(), NOW()),
(2, 150.00, 'Utilities', 'Electricity bill', CURDATE() - INTERVAL 3 DAY, NOW(), NOW()),
(2, 45.00, 'Food & Dining', 'Restaurant dinner', CURDATE() - INTERVAL 2 DAY, NOW(), NOW()),
(2, 80.00, 'Transportation', 'Gas', CURDATE() - INTERVAL 1 DAY, NOW(), NOW()),
(2, 25.00, 'Entertainment', 'Movie tickets', CURDATE(), NOW(), NOW());

-- Sample income (adjust user_id based on actual user IDs)
INSERT IGNORE INTO incomes (user_id, amount, source, date, description, created_at, updated_at) VALUES
(2, 5000.00, 'Salary', CURDATE() - INTERVAL 30 DAY, 'Monthly salary', NOW(), NOW()),
(2, 1500.00, 'Freelance', CURDATE() - INTERVAL 10 DAY, 'Web development project', NOW(), NOW()),
(2, 800.00, 'Bonus', CURDATE() - INTERVAL 5 DAY, 'Performance bonus', NOW(), NOW());

-- Step 5: Verify data
SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Expenses' as table_name, COUNT(*) as record_count FROM expenses
UNION ALL
SELECT 'Incomes' as table_name, COUNT(*) as record_count FROM incomes;
