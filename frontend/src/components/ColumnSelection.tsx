import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
    Paper,
    Alert,
    CircularProgress,
    Divider,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    ListItemIcon
} from '@mui/material';
import { SourceType, ClickHouseConfig, FileData, ColumnInfo } from '../types';
import { getTableSchema } from '../services/api';
import axios from 'axios';

interface ColumnSelectionProps {
    config: any;
    tableName: string;
    onColumnsSelect: (columns: string[]) => void;
}

const ColumnSelection = ({ config, tableName, onColumnsSelect }: ColumnSelectionProps) => {
    const [columns, setColumns] = useState<string[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const onColumnsSelectRef = useRef(onColumnsSelect);

    useEffect(() => {
        onColumnsSelectRef.current = onColumnsSelect;
    }, [onColumnsSelect]);

    useEffect(() => {
        const fetchColumns = async () => {
            if (!tableName) return;

            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8081/api/ingestion/columns?tableName=${tableName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(config),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch columns');
                }

                const data = await response.json();
                setColumns(data);
                // Select all columns by default
                setSelectedColumns(data);
                onColumnsSelectRef.current(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch columns');
            } finally {
                setLoading(false);
            }
        };

        if (config.host && config.port && config.database && tableName) {
            fetchColumns();
        }
    }, [config, tableName]);

    const handleToggle = (column: string) => {
        const newSelected = selectedColumns.includes(column)
            ? selectedColumns.filter((c) => c !== column)
            : [...selectedColumns, column];
        setSelectedColumns(newSelected);
        onColumnsSelectRef.current(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedColumns.length === columns.length) {
            setSelectedColumns([]);
            onColumnsSelectRef.current([]);
        } else {
            setSelectedColumns(columns);
            onColumnsSelectRef.current(columns);
        }
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Select Columns
            </Typography>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <CircularProgress />
                </Box>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {!loading && !error && columns.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    No columns found in the table.
                </Alert>
            )}
            {!loading && !error && columns.length > 0 && (
                <>
                    <Button
                        variant="outlined"
                        onClick={handleSelectAll}
                        sx={{ mb: 2 }}
                    >
                        {selectedColumns.length === columns.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    <List>
                        {columns.map((column) => (
                            <ListItem key={column} disablePadding>
                                <ListItemButton onClick={() => handleToggle(column)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={selectedColumns.includes(column)}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={column} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </Paper>
    );
};

export default ColumnSelection; 