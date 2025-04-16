import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { SourceType } from '../types';

interface SourceSelectionProps {
    onSelect: (type: SourceType) => void;
}

const SourceSelection = ({ onSelect }: SourceSelectionProps) => {
    return (
        <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Select Data Source
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
                <Button
                    variant="outlined"
                    startIcon={<StorageIcon />}
                    onClick={() => onSelect('clickhouse')}
                    sx={{ p: 2 }}
                >
                    ClickHouse Database
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    onClick={() => onSelect('file')}
                    sx={{ p: 2 }}
                >
                    CSV File
                </Button>
            </Box>
        </Box>
    );
};

export default SourceSelection; 