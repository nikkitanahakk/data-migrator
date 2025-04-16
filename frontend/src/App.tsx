import React, { useState } from 'react';
import {
    Container,
    CssBaseline,
    ThemeProvider,
    createTheme,
    Box,
    Stepper,
    Step,
    StepLabel,
    Paper
} from '@mui/material';
import SourceSelection from './components/SourceSelection.tsx';
import ClickHouseForm from './components/ClickHouseForm.tsx';
import FileUpload from './components/FileUpload.tsx';
import ColumnSelection from './components/ColumnSelection.tsx';
import DestinationSelection from './components/DestinationSelection.tsx';
import { SourceType, DestinationType, ClickHouseConfig, FileData } from './types/index.ts';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

const steps = ['Select Source', 'Configure Source', 'Select Columns', 'Select Destination', 'Review & Ingest'];

function App() {
    const [activeStep, setActiveStep] = useState(0);
    const [sourceType, setSourceType] = useState<SourceType | null>(null);
    const [clickHouseConfig, setClickHouseConfig] = useState<ClickHouseConfig | undefined>(undefined);
    const [fileData, setFileData] = useState<FileData | undefined>(undefined);
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [destinationType, setDestinationType] = useState<DestinationType | null>(null);
    const [ingestionResult, setIngestionResult] = useState<number | null>(null);

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSourceSelect = (type: SourceType) => {
        setSourceType(type);
        handleNext();
    };

    const handleClickHouseConnect = (config: ClickHouseConfig) => {
        setClickHouseConfig(config);
        handleNext();
    };

    const handleFileUpload = (file: File) => {
        setFileData({ file, content: '' }); // We'll handle content reading later
        handleNext();
    };

    const handleColumnSelect = (columns: string[]) => {
        setSelectedColumns(columns);
        handleNext();
    };

    const handleDestinationSelect = (type: DestinationType) => {
        setDestinationType(type);
        handleNext();
    };

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <SourceSelection onSelect={handleSourceSelect} />;
            case 1:
                return sourceType === 'CLICKHOUSE' ? (
                    <ClickHouseForm onConnect={handleClickHouseConnect} />
                ) : (
                    <FileUpload onUpload={handleFileUpload} />
                );
            case 2:
                return (
                    <ColumnSelection
                        sourceType={sourceType!}
                        clickHouseConfig={clickHouseConfig}
                        fileData={fileData}
                        onSelect={handleColumnSelect}
                    />
                );
            case 3:
                return <DestinationSelection onSelect={handleDestinationSelect} />;
            case 4:
                return (
                    <Box>
                        {ingestionResult !== null && (
                            <Paper sx={{ p: 2, mb: 2 }}>
                                Successfully transferred {ingestionResult} records
                            </Paper>
                        )}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {getStepContent(activeStep)}
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default App; 