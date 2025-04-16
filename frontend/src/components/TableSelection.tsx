import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    Button,
    CircularProgress,
} from '@mui/material';
import { ConnectionConfig, TableSchema } from '../types';
import { getTables, getTableSchema } from '../services/api';

interface TableSelectionProps {
    config: ConnectionConfig;
    onTableSelect: (tableName: string, schema: TableSchema) => void;
}

const TableSelection: React.FC<TableSelectionProps> = ({ config, onTableSelect }) => {
    const [tables, setTables] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [schema, setSchema] = useState<TableSchema | null>(null);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

    useEffect(() => {
        const fetchTables = async () => {
            setLoading(true);
            setError(null);
            try {
                const tablesList = await getTables(config);
                setTables(tablesList);
            } catch (err) {
                setError('Failed to fetch tables');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTables();
    }, [config]);

    const handleTableSelect = async (tableName: string) => {
        setLoading(true);
        setError(null);
        try {
            const tableSchema = await getTableSchema({ ...config, tableName });
            setSchema(tableSchema);
            setSelectedTable(tableName);
            setSelectedColumns(Object.keys(tableSchema));
        } catch (err) {
            setError('Failed to fetch table schema');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleColumnToggle = (column: string) => {
        setSelectedColumns(prev =>
            prev.includes(column)
                ? prev.filter(c => c !== column)
                : [...prev, column]
        );
    };

    const handleConfirm = () => {
        if (selectedTable && schema) {
            onTableSelect(selectedTable, schema);
        }
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
            <Typography color="error" align="center" mt={4}>
                {error}
            </Typography>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Select Table and Columns
            </Typography>
            <Box display="flex" gap={4} mt={2}>
                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>
                        Tables
                    </Typography>
                    <List>
                        {tables.map(table => (
                            <ListItem
                                key={table}
                                button
                                onClick={() => handleTableSelect(table)}
                                selected={selectedTable === table}
                            >
                                <ListItemText primary={table} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                {schema && (
                    <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                            Columns
                        </Typography>
                        <List>
                            {Object.entries(schema).map(([column, type]) => (
                                <ListItem key={column}>
                                    <Checkbox
                                        checked={selectedColumns.includes(column)}
                                        onChange={() => handleColumnToggle(column)}
                                    />
                                    <ListItemText
                                        primary={column}
                                        secondary={type}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleConfirm}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Confirm Selection
                        </Button>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default TableSelection; 