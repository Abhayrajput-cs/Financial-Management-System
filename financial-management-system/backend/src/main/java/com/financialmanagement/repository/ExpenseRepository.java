package com.financialmanagement.repository;

import com.financialmanagement.model.Expense;
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
import java.util.Map;
import java.util.Optional;

@Repository
public class ExpenseRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Expense> expenseRowMapper = new RowMapper<Expense>() {
        @Override
        public Expense mapRow(ResultSet rs, int rowNum) throws SQLException {
            Expense expense = new Expense();
            expense.setId(rs.getLong("id"));
            expense.setUserId(rs.getLong("user_id"));
            expense.setAmount(rs.getBigDecimal("amount"));
            expense.setCategory(rs.getString("category"));
            expense.setDescription(rs.getString("description"));
            
            Date date = rs.getDate("date");
            if (date != null) {
                expense.setDate(date.toLocalDate());
            }
            
            Timestamp createdAt = rs.getTimestamp("created_at");
            if (createdAt != null) {
                expense.setCreatedAt(createdAt.toLocalDateTime());
            }
            
            Timestamp updatedAt = rs.getTimestamp("updated_at");
            if (updatedAt != null) {
                expense.setUpdatedAt(updatedAt.toLocalDateTime());
            }
            
            return expense;
        }
    };

    public Expense save(Expense expense) {
        if (expense.getId() == null) {
            return insert(expense);
        } else {
            return update(expense);
        }
    }

    private Expense insert(Expense expense) {
        String sql = "INSERT INTO expenses (user_id, amount, category, description, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        LocalDateTime now = LocalDateTime.now();
        
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, expense.getUserId());
            ps.setBigDecimal(2, expense.getAmount());
            ps.setString(3, expense.getCategory());
            ps.setString(4, expense.getDescription());
            ps.setDate(5, Date.valueOf(expense.getDate()));
            ps.setTimestamp(6, Timestamp.valueOf(now));
            ps.setTimestamp(7, Timestamp.valueOf(now));
            return ps;
        }, keyHolder);

        // Get the generated ID from the key holder
        try {
            Number generatedId = keyHolder.getKey();
            if (generatedId != null) {
                expense.setId(generatedId.longValue());
            } else {
                throw new RuntimeException("Generated key is null");
            }
        } catch (Exception e) {
            // Fallback: get ID from keys map when multiple keys are returned
            if (keyHolder.getKeys() != null && keyHolder.getKeys().containsKey("ID")) {
                Number idValue = (Number) keyHolder.getKeys().get("ID");
                if (idValue != null) {
                    expense.setId(idValue.longValue());
                } else {
                    throw new RuntimeException("Generated ID value is null");
                }
            } else {
                throw new RuntimeException("Failed to retrieve generated expense ID: " + e.getMessage());
            }
        }
        expense.setCreatedAt(now);
        expense.setUpdatedAt(now);
        return expense;
    }

    private Expense update(Expense expense) {
        String sql = "UPDATE expenses SET amount = ?, category = ?, description = ?, date = ?, updated_at = ? WHERE id = ? AND user_id = ?";
        LocalDateTime now = LocalDateTime.now();
        
        int rowsAffected = jdbcTemplate.update(sql, 
            expense.getAmount(), 
            expense.getCategory(), 
            expense.getDescription(),
            Date.valueOf(expense.getDate()),
            Timestamp.valueOf(now), 
            expense.getId(),
            expense.getUserId()
        );
        
        if (rowsAffected == 0) {
            throw new RuntimeException("Expense not found or access denied");
        }
        
        expense.setUpdatedAt(now);
        return expense;
    }

    public Optional<Expense> findByIdAndUserId(Long id, Long userId) {
        String sql = "SELECT * FROM expenses WHERE id = ? AND user_id = ?";
        try {
            Expense expense = jdbcTemplate.queryForObject(sql, expenseRowMapper, id, userId);
            return Optional.of(expense);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<Expense> findByUserId(Long userId) {
        String sql = "SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC";
        return jdbcTemplate.query(sql, expenseRowMapper, userId);
    }

    public List<Expense> findByUserIdAndCategory(Long userId, String category) {
        String sql = "SELECT * FROM expenses WHERE user_id = ? AND category = ? ORDER BY date DESC, created_at DESC";
        return jdbcTemplate.query(sql, expenseRowMapper, userId, category);
    }

    public List<Expense> findByUserIdAndDateRange(Long userId, java.time.LocalDate startDate, java.time.LocalDate endDate) {
        String sql = "SELECT * FROM expenses WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date DESC";
        return jdbcTemplate.query(sql, expenseRowMapper, userId, Date.valueOf(startDate), Date.valueOf(endDate));
    }

    public List<Expense> findByUserIdAndCategoryAndDateRange(Long userId, String category, java.time.LocalDate startDate, java.time.LocalDate endDate) {
        String sql = "SELECT * FROM expenses WHERE user_id = ? AND category = ? AND date BETWEEN ? AND ? ORDER BY date DESC";
        return jdbcTemplate.query(sql, expenseRowMapper, userId, category, Date.valueOf(startDate), Date.valueOf(endDate));
    }

    public void deleteByIdAndUserId(Long id, Long userId) {
        String sql = "DELETE FROM expenses WHERE id = ? AND user_id = ?";
        int rowsAffected = jdbcTemplate.update(sql, id, userId);
        if (rowsAffected == 0) {
            throw new RuntimeException("Expense not found or access denied");
        }
    }

    public java.math.BigDecimal getTotalExpenseByUserId(Long userId) {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE user_id = ?";
        return jdbcTemplate.queryForObject(sql, java.math.BigDecimal.class, userId);
    }

    public java.math.BigDecimal getTotalExpenseByUserIdAndDateRange(Long userId, java.time.LocalDate startDate, java.time.LocalDate endDate) {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE user_id = ? AND date BETWEEN ? AND ?";
        return jdbcTemplate.queryForObject(sql, java.math.BigDecimal.class, userId, Date.valueOf(startDate), Date.valueOf(endDate));
    }

    public List<Map<String, Object>> getExpensesByCategory(Long userId) {
        String sql = "SELECT category, SUM(amount) as total_amount, COUNT(*) as count FROM expenses WHERE user_id = ? GROUP BY category ORDER BY total_amount DESC";
        return jdbcTemplate.queryForList(sql, userId);
    }

    public List<String> getDistinctCategories(Long userId) {
        String sql = "SELECT DISTINCT category FROM expenses WHERE user_id = ? ORDER BY category";
        return jdbcTemplate.queryForList(sql, String.class, userId);
    }
}
