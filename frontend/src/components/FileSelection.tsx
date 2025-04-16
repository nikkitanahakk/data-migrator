import React, { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    Alert,
    CircularProgress,
    TextField
} from '@mui/material';
import { FileData } from '../types';

interface FileSelectionProps {
    onFileSelect: (fileData: FileData) => void;
    config: any;
    tableName: string;
    selectedColumns: string[];
}

const FileSelection = ({ onFileSelect, config, tableName, selectedColumns }: FileSelectionProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [delimiter, setDelimiter] = useState(',');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleDelimiterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDelimiter(event.target.value);
    };

    const handleFileUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('config', new Blob([JSON.stringify(config)], { type: 'application/json' }));
            formData.append('tableName', tableName);
            formData.append('columns', JSON.stringify(selectedColumns));
            formData.append('file', file);

            const response = await fetch('http://localhost:8081/api/ingestion/ingest', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const data = await response.json();
            onFileSelect(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Select File
            </Typography>
            <Box sx={{ mb: 2 }}>
                <TextField
                    type="text"
                    label="Delimiter"
                    value={delimiter}
                    onChange={handleDelimiterChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-upload"
                />
                <label htmlFor="file-upload">
                    <Button
                        variant="contained"
                        component="span"
                        sx={{ mr: 2 }}
                    >
                        Choose File
                    </Button>
                </label>
                <Button
                    variant="contained"
                    onClick={handleFileUpload}
                    disabled={!file || loading || !config.host || !tableName || selectedColumns.length === 0}
                >
                    {loading ? <CircularProgress size={24} /> : 'Upload'}
                </Button>
            </Box>
            {file && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                    Selected file: {file.name}
                </Typography>
            )}
            {error && (
                <Alert severity="error">
                    {error}
                </Alert>
            )}
        </Paper>
    );
};

export default FileSelection; 