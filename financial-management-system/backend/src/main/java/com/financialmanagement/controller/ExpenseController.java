package com.financialmanagement.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.financialmanagement.dto.ExpenseRequest;
import com.financialmanagement.service.ExpenseService;
import com.financialmanagement.util.AuthUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/expense")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private AuthUtil authUtil;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createExpense(
            @Valid @RequestBody ExpenseRequest expenseRequest,
            BindingResult bindingResult,
            @RequestHeader("Authorization") String authHeader) {

        if (bindingResult.hasErrors()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Validation failed");
            errorResponse.put("errors", bindingResult.getFieldErrors().stream()
                .collect(Collectors.toMap(
                    error -> error.getField(),
                    error -> error.getDefaultMessage()
                )));
            return ResponseEntity.badRequest().body(errorResponse);
        }

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response = expenseService.createExpense(
                userId,
                expenseRequest.getAmount(),
                expenseRequest.getCategory(),
                expenseRequest.getDescription(),
                expenseRequest.getDate()
            );

            if ((Boolean) response.get("success")) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to create expense: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllExpenses(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response = expenseService.getAllExpenses(userId, category, startDate, endDate);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch expenses: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getExpenseById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response = expenseService.getExpenseById(id, userId);

            if ((Boolean) response.get("success")) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch expense: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest expenseRequest,
            BindingResult bindingResult,
            @RequestHeader("Authorization") String authHeader) {

        if (bindingResult.hasErrors()) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Validation failed");
            errorResponse.put("errors", bindingResult.getFieldErrors().stream()
                .collect(Collectors.toMap(
                    error -> error.getField(),
                    error -> error.getDefaultMessage()
                )));
            return ResponseEntity.badRequest().body(errorResponse);
        }

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response = expenseService.updateExpense(
                id,
                userId,
                expenseRequest.getAmount(),
                expenseRequest.getCategory(),
                expenseRequest.getDescription(),
                expenseRequest.getDate()
            );

            if ((Boolean) response.get("success")) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to update expense: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteExpense(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response = expenseService.deleteExpense(id, userId);

            if ((Boolean) response.get("success")) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete expense: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<Map<String, Object>> getExpensesByCategory(
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response = expenseService.getExpensesByCategory(userId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch category breakdown: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
