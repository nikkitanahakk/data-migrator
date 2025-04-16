import axios from 'axios';
import { ClickHouseConfig, ColumnInfo, IngestionConfig, IngestionStatus, ApiError, TableSchema } from '../types/index.ts';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

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

interface ClickHouseConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    tableName?: string;
}

interface IngestionConfig {
    sourceType: 'CLICKHOUSE' | 'FLAT_FILE';
    clickHouseConfig?: ClickHouseConfig;
    fileData?: {
        content: string;
        headers: string[];
    };
    selectedColumns: string[];
}

export const testConnection = async (config: ClickHouseConfig): Promise<boolean> => {
    try {
        const response = await api.post('/connection/test', config);
        return response.data.success;
    } catch (error) {
        throw new Error('Failed to test connection');
    }
};

export const getTableSchema = async (config: ClickHouseConfig): Promise<ColumnInfo[]> => {
    // Mock implementation for now
    // In a real application, this would make an API call to the backend
    return [
        { name: 'id', type: 'UInt32', nullable: false },
        { name: 'name', type: 'String', nullable: false },
        { name: 'email', type: 'String', nullable: true },
        { name: 'created_at', type: 'DateTime', nullable: false }
    ];
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

export default api; 