package com.financialmanagement.service;

import com.financialmanagement.model.Income;
import com.financialmanagement.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    public Map<String, Object> createIncome(Long userId, BigDecimal amount, String source, LocalDate date, String description) {
        Map<String, Object> response = new HashMap<>();

        try {
            Income income = new Income(userId, amount, source, date, description);
            Income savedIncome = incomeRepository.save(income);

            response.put("success", true);
            response.put("message", "Income created successfully");
            response.put("income", createIncomeResponse(savedIncome));

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to create income: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> getAllIncomes(Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Income> incomes = incomeRepository.findByUserId(userId);
            BigDecimal totalIncome = incomeRepository.getTotalIncomeByUserId(userId);

            response.put("success", true);
            response.put("incomes", incomes.stream().map(this::createIncomeResponse).toList());
            response.put("totalIncome", totalIncome);
            response.put("count", incomes.size());

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch incomes: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> getIncomeById(Long incomeId, Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Income> incomeOpt = incomeRepository.findByIdAndUserId(incomeId, userId);
            
            if (incomeOpt.isPresent()) {
                response.put("success", true);
                response.put("income", createIncomeResponse(incomeOpt.get()));
            } else {
                response.put("success", false);
                response.put("message", "Income not found");
            }

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch income: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> updateIncome(Long incomeId, Long userId, BigDecimal amount, String source, LocalDate date, String description) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Income> existingIncomeOpt = incomeRepository.findByIdAndUserId(incomeId, userId);
            
            if (existingIncomeOpt.isPresent()) {
                Income existingIncome = existingIncomeOpt.get();
                existingIncome.setAmount(amount);
                existingIncome.setSource(source);
                existingIncome.setDate(date);
                existingIncome.setDescription(description);

                Income updatedIncome = incomeRepository.save(existingIncome);

                response.put("success", true);
                response.put("message", "Income updated successfully");
                response.put("income", createIncomeResponse(updatedIncome));
            } else {
                response.put("success", false);
                response.put("message", "Income not found");
            }

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to update income: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> deleteIncome(Long incomeId, Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            incomeRepository.deleteByIdAndUserId(incomeId, userId);
            response.put("success", true);
            response.put("message", "Income deleted successfully");

        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to delete income: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> getIncomesByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Income> incomes = incomeRepository.findByUserIdAndDateRange(userId, startDate, endDate);
            BigDecimal totalIncome = incomeRepository.getTotalIncomeByUserIdAndDateRange(userId, startDate, endDate);

            response.put("success", true);
            response.put("incomes", incomes.stream().map(this::createIncomeResponse).toList());
            response.put("totalIncome", totalIncome);
            response.put("count", incomes.size());
            response.put("dateRange", Map.of("startDate", startDate, "endDate", endDate));

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch incomes: " + e.getMessage());
        }

        return response;
    }

    private Map<String, Object> createIncomeResponse(Income income) {
        Map<String, Object> incomeResponse = new HashMap<>();
        incomeResponse.put("id", income.getId());
        incomeResponse.put("amount", income.getAmount());
        incomeResponse.put("source", income.getSource());
        incomeResponse.put("date", income.getDate());
        incomeResponse.put("description", income.getDescription());
        incomeResponse.put("createdAt", income.getCreatedAt());
        incomeResponse.put("updatedAt", income.getUpdatedAt());
        return incomeResponse;
    }
}
