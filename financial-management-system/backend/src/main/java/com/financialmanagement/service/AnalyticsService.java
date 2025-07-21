package com.financialmanagement.service;

import com.financialmanagement.repository.ExpenseRepository;
import com.financialmanagement.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public Map<String, Object> getOverallSummary(Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            BigDecimal totalIncome = incomeRepository.getTotalIncomeByUserId(userId);
            BigDecimal totalExpenses = expenseRepository.getTotalExpenseByUserId(userId);
            BigDecimal currentBalance = totalIncome.subtract(totalExpenses);

            Map<String, Object> summary = new HashMap<>();
            summary.put("totalIncome", totalIncome);
            summary.put("totalExpenses", totalExpenses);
            summary.put("currentBalance", currentBalance);
            summary.put("savingsRate", calculateSavingsRate(totalIncome, totalExpenses));

            response.put("success", true);
            response.put("summary", summary);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch overall summary: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> getCategoryBreakdown(Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Map<String, Object>> categoryData = expenseRepository.getExpensesByCategory(userId);
            BigDecimal totalExpenses = expenseRepository.getTotalExpenseByUserId(userId);

            // Calculate percentages for pie chart
            List<Map<String, Object>> categoryBreakdown = new ArrayList<>();
            for (Map<String, Object> category : categoryData) {
                Map<String, Object> categoryInfo = new HashMap<>();
                BigDecimal amount = (BigDecimal) category.get("total_amount");
                String categoryName = (String) category.get("category");
                Integer count = (Integer) category.get("count");

                categoryInfo.put("category", categoryName);
                categoryInfo.put("amount", amount);
                categoryInfo.put("count", count);
                
                if (totalExpenses.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal percentage = amount.divide(totalExpenses, 4, BigDecimal.ROUND_HALF_UP)
                                                 .multiply(BigDecimal.valueOf(100));
                    categoryInfo.put("percentage", percentage);
                } else {
                    categoryInfo.put("percentage", BigDecimal.ZERO);
                }

                categoryBreakdown.add(categoryInfo);
            }

            response.put("success", true);
            response.put("categoryBreakdown", categoryBreakdown);
            response.put("totalExpenses", totalExpenses);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch category breakdown: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> getMonthlySummary(Long userId, Integer year) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (year == null) {
                year = LocalDate.now().getYear();
            }

            List<Map<String, Object>> monthlyData = new ArrayList<>();

            for (int month = 1; month <= 12; month++) {
                YearMonth yearMonth = YearMonth.of(year, month);
                LocalDate startDate = yearMonth.atDay(1);
                LocalDate endDate = yearMonth.atEndOfMonth();

                BigDecimal monthlyIncome = incomeRepository.getTotalIncomeByUserIdAndDateRange(userId, startDate, endDate);
                BigDecimal monthlyExpenses = expenseRepository.getTotalExpenseByUserIdAndDateRange(userId, startDate, endDate);
                BigDecimal monthlyBalance = monthlyIncome.subtract(monthlyExpenses);

                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", month);
                monthData.put("monthName", yearMonth.getMonth().name());
                monthData.put("year", year);
                monthData.put("income", monthlyIncome);
                monthData.put("expenses", monthlyExpenses);
                monthData.put("balance", monthlyBalance);
                monthData.put("savingsRate", calculateSavingsRate(monthlyIncome, monthlyExpenses));

                monthlyData.add(monthData);
            }

            // Calculate yearly totals
            BigDecimal yearlyIncome = monthlyData.stream()
                .map(m -> (BigDecimal) m.get("income"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal yearlyExpenses = monthlyData.stream()
                .map(m -> (BigDecimal) m.get("expenses"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            Map<String, Object> yearlyTotals = new HashMap<>();
            yearlyTotals.put("year", year);
            yearlyTotals.put("totalIncome", yearlyIncome);
            yearlyTotals.put("totalExpenses", yearlyExpenses);
            yearlyTotals.put("totalBalance", yearlyIncome.subtract(yearlyExpenses));
            yearlyTotals.put("averageMonthlySavingsRate", calculateSavingsRate(yearlyIncome, yearlyExpenses));

            response.put("success", true);
            response.put("monthlyData", monthlyData);
            response.put("yearlyTotals", yearlyTotals);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch monthly summary: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> getRecentTransactionsSummary(Long userId, Integer days) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (days == null) {
                days = 30; // Default to last 30 days
            }

            LocalDate endDate = LocalDate.now();
            LocalDate startDate = endDate.minusDays(days);

            BigDecimal recentIncome = incomeRepository.getTotalIncomeByUserIdAndDateRange(userId, startDate, endDate);
            BigDecimal recentExpenses = expenseRepository.getTotalExpenseByUserIdAndDateRange(userId, startDate, endDate);
            BigDecimal recentBalance = recentIncome.subtract(recentExpenses);

            Map<String, Object> recentSummary = new HashMap<>();
            recentSummary.put("period", days + " days");
            recentSummary.put("startDate", startDate);
            recentSummary.put("endDate", endDate);
            recentSummary.put("income", recentIncome);
            recentSummary.put("expenses", recentExpenses);
            recentSummary.put("balance", recentBalance);
            recentSummary.put("savingsRate", calculateSavingsRate(recentIncome, recentExpenses));

            response.put("success", true);
            response.put("recentSummary", recentSummary);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch recent transactions summary: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> getIncomeVsExpensesTrend(Long userId, Integer months) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (months == null) {
                months = 6; // Default to last 6 months
            }

            List<Map<String, Object>> trendData = new ArrayList<>();
            LocalDate currentDate = LocalDate.now();

            for (int i = months - 1; i >= 0; i--) {
                YearMonth yearMonth = YearMonth.from(currentDate.minusMonths(i));
                LocalDate startDate = yearMonth.atDay(1);
                LocalDate endDate = yearMonth.atEndOfMonth();

                BigDecimal monthlyIncome = incomeRepository.getTotalIncomeByUserIdAndDateRange(userId, startDate, endDate);
                BigDecimal monthlyExpenses = expenseRepository.getTotalExpenseByUserIdAndDateRange(userId, startDate, endDate);

                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", yearMonth.getMonth().name());
                monthData.put("year", yearMonth.getYear());
                monthData.put("income", monthlyIncome);
                monthData.put("expenses", monthlyExpenses);
                monthData.put("difference", monthlyIncome.subtract(monthlyExpenses));

                trendData.add(monthData);
            }

            response.put("success", true);
            response.put("trendData", trendData);
            response.put("period", months + " months");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch income vs expenses trend: " + e.getMessage());
        }

        return response;
    }

    private BigDecimal calculateSavingsRate(BigDecimal income, BigDecimal expenses) {
        if (income.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal savings = income.subtract(expenses);
        return savings.divide(income, 4, BigDecimal.ROUND_HALF_UP)
                     .multiply(BigDecimal.valueOf(100));
    }
}
