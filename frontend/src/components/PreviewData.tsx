import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { PreviewDataProps } from '../types';
import { ingestFromFile, exportToFile } from '../services/api';

const PreviewData = ({ direction, config, tableName, selectedColumns, fileData }: PreviewDataProps) => {
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreviewData = async () => {
      if (direction === 'file-to-clickhouse' && fileData) {
        // For ingestion, show the first few rows of the file
        const rows = fileData.content.split('\n').slice(0, 5);
        setPreviewData(rows.map(row => row.split(',')));
      } else if (direction === 'clickhouse-to-file') {
        // For export, show a sample of the data that will be exported
        setPreviewData([
          selectedColumns,
          ...Array(4).fill(selectedColumns.map(() => 'Sample Data')),
        ]);
      }
    };

    fetchPreviewData();
  }, [direction, fileData, selectedColumns]);

  const handleProcess = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (direction === 'file-to-clickhouse' && fileData) {
        await ingestFromFile(config, tableName, selectedColumns, fileData);
        setSuccess('Data ingested successfully!');
      } else if (direction === 'clickhouse-to-file') {
        await exportToFile(config, tableName, selectedColumns, `${tableName}_export.csv`);
        setSuccess('Data exported successfully!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert severity="success" sx={{ my: 2 }}>
        {success}
      </Alert>
    );
  }

  if (previewData.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        No data to preview
      </Alert>
    );
  }

  const columns = Object.keys(previewData[0]);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Preview Data
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {selectedColumns.map((column, index) => (
                <TableCell key={index}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {previewData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell: string, cellIndex: number) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleProcess}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {direction === 'file-to-clickhouse' ? 'Ingest Data' : 'Export Data'}
        </Button>
      </Box>
    </Box>
  );
};

export default PreviewData; 