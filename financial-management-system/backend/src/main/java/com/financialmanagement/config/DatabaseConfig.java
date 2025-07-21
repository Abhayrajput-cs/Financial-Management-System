package com.financialmanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class DatabaseConfig {
    
    // This class can be used for any database-specific configurations
    // Currently using default Spring Boot auto-configuration
    
    @Profile("mysql")
    public static class MySQLConfig {
        // MySQL specific configurations can go here
    }
    
    @Profile("h2")
    public static class H2Config {
        // H2 specific configurations can go here
    }
}
