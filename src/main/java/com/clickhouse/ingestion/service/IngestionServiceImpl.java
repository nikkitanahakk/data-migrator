package com.clickhouse.ingestion.service;

import com.clickhouse.ingestion.dto.IngestionRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class IngestionServiceImpl implements IngestionService {
    @Override
    public List<String> getTables(String host, int port, String database, String username, String jwtToken) {
        // TODO: Implement table retrieval logic
        return List.of();
    }

    @Override
    public Map<String, String> getTableSchema(String host, int port, String database, String username, 
                                            String jwtToken, String tableName) {
        // TODO: Implement schema retrieval logic
        return Map.of();
    }

    @Override
    public long ingestData(IngestionRequest request) {
        // TODO: Implement data ingestion logic
        return 0;
    }

    @Override
    public List<Map<String, Object>> previewData(IngestionRequest request, int limit) {
        // TODO: Implement data preview logic
        return List.of();
    }
} 