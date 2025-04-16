package com.clickhouse.ingestion.service;

import com.clickhouse.ingestion.dto.IngestionRequest;
import java.util.List;
import java.util.Map;

public interface IngestionService {
    List<String> getTables(String host, int port, String database, String username, String jwtToken);
    Map<String, String> getTableSchema(String host, int port, String database, String username, 
                                     String jwtToken, String tableName);
    long ingestData(IngestionRequest request);
    List<Map<String, Object>> previewData(IngestionRequest request, int limit);
} 