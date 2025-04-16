package com.clickhouse.ingestion.controller;

import com.clickhouse.ingestion.model.ConnectionConfig;
import com.clickhouse.ingestion.service.IngestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ingestion")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"}, allowCredentials = "true")
public class IngestionController {

    @Autowired
    private IngestionService ingestionService;

    @PostMapping("/test-connection")
    public ResponseEntity<Void> testConnection(@RequestBody ConnectionConfig config) {
        System.out.println("Testing connection with config: " + config);
        ingestionService.testConnection(config);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/tables")
    public ResponseEntity<List<String>> getTables(@RequestBody ConnectionConfig config) {
        System.out.println("Received getTables request with config: " + config);
        List<String> tables = ingestionService.getTables(config);
        System.out.println("Returning tables: " + tables);
        return ResponseEntity.ok(tables);
    }

    @PostMapping("/columns")
    public ResponseEntity<List<String>> getColumns(@RequestBody ConnectionConfig config, 
                                                 @RequestParam String tableName) {
        System.out.println("Received getColumns request for table: " + tableName + " with config: " + config);
        List<String> columns = ingestionService.getColumns(config, tableName);
        System.out.println("Returning columns: " + columns);
        return ResponseEntity.ok(columns);
    }

    @PostMapping("/ingest")
    public ResponseEntity<Void> ingestFromFile(@RequestPart ConnectionConfig config,
                                             @RequestParam String tableName,
                                             @RequestParam List<String> columns,
                                             @RequestPart MultipartFile file) {
        ingestionService.ingestFromFile(config, tableName, columns, file);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/export")
    public ResponseEntity<Void> exportToFile(@RequestBody ConnectionConfig config,
                                           @RequestParam String tableName,
                                           @RequestParam List<String> columns,
                                           @RequestParam String filePath) {
        ingestionService.exportToFile(config, tableName, columns, filePath);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/preview")
    public ResponseEntity<List<Map<String, Object>>> previewData(@RequestBody ConnectionConfig config,
                                                               @RequestParam String tableName,
                                                               @RequestParam(defaultValue = "100") int limit) {
        return ResponseEntity.ok(ingestionService.previewData(config, tableName, limit));
    }
} 