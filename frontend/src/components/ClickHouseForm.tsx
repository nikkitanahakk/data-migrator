import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';

interface ClickHouseFormProps {
    onConnect: (config: {
        host: string;
        port: string;
        database: string;
        username: string;
        password: string;
    }) => void;
}

const ClickHouseForm: React.FC<ClickHouseFormProps> = ({ onConnect }) => {
    const [formData, setFormData] = useState({
        host: '',
        port: '',
        database: '',
        username: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConnect(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                ClickHouse Connection Details
            </Typography>
            <Stack spacing={2}>
                <TextField
                    required
                    fullWidth
                    label="Host"
                    name="host"
                    value={formData.host}
                    onChange={handleChange}
                />
                <TextField
                    required
                    fullWidth
                    label="Port"
                    name="port"
                    value={formData.port}
                    onChange={handleChange}
                />
                <TextField
                    required
                    fullWidth
                    label="Database"
                    name="database"
                    value={formData.database}
                    onChange={handleChange}
                />
                <TextField
                    required
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <TextField
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                >
                    Connect
                </Button>
            </Stack>
        </Box>
    );
};

export default ClickHouseForm; 