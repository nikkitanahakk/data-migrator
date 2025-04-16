import React, { useState } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';

interface FileUploadProps {
    onUpload: (data: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            onUpload(selectedFile);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Upload File
            </Typography>
            <Stack spacing={2}>
                <Button
                    variant="outlined"
                    component="label"
                    size="large"
                >
                    Choose File
                    <input
                        type="file"
                        hidden
                        accept=".csv,.txt"
                        onChange={handleFileChange}
                    />
                </Button>
                {selectedFile && (
                    <>
                        <Typography>
                            Selected file: {selectedFile.name}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleUpload}
                            size="large"
                        >
                            Upload
                        </Button>
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default FileUpload; 