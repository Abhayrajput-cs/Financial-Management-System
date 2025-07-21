package com.financialmanagement.config;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.financialmanagement.model.Expense;
import com.financialmanagement.model.Income;
import com.financialmanagement.model.User;
import com.financialmanagement.repository.ExpenseRepository;
import com.financialmanagement.repository.IncomeRepository;
import com.financialmanagement.repository.UserRepository;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("DataLoader: Checking for existing data...");

        // Check if test user exists, if not create it
        if (!userRepository.existsByEmail("test@example.com")) {
            System.out.println("DataLoader: Creating test user with sample data...");
            createTestUserWithSampleData();
        }

        // Check if any existing users need sample data
        checkAndAddSampleDataForExistingUsers();

        System.out.println("DataLoader: Initialization completed!");
    }

    private void checkAndAddSampleDataForExistingUsers() {
        try {
            // Check if abcd@gmail.com user exists and has no expenses, add sample data
            if (userRepository.existsByEmail("abcd@gmail.com")) {
                User user = userRepository.findByEmail("abcd@gmail.com").orElse(null);
                if (user != null) {
                    // Check if user has any expenses
                    if (expenseRepository.findByUserId(user.getId()).isEmpty()) {
                        System.out.println("DataLoader: Adding sample data for user: " + user.getEmail());
                        createSampleIncomes(user.getId());
                        createSampleExpenses(user.getId());
                        System.out.println("DataLoader: Sample data added for user: " + user.getEmail());
                    } else {
                        System.out.println("DataLoader: User " + user.getEmail() + " already has expense data.");
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("DataLoader: Error checking existing users: " + e.getMessage());
        }
    }

    private void createTestUserWithSampleData() {
        try {
            // Create test user
            User testUser = new User();
            testUser.setName("Test User");
            testUser.setEmail("test@example.com");
            testUser.setPasswordHash(passwordEncoder.encode("password"));

            User savedUser = userRepository.save(testUser);
            System.out.println("DataLoader: Created test user: " + savedUser.getEmail() + " with ID: " + savedUser.getId());

            // Create sample incomes
            createSampleIncomes(savedUser.getId());

            // Create sample expenses
            createSampleExpenses(savedUser.getId());

            System.out.println("DataLoader: Sample data created for test user!");
        } catch (Exception e) {
            System.err.println("DataLoader: Error creating test user: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void createSampleIncomes(Long userId) {
        Income[] incomes = {
            new Income(userId, new BigDecimal("5000.00"), "Salary", LocalDate.now().minusDays(30), "Monthly salary"),
            new Income(userId, new BigDecimal("1500.00"), "Freelance", LocalDate.now().minusDays(25), "Web development project"),
            new Income(userId, new BigDecimal("5000.00"), "Salary", LocalDate.now().minusDays(60), "Previous month salary"),
            new Income(userId, new BigDecimal("800.00"), "Bonus", LocalDate.now().minusDays(45), "Performance bonus"),
            new Income(userId, new BigDecimal("2000.00"), "Investment", LocalDate.now().minusDays(20), "Stock dividends"),
            new Income(userId, new BigDecimal("1200.00"), "Freelance", LocalDate.now().minusDays(15), "Logo design project"),
            new Income(userId, new BigDecimal("300.00"), "Other", LocalDate.now().minusDays(10), "Sold old laptop"),
            new Income(userId, new BigDecimal("5000.00"), "Salary", LocalDate.now().minusDays(90), "Two months ago salary")
        };

        for (Income income : incomes) {
            incomeRepository.save(income);
        }
        
        System.out.println("Created " + incomes.length + " sample income entries");
    }

    private void createSampleExpenses(Long userId) {
        Expense[] expenses = {
            // Housing
            new Expense(userId, new BigDecimal("1200.00"), "Housing", "Monthly rent", LocalDate.now().minusDays(30)),
            new Expense(userId, new BigDecimal("1200.00"), "Housing", "Monthly rent", LocalDate.now().minusDays(60)),
            new Expense(userId, new BigDecimal("150.00"), "Utilities", "Electricity bill", LocalDate.now().minusDays(28)),
            new Expense(userId, new BigDecimal("80.00"), "Utilities", "Water bill", LocalDate.now().minusDays(25)),
            new Expense(userId, new BigDecimal("60.00"), "Utilities", "Internet bill", LocalDate.now().minusDays(22)),
            
            // Food & Dining
            new Expense(userId, new BigDecimal("400.00"), "Food & Dining", "Groceries", LocalDate.now().minusDays(27)),
            new Expense(userId, new BigDecimal("45.00"), "Food & Dining", "Restaurant dinner", LocalDate.now().minusDays(20)),
            new Expense(userId, new BigDecimal("25.00"), "Food & Dining", "Coffee shop", LocalDate.now().minusDays(18)),
            new Expense(userId, new BigDecimal("35.00"), "Food & Dining", "Lunch", LocalDate.now().minusDays(15)),
            new Expense(userId, new BigDecimal("200.00"), "Food & Dining", "Weekly groceries", LocalDate.now().minusDays(12)),
            new Expense(userId, new BigDecimal("50.00"), "Food & Dining", "Pizza delivery", LocalDate.now().minusDays(8)),
            
            // Transportation
            new Expense(userId, new BigDecimal("120.00"), "Transportation", "Monthly bus pass", LocalDate.now().minusDays(30)),
            new Expense(userId, new BigDecimal("45.00"), "Transportation", "Gas", LocalDate.now().minusDays(20)),
            new Expense(userId, new BigDecimal("25.00"), "Transportation", "Uber ride", LocalDate.now().minusDays(14)),
            new Expense(userId, new BigDecimal("35.00"), "Transportation", "Parking fees", LocalDate.now().minusDays(10)),
            
            // Entertainment
            new Expense(userId, new BigDecimal("15.00"), "Entertainment", "Netflix subscription", LocalDate.now().minusDays(30)),
            new Expense(userId, new BigDecimal("25.00"), "Entertainment", "Movie tickets", LocalDate.now().minusDays(16)),
            new Expense(userId, new BigDecimal("40.00"), "Entertainment", "Concert tickets", LocalDate.now().minusDays(12)),
            new Expense(userId, new BigDecimal("20.00"), "Entertainment", "Video games", LocalDate.now().minusDays(8)),
            
            // Shopping
            new Expense(userId, new BigDecimal("80.00"), "Shopping", "Clothing", LocalDate.now().minusDays(24)),
            new Expense(userId, new BigDecimal("150.00"), "Shopping", "Electronics", LocalDate.now().minusDays(18)),
            new Expense(userId, new BigDecimal("30.00"), "Shopping", "Books", LocalDate.now().minusDays(14)),
            new Expense(userId, new BigDecimal("45.00"), "Shopping", "Home supplies", LocalDate.now().minusDays(9)),
            
            // Healthcare
            new Expense(userId, new BigDecimal("200.00"), "Healthcare", "Doctor visit", LocalDate.now().minusDays(35)),
            new Expense(userId, new BigDecimal("50.00"), "Healthcare", "Pharmacy", LocalDate.now().minusDays(21)),
            new Expense(userId, new BigDecimal("30.00"), "Healthcare", "Vitamins", LocalDate.now().minusDays(11)),
            
            // Personal Care
            new Expense(userId, new BigDecimal("40.00"), "Personal Care", "Haircut", LocalDate.now().minusDays(26)),
            new Expense(userId, new BigDecimal("25.00"), "Personal Care", "Skincare products", LocalDate.now().minusDays(17)),
            
            // Education
            new Expense(userId, new BigDecimal("100.00"), "Education", "Online course", LocalDate.now().minusDays(32)),
            new Expense(userId, new BigDecimal("60.00"), "Education", "Technical books", LocalDate.now().minusDays(19)),
            
            // Bills & Utilities (additional)
            new Expense(userId, new BigDecimal("45.00"), "Bills & Utilities", "Phone bill", LocalDate.now().minusDays(29)),
            new Expense(userId, new BigDecimal("25.00"), "Bills & Utilities", "Streaming services", LocalDate.now().minusDays(23)),
            
            // Insurance
            new Expense(userId, new BigDecimal("180.00"), "Insurance", "Health insurance", LocalDate.now().minusDays(31)),
            new Expense(userId, new BigDecimal("120.00"), "Insurance", "Car insurance", LocalDate.now().minusDays(61)),
            
            // Miscellaneous
            new Expense(userId, new BigDecimal("75.00"), "Other", "Gift for friend", LocalDate.now().minusDays(13)),
            new Expense(userId, new BigDecimal("20.00"), "Other", "Charity donation", LocalDate.now().minusDays(7)),
            new Expense(userId, new BigDecimal("15.00"), "Other", "Bank fees", LocalDate.now().minusDays(5))
        };

        for (Expense expense : expenses) {
            expenseRepository.save(expense);
        }
        
        System.out.println("Created " + expenses.length + " sample expense entries");
    }
}
