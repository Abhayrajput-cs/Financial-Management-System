package com.financialmanagement.util;

import com.financialmanagement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    @Autowired
    private JwtUtil jwtUtil;

    public Long getUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization header");
        }
        
        String token = authHeader.substring(7);
        return jwtUtil.extractUserId(token);
    }

    public String getUsernameFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization header");
        }
        
        String token = authHeader.substring(7);
        return jwtUtil.extractUsername(token);
    }

    public boolean isValidToken(String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return false;
            }
            
            String token = authHeader.substring(7);
            return jwtUtil.validateToken(token);
        } catch (Exception e) {
            return false;
        }
    }
}
