package com.financialmanagement.service;

import com.financialmanagement.model.Expense;
import com.financialmanagement.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Map<String, Object> createExpense(Long userId, BigDecimal amount, String category, String description, LocalDate date) {
        Map<String, Object> response = new HashMap<>();

        try {
            Expense expense = new Expense(userId, amount, category, description, date);
            Expense savedExpense = expenseRepository.save(expense);

            response.put("success", true);
            response.put("message", "Expense created successfully");
            response.put("expense", createExpenseResponse(savedExpense));

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to create expense: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> getAllExpenses(Long userId, String category, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Expense> expenses;
            BigDecimal totalExpense;

            // Apply filters based on parameters
            if (category != null && startDate != null && endDate != null) {
                expenses = expenseRepository.findByUserIdAndCategoryAndDateRange(userId, category, startDate, endDate);
                totalExpense = expenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            } else if (category != null) {
                expenses = expenseRepository.findByUserIdAndCategory(userId, category);
                totalExpense = expenses.stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            } else if (startDate != null && endDate != null) {
                expenses = expenseRepository.findByUserIdAndDateRange(userId, startDate, endDate);
                totalExpense = expenseRepository.getTotalExpenseByUserIdAndDateRange(userId, startDate, endDate);
            } else {
                expenses = expenseRepository.findByUserId(userId);
                totalExpense = expenseRepository.getTotalExpenseByUserId(userId);
            }

            response.put("success", true);
            response.put("expenses", expenses.stream().map(this::createExpenseResponse).toList());
            response.put("totalExpense", totalExpense);
            response.put("count", expenses.size());

            // Add filter information to response
            Map<String, Object> filters = new HashMap<>();
            if (category != null) filters.put("category", category);
            if (startDate != null) filters.put("startDate", startDate);
            if (endDate != null) filters.put("endDate", endDate);
            if (!filters.isEmpty()) response.put("filters", filters);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch expenses: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> getExpenseById(Long expenseId, Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Expense> expenseOpt = expenseRepository.findByIdAndUserId(expenseId, userId);
            
            if (expenseOpt.isPresent()) {
                response.put("success", true);
                response.put("expense", createExpenseResponse(expenseOpt.get()));
            } else {
                response.put("success", false);
                response.put("message", "Expense not found");
            }

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch expense: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> updateExpense(Long expenseId, Long userId, BigDecimal amount, String category, String description, LocalDate date) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Expense> existingExpenseOpt = expenseRepository.findByIdAndUserId(expenseId, userId);
            
            if (existingExpenseOpt.isPresent()) {
                Expense existingExpense = existingExpenseOpt.get();
                existingExpense.setAmount(amount);
                existingExpense.setCategory(category);
                existingExpense.setDescription(description);
                existingExpense.setDate(date);

                Expense updatedExpense = expenseRepository.save(existingExpense);

                response.put("success", true);
                response.put("message", "Expense updated successfully");
                response.put("expense", createExpenseResponse(updatedExpense));
            } else {
                response.put("success", false);
                response.put("message", "Expense not found");
            }

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to update expense: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> deleteExpense(Long expenseId, Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            expenseRepository.deleteByIdAndUserId(expenseId, userId);
            response.put("success", true);
            response.put("message", "Expense deleted successfully");

        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to delete expense: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> getExpensesByCategory(Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Map<String, Object>> categoryBreakdown = expenseRepository.getExpensesByCategory(userId);
            List<String> categories = expenseRepository.getDistinctCategories(userId);

            response.put("success", true);
            response.put("categoryBreakdown", categoryBreakdown);
            response.put("categories", categories);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch category breakdown: " + e.getMessage());
        }

        return response;
    }

    private Map<String, Object> createExpenseResponse(Expense expense) {
        Map<String, Object> expenseResponse = new HashMap<>();
        expenseResponse.put("id", expense.getId());
        expenseResponse.put("amount", expense.getAmount());
        expenseResponse.put("category", expense.getCategory());
        expenseResponse.put("description", expense.getDescription());
        expenseResponse.put("date", expense.getDate());
        expenseResponse.put("createdAt", expense.getCreatedAt());
        expenseResponse.put("updatedAt", expense.getUpdatedAt());
        return expenseResponse;
    }
}
