package com.clickhouse.ingestion.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "clickhouse")
public class ClickHouseProperties {
    private String host;
    private int port;
    private String database;
    private String username;
    private String password;
} 