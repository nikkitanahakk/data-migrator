package com.clickhouse.ingestion.model;

import lombok.Data;

@Data
public class ConnectionConfig {
    private String host;
    private int port;
    private String database;
    private String username;
    private String password;
} 