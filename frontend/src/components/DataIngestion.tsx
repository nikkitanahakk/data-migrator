import React, { useState } from 'react';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import ConnectionConfig from './ConnectionConfig';
import TableSelection from './TableSelection';
import ColumnSelection from './ColumnSelection';
import FileSelection from './FileSelection';
import PreviewData from './PreviewData';
import { Direction, ConnectionConfig as ConnectionConfigType, FileData } from '../types';

const DataIngestion = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState<Direction>('file-to-clickhouse');
  const [config, setConfig] = useState<ConnectionConfigType>({
    host: '',
    port: 8123,
    database: '',
    username: '',
    password: ''
  });
  const [tableName, setTableName] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [fileData, setFileData] = useState<FileData | undefined>(undefined);

  const steps = {
    'file-to-clickhouse': ['Configure Connection', 'Select Table', 'Select File', 'Preview Data'],
    'clickhouse-to-file': ['Configure Connection', 'Select Table', 'Select Columns', 'Preview Data']
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleDirectionChange = (event: SelectChangeEvent<Direction>) => {
    setDirection(event.target.value as Direction);
    setActiveStep(0);
    setConfig({
      host: '',
      port: 8123,
      database: '',
      username: '',
      password: ''
    });
    setTableName('');
    setSelectedColumns([]);
    setFileData(undefined);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ConnectionConfig onConfigChange={setConfig} />;
      case 1:
        return <TableSelection config={config} onTableSelect={setTableName} />;
      case 2:
        if (direction === 'file-to-clickhouse') {
          return (
            <FileSelection
              onFileSelect={setFileData}
              config={config}
              tableName={tableName}
              selectedColumns={selectedColumns}
            />
          );
        } else {
          return <ColumnSelection config={config} tableName={tableName} onColumnsSelect={setSelectedColumns} />;
        }
      case 3:
        return (
          <PreviewData
            direction={direction}
            config={config}
            tableName={tableName}
            selectedColumns={selectedColumns}
            fileData={fileData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Data Flow Direction</InputLabel>
          <Select
            value={direction}
            onChange={handleDirectionChange}
            label="Data Flow Direction"
          >
            <MenuItem value="file-to-clickhouse">File to ClickHouse</MenuItem>
            <MenuItem value="clickhouse-to-file">ClickHouse to File</MenuItem>
          </Select>
        </FormControl>
        <Stepper activeStep={activeStep}>
          {steps[direction].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {renderStepContent(activeStep)}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={
            (activeStep === 0 && !config.host) ||
            (activeStep === 1 && !tableName) ||
            (activeStep === 2 && direction === 'file-to-clickhouse' && !fileData) ||
            (activeStep === 2 && direction === 'clickhouse-to-file' && selectedColumns.length === 0)
          }
        >
          {activeStep === steps[direction].length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default DataIngestion; 