package com.financialmanagement.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.financialmanagement.service.AnalyticsService;
import com.financialmanagement.util.AuthUtil;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private AuthUtil authUtil;

    @GetMapping("/overall-summary")
    public ResponseEntity<Map<String, Object>> getOverallSummary(
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response = analyticsService.getOverallSummary(userId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch overall summary: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/category-breakdown")
    public ResponseEntity<Map<String, Object>> getCategoryBreakdown(
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response = analyticsService.getCategoryBreakdown(userId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch category breakdown: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/monthly-summary")
    public ResponseEntity<Map<String, Object>> getMonthlySummary(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer year) {

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response = analyticsService.getMonthlySummary(userId, year);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch monthly summary: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/recent-summary")
    public ResponseEntity<Map<String, Object>> getRecentTransactionsSummary(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer days) {

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response = analyticsService.getRecentTransactionsSummary(userId, days);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch recent summary: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/income-vs-expenses-trend")
    public ResponseEntity<Map<String, Object>> getIncomeVsExpensesTrend(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer months) {

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            Map<String, Object> response = analyticsService.getIncomeVsExpensesTrend(userId, months);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch trend data: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData(
            @RequestHeader("Authorization") String authHeader) {

        try {
            Long userId = authUtil.getUserIdFromToken(authHeader);
            
            // Combine multiple analytics for dashboard
            Map<String, Object> dashboardData = new HashMap<>();
            
            Map<String, Object> overallSummary = analyticsService.getOverallSummary(userId);
            Map<String, Object> categoryBreakdown = analyticsService.getCategoryBreakdown(userId);
            Map<String, Object> recentSummary = analyticsService.getRecentTransactionsSummary(userId, 30);
            Map<String, Object> trendData = analyticsService.getIncomeVsExpensesTrend(userId, 6);

            dashboardData.put("success", true);
            dashboardData.put("overallSummary", overallSummary.get("summary"));
            dashboardData.put("categoryBreakdown", categoryBreakdown.get("categoryBreakdown"));
            dashboardData.put("recentSummary", recentSummary.get("recentSummary"));
            dashboardData.put("trendData", trendData.get("trendData"));

            return ResponseEntity.ok(dashboardData);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch dashboard data: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
