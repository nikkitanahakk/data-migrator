import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { SourceType } from '../types/index.ts';

interface SourceSelectionProps {
    onSelect: (type: SourceType) => void;
}

const SourceSelection: React.FC<SourceSelectionProps> = ({ onSelect }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Select Data Source
            </Typography>
            <Stack spacing={2} direction="row" justifyContent="center">
                <Button
                    variant="contained"
                    onClick={() => onSelect('CLICKHOUSE')}
                    size="large"
                >
                    ClickHouse Database
                </Button>
                <Button
                    variant="contained"
                    onClick={() => onSelect('FLAT_FILE')}
                    size="large"
                >
                    Flat File
                </Button>
            </Stack>
        </Box>
    );
};

export default SourceSelection; 