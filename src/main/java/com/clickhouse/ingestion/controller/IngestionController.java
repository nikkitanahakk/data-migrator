package com.clickhouse.ingestion.controller;

import com.clickhouse.ingestion.dto.IngestionRequest;
import com.clickhouse.ingestion.service.IngestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ingestion")
@RequiredArgsConstructor
public class IngestionController {

    private final IngestionService ingestionService;

    @GetMapping("/tables")
    public ResponseEntity<List<String>> getTables(
            @RequestParam String host,
            @RequestParam int port,
            @RequestParam String database,
            @RequestParam String username,
            @RequestParam String jwtToken) {
        return ResponseEntity.ok(ingestionService.getTables(host, port, database, username, jwtToken));
    }

    @GetMapping("/schema")
    public ResponseEntity<Map<String, String>> getTableSchema(
            @RequestParam String host,
            @RequestParam int port,
            @RequestParam String database,
            @RequestParam String username,
            @RequestParam String jwtToken,
            @RequestParam String tableName) {
        return ResponseEntity.ok(ingestionService.getTableSchema(host, port, database, username, jwtToken, tableName));
    }

    @PostMapping("/ingest")
    public ResponseEntity<Long> ingestData(@RequestBody IngestionRequest request) {
        return ResponseEntity.ok(ingestionService.ingestData(request));
    }

    @PostMapping("/preview")
    public ResponseEntity<List<Map<String, Object>>> previewData(
            @RequestBody IngestionRequest request,
            @RequestParam(defaultValue = "100") int limit) {
        return ResponseEntity.ok(ingestionService.previewData(request, limit));
    }
} 