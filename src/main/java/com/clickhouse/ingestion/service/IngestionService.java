package com.clickhouse.ingestion.service;

import com.clickhouse.ingestion.model.ConnectionConfig;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface IngestionService {
    void testConnection(ConnectionConfig config);
    List<String> getTables(ConnectionConfig config);
    List<String> getColumns(ConnectionConfig config, String tableName);
    void ingestFromFile(ConnectionConfig config, String tableName, List<String> columns, MultipartFile file);
    void exportToFile(ConnectionConfig config, String tableName, List<String> columns, String filePath);
    List<Map<String, Object>> previewData(ConnectionConfig config, String tableName, int limit);
} 