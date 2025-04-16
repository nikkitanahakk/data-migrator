package com.clickhouse.ingestion.service.impl;

import com.clickhouse.ingestion.model.ConnectionConfig;
import com.clickhouse.ingestion.service.IngestionService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class IngestionServiceImpl implements IngestionService {

    private Connection getConnection(ConnectionConfig config) throws Exception {
        String url = String.format("jdbc:clickhouse://%s:%d/%s?compress=0",
            config.getHost(),
            config.getPort(),
            config.getDatabase());
        System.out.println("Attempting to connect to ClickHouse with URL: " + url);
        System.out.println("Username: " + config.getUsername());
        Connection conn = DriverManager.getConnection(url, config.getUsername(), config.getPassword());
        System.out.println("Successfully connected to ClickHouse");
        return conn;
    }

    @Override
    public void testConnection(ConnectionConfig config) {
        try (Connection conn = getConnection(config);
             Statement stmt = conn.createStatement()) {
            stmt.execute("SELECT 1");
        } catch (Exception e) {
            throw new RuntimeException("Failed to connect to ClickHouse: " + e.getMessage(), e);
        }
    }

    @Override
    public List<String> getTables(ConnectionConfig config) {
        System.out.println("Getting tables with config: " + config);
        List<String> tables = new ArrayList<>();
        try (Connection conn = getConnection(config);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT name FROM system.tables WHERE database = '" + config.getDatabase() + "'")) {
            while (rs.next()) {
                String tableName = rs.getString(1);
                System.out.println("Found table: " + tableName);
                tables.add(tableName);
            }
        } catch (Exception e) {
            System.err.println("Error getting tables: " + e.getMessage());
            e.printStackTrace();
        }
        return tables;
    }

    @Override
    public List<String> getColumns(ConnectionConfig config, String tableName) {
        System.out.println("Getting columns for table: " + tableName + " with config: " + config);
        List<String> columns = new ArrayList<>();
        try (Connection conn = getConnection(config);
             Statement stmt = conn.createStatement()) {
            
            // First check if table exists
            try (ResultSet rs = stmt.executeQuery(
                "SELECT count() FROM system.tables WHERE database = '" + config.getDatabase() + "' AND name = '" + tableName + "'")) {
                if (rs.next() && rs.getInt(1) > 0) {
                    System.out.println("Table " + tableName + " exists");
                    // Table exists, get its columns
                    try (ResultSet columnsRs = stmt.executeQuery(
                        "SELECT name FROM system.columns WHERE database = '" + config.getDatabase() + "' AND table = '" + tableName + "'")) {
                        while (columnsRs.next()) {
                            String columnName = columnsRs.getString(1);
                            System.out.println("Found column: " + columnName);
                            columns.add(columnName);
                        }
                    }
                } else {
                    System.out.println("Table " + tableName + " does not exist");
                }
            }
        } catch (Exception e) {
            System.err.println("Error getting columns for table " + tableName + ": " + e.getMessage());
            e.printStackTrace();
        }
        return columns;
    }

    @Override
    public void ingestFromFile(ConnectionConfig config, String tableName, List<String> columns, MultipartFile file) {
        try (InputStream is = file.getInputStream();
             Reader reader = new InputStreamReader(is);
             CSVParser parser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader());
             Connection conn = getConnection(config)) {
            
            StringBuilder insertQuery = new StringBuilder("INSERT INTO " + tableName + " (");
            insertQuery.append(String.join(",", columns));
            insertQuery.append(") VALUES ");
            
            List<String> values = new ArrayList<>();
            for (CSVRecord record : parser) {
                StringBuilder value = new StringBuilder("(");
                for (String column : columns) {
                    String cellValue = record.get(column);
                    value.append("'").append(cellValue.replace("'", "''")).append("',");
                }
                value.deleteCharAt(value.length() - 1);
                value.append(")");
                values.add(value.toString());
            }
            
            insertQuery.append(String.join(",", values));
            
            try (Statement stmt = conn.createStatement()) {
                stmt.execute(insertQuery.toString());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to ingest data", e);
        }
    }

    @Override
    public void exportToFile(ConnectionConfig config, String tableName, List<String> columns, String filePath) {
        try (Connection conn = getConnection(config);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT " + String.join(",", columns) + " FROM " + tableName);
             FileWriter writer = new FileWriter(filePath)) {
            
            // Write headers
            writer.write(String.join(",", columns) + "\n");
            
            // Write data
            while (rs.next()) {
                List<String> row = new ArrayList<>();
                for (String column : columns) {
                    row.add(rs.getString(column));
                }
                writer.write(String.join(",", row) + "\n");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to export data", e);
        }
    }

    @Override
    public List<Map<String, Object>> previewData(ConnectionConfig config, String tableName, int limit) {
        List<Map<String, Object>> result = new ArrayList<>();
        try (Connection conn = getConnection(config);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT * FROM " + tableName + " LIMIT " + limit)) {
            
            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                    row.put(rs.getMetaData().getColumnName(i), rs.getObject(i));
                }
                result.add(row);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to preview data", e);
        }
        return result;
    }
} 