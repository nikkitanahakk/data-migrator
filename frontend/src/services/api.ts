import axios from 'axios';
import { ClickHouseConfig, ColumnInfo, IngestionConfig, IngestionStatus, ApiError, TableSchema, ConnectionConfig, FileData } from '../types';

const API_BASE_URL = 'http://localhost:8081/api/ingestion';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const testConnection = async (config: ClickHouseConfig): Promise<boolean> => {
    try {
        const response = await api.post('/connection/test', config);
        return response.data.success;
    } catch (error) {
        throw new Error('Failed to test connection');
    }
};

export const getTableSchema = async (config: ConnectionConfig & { tableName: string }): Promise<TableSchema> => {
    try {
        const response = await api.post(`/columns?tableName=${config.tableName}`, config);
        const columns = response.data;
        return columns.reduce((schema: TableSchema, column: string) => {
            schema[column] = 'Unknown'; // We'll enhance this later to include column types
            return schema;
        }, {});
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ApiError).message);
        }
        throw new Error('Failed to fetch table schema');
    }
};

export const startIngestion = async (config: IngestionConfig): Promise<string> => {
    try {
        const response = await api.post('/ingestion/start', config);
        return response.data.jobId;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ApiError).message);
        }
        throw new Error('Failed to start ingestion');
    }
};

export const getIngestionStatus = async (jobId: string): Promise<IngestionStatus> => {
    try {
        const response = await api.get(`/ingestion/status/${jobId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ApiError).message);
        }
        throw new Error('Failed to fetch ingestion status');
    }
};

export const login = async (username: string, password: string): Promise<{ token: string; user: any }> => {
    try {
        const response = await api.post('/auth/login', { username, password });
        const { token, user } = response.data;
        localStorage.setItem('auth_token', token);
        return { token, user };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error((error.response.data as ApiError).message);
        }
        throw new Error('Login failed');
    }
};

export const logout = () => {
    localStorage.removeItem('auth_token');
};

export const getTables = async (config: ConnectionConfig): Promise<string[]> => {
    const response = await fetch('http://localhost:8081/api/ingestion/tables', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch tables');
    }

    return response.json();
};

export const getColumns = async (config: ConnectionConfig, tableName: string): Promise<string[]> => {
    const response = await fetch('http://localhost:8081/api/ingestion/columns', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config, tableName }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch columns');
    }

    return response.json();
};

export const ingestFromFile = async (
    config: ConnectionConfig,
    tableName: string,
    columns: string[],
    fileData: FileData
): Promise<void> => {
    const formData = new FormData();
    formData.append('config', JSON.stringify(config));
    formData.append('tableName', tableName);
    formData.append('columns', JSON.stringify(columns));
    formData.append('file', new Blob([fileData.content], { type: 'text/csv' }), fileData.fileName);

    const response = await fetch('http://localhost:8081/api/ingestion/ingest', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to ingest data');
    }
};

export const exportToFile = async (
    config: ConnectionConfig,
    tableName: string,
    columns: string[],
    fileName: string
): Promise<void> => {
    const response = await fetch('http://localhost:8081/api/ingestion/export', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            config,
            tableName,
            columns,
            fileName,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to export data');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

export default api; 