import React, { useCallback } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface FileUploadProps {
    onUpload: (file: File) => void;
}

const FileUpload = ({ onUpload }: FileUploadProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onUpload(acceptedFiles[0]);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
        },
        maxFiles: 1,
    });

    return (
        <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                Upload CSV File
            </Typography>
            <Box
                {...getRootProps()}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.300',
                    borderRadius: 1,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                        borderColor: 'primary.main',
                    },
                }}
            >
                <input {...getInputProps()} />
                <UploadFileIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography>
                    {isDragActive
                        ? 'Drop the CSV file here'
                        : 'Drag and drop a CSV file here, or click to select'}
                </Typography>
                <Button variant="outlined" sx={{ mt: 2 }}>
                    Select File
                </Button>
            </Box>
        </Paper>
    );
};

export default FileUpload; 