package com.financialmanagement.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.financialmanagement.dto.LoginRequest;
import com.financialmanagement.dto.SignupRequest;
import com.financialmanagement.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody SignupRequest signupRequest, 
                                                     BindingResult bindingResult) {
        
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

        Map<String, Object> response = authService.registerUser(
            signupRequest.getName(),
            signupRequest.getEmail(),
            signupRequest.getPassword()
        );

        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest loginRequest,
                                                    BindingResult bindingResult) {
        
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

        Map<String, Object> response = authService.loginUser(
            loginRequest.getEmail(),
            loginRequest.getPassword()
        );

        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Authorization header missing or invalid");
            return ResponseEntity.badRequest().body(errorResponse);
        }

        String token = authHeader.substring(7);
        Map<String, Object> response = authService.getCurrentUser(token);

        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        // JWT tokens are stateless, so logout is handled client-side by removing the token
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }
}
