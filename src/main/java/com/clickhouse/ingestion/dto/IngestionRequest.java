package com.clickhouse.ingestion.dto;

import lombok.Data;
import java.util.List;

@Data
public class IngestionRequest {
    private String sourceType; // "CLICKHOUSE" or "FLAT_FILE"
    private String targetType; // "CLICKHOUSE" or "FLAT_FILE"
    
    // ClickHouse specific
    private String host;
    private Integer port;
    private String database;
    private String username;
    private String jwtToken;
    private String tableName;
    private List<String> selectedColumns;
    
    // Flat File specific
    private String filePath;
    private String delimiter;
    private String outputFileName;
} 