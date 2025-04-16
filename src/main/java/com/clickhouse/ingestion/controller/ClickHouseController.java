package com.clickhouse.ingestion.controller;

import com.clickhouse.ingestion.config.ClickHouseConfig;
import com.clickhouse.ingestion.service.ClickHouseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/ingestion")
public class ClickHouseController {
    private final ClickHouseService clickHouseService;

    public ClickHouseController(ClickHouseService clickHouseService) {
        this.clickHouseService = clickHouseService;
    }

    @PostMapping("/test-connection")
    public ResponseEntity<Boolean> testConnection(@RequestBody ClickHouseConfig config) {
        return ResponseEntity.ok(clickHouseService.testConnection());
    }

    @PostMapping("/tables")
    public ResponseEntity<List<String>> getTables(@RequestBody ClickHouseConfig config) {
        try {
            return ResponseEntity.ok(clickHouseService.getTables());
        } catch (SQLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/columns")
    public ResponseEntity<List<String>> getColumns(
            @RequestBody ClickHouseConfig config,
            @RequestParam String tableName) {
        try {
            return ResponseEntity.ok(clickHouseService.getColumns(tableName));
        } catch (SQLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/query")
    public ResponseEntity<String> executeQuery(
            @RequestBody ClickHouseConfig config,
            @RequestParam String query) {
        try {
            ResultSet resultSet = clickHouseService.executeQuery(query);
            // Convert ResultSet to JSON or CSV format
            // This is a simplified example
            StringBuilder result = new StringBuilder();
            while (resultSet.next()) {
                result.append(resultSet.getString(1)).append("\n");
            }
            return ResponseEntity.ok(result.toString());
        } catch (SQLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/ingest")
    public ResponseEntity<Void> ingestData(
            @RequestBody ClickHouseConfig config,
            @RequestParam String tableName,
            @RequestParam List<String> columns,
            @RequestBody List<List<String>> data) {
        try {
            clickHouseService.executeInsert(tableName, columns, data);
            return ResponseEntity.ok().build();
        } catch (SQLException e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 