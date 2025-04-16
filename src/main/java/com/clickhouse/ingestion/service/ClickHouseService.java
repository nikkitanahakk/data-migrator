package com.clickhouse.ingestion.service;

import com.clickhouse.ingestion.config.ClickHouseConfig;
import com.clickhouse.jdbc.ClickHouseConnection;
import com.clickhouse.jdbc.ClickHouseDataSource;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

@Service
public class ClickHouseService {
    private final ClickHouseConfig config;

    public ClickHouseService(ClickHouseConfig config) {
        this.config = config;
    }

    public boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn.isValid(5);
        } catch (SQLException e) {
            return false;
        }
    }

    public List<String> getTables() throws SQLException {
        List<String> tables = new ArrayList<>();
        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SHOW TABLES")) {
            while (rs.next()) {
                tables.add(rs.getString(1));
            }
        }
        return tables;
    }

    public List<String> getColumns(String tableName) throws SQLException {
        List<String> columns = new ArrayList<>();
        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("DESCRIBE " + tableName)) {
            while (rs.next()) {
                columns.add(rs.getString(1));
            }
        }
        return columns;
    }

    public ResultSet executeQuery(String query) throws SQLException {
        Connection conn = getConnection();
        Statement stmt = conn.createStatement();
        return stmt.executeQuery(query);
    }

    public void executeInsert(String tableName, List<String> columns, List<List<String>> data) throws SQLException {
        StringBuilder query = new StringBuilder("INSERT INTO ")
                .append(tableName)
                .append(" (")
                .append(String.join(", ", columns))
                .append(") VALUES ");

        List<String> valueRows = new ArrayList<>();
        for (List<String> row : data) {
            valueRows.add("(" + String.join(", ", row.stream()
                    .map(v -> v == null ? "NULL" : "'" + v.replace("'", "''") + "'")
                    .toList()) + ")");
        }

        query.append(String.join(", ", valueRows));

        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement()) {
            stmt.execute(query.toString());
        }
    }

    private Connection getConnection() throws SQLException {
        String url = String.format("jdbc:clickhouse://%s:%d/%s", config.getHost(), config.getPort(), config.getDatabase());
        Properties properties = new Properties();
        properties.setProperty("user", config.getUsername());
        if (config.getPassword() != null && !config.getPassword().isEmpty()) {
            properties.setProperty("password", config.getPassword());
        }
        if (config.getJwtToken() != null && !config.getJwtToken().isEmpty()) {
            properties.setProperty("jwt", config.getJwtToken());
        }

        ClickHouseDataSource dataSource = new ClickHouseDataSource(url, properties);
        return dataSource.getConnection();
    }
} 