import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Checkbox,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import { ConnectionConfig } from '../types';
import { getTables } from '../services/api';

interface TableSelectionProps {
    config: ConnectionConfig;
    onTableSelect: (tableName: string) => void;
}

const TableSelection = ({ config, onTableSelect }: TableSelectionProps) => {
    const [tables, setTables] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getTables(config);
                setTables(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch tables');
            } finally {
                setLoading(false);
            }
        };

        if (config.host && config.port && config.database) {
            fetchTables();
        }
    }, [config]);

    const handleTableSelect = (tableName: string) => {
        setSelectedTable(tableName);
        onTableSelect(tableName);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
        );
    }

    if (tables.length === 0) {
        return (
            <Alert severity="info" sx={{ mb: 2 }}>
                No tables found in the database.
            </Alert>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Select Table
            </Typography>
            <List>
                {tables.map((table) => (
                    <ListItem key={table} disablePadding>
                        <ListItemButton
                            selected={selectedTable === table}
                            onClick={() => handleTableSelect(table)}
                        >
                            <ListItemText primary={table} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default TableSelection; 