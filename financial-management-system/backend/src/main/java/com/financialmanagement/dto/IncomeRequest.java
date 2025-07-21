package com.financialmanagement.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class IncomeRequest {
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;
    
    @NotBlank(message = "Source is required")
    @Size(max = 100, message = "Source must not exceed 100 characters")
    private String source;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    // Constructors
    public IncomeRequest() {}

    public IncomeRequest(BigDecimal amount, String source, LocalDate date, String description) {
        this.amount = amount;
        this.source = source;
        this.date = date;
        this.description = description;
    }

    // Getters and Setters
    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "IncomeRequest{" +
                "amount=" + amount +
                ", source='" + source + '\'' +
                ", date=" + date +
                ", description='" + description + '\'' +
                '}';
    }
}
