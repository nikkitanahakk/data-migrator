export type SourceType = 'CLICKHOUSE' | 'FLAT_FILE';
export type DestinationType = 'CLICKHOUSE' | 'FLAT_FILE';

export interface ClickHouseConfig {
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
}

export interface FileData {
    file: File;
    content: string;
}

export interface ColumnInfo {
    name: string;
    type: string;
    nullable: boolean;
}

export interface IngestionConfig {
    sourceType: SourceType;
    clickhouseConfig: ClickHouseConfig;
    fileData?: FileData;
    selectedColumns: string[];
    batchSize?: number;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
}

export interface ApiError {
    message: string;
    code?: string;
    details?: Record<string, any>;
}

export interface IngestionRequest {
    sourceType: SourceType;
    clickHouseConfig?: ClickHouseConfig;
    fileData?: FileData;
    selectedColumns: string[];
    destinationType: DestinationType;
}

export interface TableSchema {
    name: string;
    columns: ColumnInfo[];
}

export interface PreviewData {
    headers: string[];
    rows: Record<string, any>[];
}

export interface IngestionStatus {
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    progress: number;
    error?: string;
} 