package com.financialmanagement.service;

import com.financialmanagement.model.User;
import com.financialmanagement.repository.UserRepository;
import com.financialmanagement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    public Map<String, Object> registerUser(String name, String email, String password) {
        Map<String, Object> response = new HashMap<>();

        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            response.put("success", false);
            response.put("message", "User with this email already exists");
            return response;
        }

        // Create new user
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));

        try {
            User savedUser = userRepository.save(user);
            
            // Generate JWT token
            String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getId());

            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("token", token);
            response.put("user", createUserResponse(savedUser));
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to register user: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> loginUser(String email, String password) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );

            // Get user details
            User user = userDetailsService.getUserByEmail(email);

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail(), user.getId());

            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("user", createUserResponse(user));

        } catch (BadCredentialsException e) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Login failed: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> getCurrentUser(String token) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.extractUsername(token);
                User user = userDetailsService.getUserByEmail(email);

                response.put("success", true);
                response.put("user", createUserResponse(user));
            } else {
                response.put("success", false);
                response.put("message", "Invalid or expired token");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to get user: " + e.getMessage());
        }

        return response;
    }

    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("name", user.getName());
        userResponse.put("email", user.getEmail());
        userResponse.put("createdAt", user.getCreatedAt());
        return userResponse;
    }
}
