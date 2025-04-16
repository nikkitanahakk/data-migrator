import React, { useState, useEffect } from 'react';
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
    Stack
} from '@mui/material';
import { SourceType, ClickHouseConfig, FileData, ColumnInfo } from '../types/index.ts';
import { getTableSchema } from '../services/api.ts';

interface ColumnSelectionProps {
    sourceType: SourceType;
    clickHouseConfig?: ClickHouseConfig;
    fileData?: FileData;
    onSelect: (columns: string[]) => void;
}

const ColumnSelection: React.FC<ColumnSelectionProps> = ({
    sourceType,
    clickHouseConfig,
    fileData,
    onSelect
}) => {
    const [columns, setColumns] = useState<ColumnInfo[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadColumns = async () => {
            setLoading(true);
            setError(null);
            try {
                if (sourceType === 'CLICKHOUSE' && clickHouseConfig) {
                    const schema = await getTableSchema(clickHouseConfig);
                    setColumns(schema);
                } else if (sourceType === 'FLAT_FILE' && fileData) {
                    // For now, we'll use mock columns for file data
                    const mockColumns = [
                        { name: 'column1', type: 'String', nullable: true },
                        { name: 'column2', type: 'String', nullable: true },
                        { name: 'column3', type: 'String', nullable: true },
                        { name: 'column4', type: 'String', nullable: true }
                    ];
                    setColumns(mockColumns);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load columns');
            } finally {
                setLoading(false);
            }
        };

        loadColumns();
    }, [sourceType, clickHouseConfig, fileData]);

    const handleSelectAll = () => {
        setSelectedColumns(columns.map(col => col.name));
    };

    const handleDeselectAll = () => {
        setSelectedColumns([]);
    };

    const handleColumnToggle = (columnName: string) => {
        setSelectedColumns(prev =>
            prev.includes(columnName)
                ? prev.filter(col => col !== columnName)
                : [...prev, columnName]
        );
    };

    const handleSubmit = () => {
        if (selectedColumns.length === 0) {
            setError('Please select at least one column');
            return;
        }
        onSelect(selectedColumns);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box mb={2}>
                <Typography variant="h6">Column Selection</Typography>
                <Typography variant="body2" color="textSecondary">
                    Select the columns you want to include in the ingestion process
                </Typography>
            </Box>

            {error && (
                <Box mb={2}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            <Box mb={2}>
                <Button
                    variant="outlined"
                    onClick={handleSelectAll}
                    sx={{ mr: 1 }}
                >
                    Select All
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleDeselectAll}
                >
                    Deselect All
                </Button>
            </Box>

            <Box mb={3}>
                <FormGroup>
                    <Stack spacing={1}>
                        {columns.map(column => (
                            <FormControlLabel
                                key={column.name}
                                control={
                                    <Checkbox
                                        checked={selectedColumns.includes(column.name)}
                                        onChange={() => handleColumnToggle(column.name)}
                                    />
                                }
                                label={column.name}
                            />
                        ))}
                    </Stack>
                </FormGroup>
            </Box>

            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={selectedColumns.length === 0}
            >
                Continue
            </Button>
        </Box>
    );
};

export default ColumnSelection; 