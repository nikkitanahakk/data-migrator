import React, { useState } from 'react';
import { ConnectionConfig } from '../types';
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
} from '@mui/material';

interface ConnectionFormProps {
    onConnect: (config: ConnectionConfig) => void;
}

const ConnectionForm: React.FC<ConnectionFormProps> = ({ onConnect }) => {
    const [config, setConfig] = useState<ConnectionConfig>({
        host: 'localhost',
        port: 9000,
        database: 'default',
        username: 'default',
        jwtToken: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: name === 'port' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConnect(config);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                ClickHouse Connection
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                    fullWidth
                    label="Host"
                    name="host"
                    value={config.host}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Port"
                    name="port"
                    type="number"
                    value={config.port}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Database"
                    name="database"
                    value={config.database}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={config.username}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="JWT Token"
                    name="jwtToken"
                    value={config.jwtToken}
                    onChange={handleChange}
                    margin="normal"
                    required
                    type="password"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Connect
                </Button>
            </Box>
        </Paper>
    );
};

export default ConnectionForm; 