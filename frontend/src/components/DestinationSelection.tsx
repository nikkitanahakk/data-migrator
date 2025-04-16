import React from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import { DestinationType } from '../types';

interface DestinationSelectionProps {
    onSelect: (type: DestinationType) => void;
}

const DestinationSelection: React.FC<DestinationSelectionProps> = ({ onSelect }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Select Destination
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

export default DestinationSelection; 