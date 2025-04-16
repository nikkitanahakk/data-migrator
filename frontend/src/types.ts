export interface ConnectionConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password?: string;
    jwtToken?: string;
}

export interface FileData {
    fileName: string;
    content: string;
    type: string;
}

export interface ColumnInfo {
    name: string;
    type: string;
}

export interface PreviewDataProps {
    direction: Direction;
    config: ConnectionConfig;
    tableName: string;
    selectedColumns: string[];
    fileData?: FileData;
}

export interface ClickHouseConfig extends ConnectionConfig {
    // Additional ClickHouse specific configuration if needed
}

export interface IngestionConfig {
    config: ClickHouseConfig;
    tableName: string;
    columns: string[];
    fileData: FileData;
}

export interface IngestionStatus {
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    progress: number;
    message?: string;
}

export interface ApiError {
    message: string;
    code?: string;
}

export interface TableSchema {
    [columnName: string]: string;
}

export type Direction = 'file-to-clickhouse' | 'clickhouse-to-file';

export type DestinationType = 'CLICKHOUSE' | 'FLAT_FILE';

export type SourceType = 'file' | 'clickhouse'; 