import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ConnectionConfig as ConnectionConfigType } from '../types';

interface ConnectionConfigProps {
  onConfigChange: (config: ConnectionConfigType) => void;
}

const ConnectionConfig = ({ onConfigChange }: ConnectionConfigProps) => {
  const [config, setConfig] = useState<ConnectionConfigType>({
    host: '',
    port: 8123,
    database: '',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value) || 0 : value,
    }));
  };

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8081/api/ingestion/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to ClickHouse');
      }

      onConfigChange(config);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to ClickHouse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        ClickHouse Connection Configuration
      </Typography>
      <Box component="form" sx={{ mt: 2 }}>
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
          label="Password"
          name="password"
          type="password"
          value={config.password}
          onChange={handleChange}
          margin="normal"
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={testConnection}
          disabled={loading || !config.host || !config.port || !config.database || !config.username}
        >
          {loading ? <CircularProgress size={24} /> : 'Test Connection'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ConnectionConfig; 