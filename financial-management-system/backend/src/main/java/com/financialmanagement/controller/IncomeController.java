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

import com.financialmanagement.dto.IncomeRequest;
import com.financialmanagement.service.IncomeService;
import com.financialmanagement.util.AuthUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/income")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    @Autowired
    private AuthUtil authUtil;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createIncome(
            @Valid @RequestBody IncomeRequest incomeRequest,
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
            Map<String, Object> response = incomeService.createIncome(
                userId,
                incomeRequest.getAmount(),
                incomeRequest.getSource(),
                incomeRequest.getDate(),
                incomeRequest.getDescription()
            );

            if ((Boolean) response.get("success")) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to create income: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllIncomes(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response;

            if (startDate != null && endDate != null) {
                response = incomeService.getIncomesByDateRange(userId, startDate, endDate);
            } else {
                response = incomeService.getAllIncomes(userId);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch incomes: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getIncomeById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response = incomeService.getIncomeById(id, userId);

            if ((Boolean) response.get("success")) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch income: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateIncome(
            @PathVariable Long id,
            @Valid @RequestBody IncomeRequest incomeRequest,
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
            Map<String, Object> response = incomeService.updateIncome(
                id,
                userId,
                incomeRequest.getAmount(),
                incomeRequest.getSource(),
                incomeRequest.getDate(),
                incomeRequest.getDescription()
            );

            if ((Boolean) response.get("success")) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to update income: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteIncome(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response = incomeService.deleteIncome(id, userId);

            if ((Boolean) response.get("success")) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to delete income: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
