-- Test MySQL Connection and Setup
-- Run this after installing MySQL to verify everything works

-- Test 1: Check MySQL version
SELECT VERSION() as mysql_version;

-- Test 2: Show current databases
SHOW DATABASES;

-- Test 3: Create and use our database
CREATE DATABASE IF NOT EXISTS financial_management_db;
USE financial_management_db;

-- Test 4: Show current database
SELECT DATABASE() as current_database;

-- Test 5: Create a simple test table
CREATE TABLE IF NOT EXISTS connection_test (
    id INT AUTO_INCREMENT PRIMARY KEY,
    test_message VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test 6: Insert test data
INSERT INTO connection_test (test_message) VALUES ('MySQL connection successful!');

-- Test 7: Query test data
SELECT * FROM connection_test;

-- Test 8: Clean up test table
DROP TABLE connection_test;

-- Success message
SELECT 'MySQL is ready for Financial Management System!' as status;
