package com.clickhouse.ingestion.util;

import com.clickhouse.ingestion.model.ConnectionConfig;
import org.springframework.stereotype.Component;

@Component
public class ClickHouseUtil {
    public String buildConnectionUrl(ConnectionConfig config) {
        return String.format("jdbc:clickhouse://%s:%d/%s", 
            config.getHost(), 
            config.getPort(), 
            config.getDatabase());
    }
} 