package com.financialmanagement.repository;

import com.financialmanagement.model.Income;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class IncomeRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Income> incomeRowMapper = new RowMapper<Income>() {
        @Override
        public Income mapRow(ResultSet rs, int rowNum) throws SQLException {
            Income income = new Income();
            income.setId(rs.getLong("id"));
            income.setUserId(rs.getLong("user_id"));
            income.setAmount(rs.getBigDecimal("amount"));
            income.setSource(rs.getString("source"));
            
            Date date = rs.getDate("date");
            if (date != null) {
                income.setDate(date.toLocalDate());
            }
            
            income.setDescription(rs.getString("description"));
            
            Timestamp createdAt = rs.getTimestamp("created_at");
            if (createdAt != null) {
                income.setCreatedAt(createdAt.toLocalDateTime());
            }
            
            Timestamp updatedAt = rs.getTimestamp("updated_at");
            if (updatedAt != null) {
                income.setUpdatedAt(updatedAt.toLocalDateTime());
            }
            
            return income;
        }
    };

    public Income save(Income income) {
        if (income.getId() == null) {
            return insert(income);
        } else {
            return update(income);
        }
    }

    private Income insert(Income income) {
        String sql = "INSERT INTO incomes (user_id, amount, source, date, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        LocalDateTime now = LocalDateTime.now();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, income.getUserId());
            ps.setBigDecimal(2, income.getAmount());
            ps.setString(3, income.getSource());
            ps.setDate(4, Date.valueOf(income.getDate()));
            ps.setString(5, income.getDescription());
            ps.setTimestamp(6, Timestamp.valueOf(now));
            ps.setTimestamp(7, Timestamp.valueOf(now));
            return ps;
        }, keyHolder);

        // Get the generated ID from the key holder
        try {
            Number generatedId = keyHolder.getKey();
            if (generatedId != null) {
                income.setId(generatedId.longValue());
            } else {
                throw new RuntimeException("Generated key is null");
            }
        } catch (Exception e) {
            // Fallback: get ID from keys map when multiple keys are returned
            if (keyHolder.getKeys() != null && keyHolder.getKeys().containsKey("ID")) {
                Number idValue = (Number) keyHolder.getKeys().get("ID");
                if (idValue != null) {
                    income.setId(idValue.longValue());
                } else {
                    throw new RuntimeException("Generated ID value is null");
                }
            } else {
                throw new RuntimeException("Failed to retrieve generated income ID: " + e.getMessage());
            }
        }
        income.setCreatedAt(now);
        income.setUpdatedAt(now);
        return income;
    }

    private Income update(Income income) {
        String sql = "UPDATE incomes SET amount = ?, source = ?, date = ?, description = ?, updated_at = ? WHERE id = ? AND user_id = ?";
        LocalDateTime now = LocalDateTime.now();
        
        int rowsAffected = jdbcTemplate.update(sql, 
            income.getAmount(), 
            income.getSource(), 
            Date.valueOf(income.getDate()),
            income.getDescription(),
            Timestamp.valueOf(now), 
            income.getId(),
            income.getUserId()
        );
        
        if (rowsAffected == 0) {
            throw new RuntimeException("Income not found or access denied");
        }
        
        income.setUpdatedAt(now);
        return income;
    }

    public Optional<Income> findByIdAndUserId(Long id, Long userId) {
        String sql = "SELECT * FROM incomes WHERE id = ? AND user_id = ?";
        try {
            Income income = jdbcTemplate.queryForObject(sql, incomeRowMapper, id, userId);
            return Optional.of(income);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<Income> findByUserId(Long userId) {
        String sql = "SELECT * FROM incomes WHERE user_id = ? ORDER BY date DESC, created_at DESC";
        return jdbcTemplate.query(sql, incomeRowMapper, userId);
    }

    public List<Income> findByUserIdAndDateRange(Long userId, java.time.LocalDate startDate, java.time.LocalDate endDate) {
        String sql = "SELECT * FROM incomes WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date DESC";
        return jdbcTemplate.query(sql, incomeRowMapper, userId, Date.valueOf(startDate), Date.valueOf(endDate));
    }

    public void deleteByIdAndUserId(Long id, Long userId) {
        String sql = "DELETE FROM incomes WHERE id = ? AND user_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id, userId);
        if (rowsAffected == 0) {
            throw new RuntimeException("Income not found or access denied");
        }
    }

    public java.math.BigDecimal getTotalIncomeByUserId(Long userId) {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM incomes WHERE user_id = ?";
        return jdbcTemplate.queryForObject(sql, java.math.BigDecimal.class, userId);
    }

    public java.math.BigDecimal getTotalIncomeByUserIdAndDateRange(Long userId, java.time.LocalDate startDate, java.time.LocalDate endDate) {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM incomes WHERE user_id = ? AND date BETWEEN ? AND ?";
        return jdbcTemplate.queryForObject(sql, java.math.BigDecimal.class, userId, Date.valueOf(startDate), Date.valueOf(endDate));
    }
}
