export interface ConnectionConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}

export interface TableSchema {
    [columnName: string]: string;
}

export interface ColumnInfo {
    name: string;
    type: string;
}

export type SourceType = 'clickhouse' | 'file';

export type DestinationType = 'CLICKHOUSE' | 'FLAT_FILE';

export interface ClickHouseConfig {
    host: string;
    port: string;
    database: string;
    username: string;
    password: string;
}

export interface FileData {
    fileName: string;
    columns: string[];
    preview: any[];
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

export interface PreviewData {
    headers: string[];
    rows: Record<string, any>[];
}

export interface IngestionStatus {
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    progress: number;
    error?: string;
}

export type Direction = 'clickhouse-to-file' | 'file-to-clickhouse';

export interface PreviewDataProps {
    direction: Direction;
    config: ConnectionConfig;
    tableName: string;
    selectedColumns: string[];
    fileData: FileData | null;
} 