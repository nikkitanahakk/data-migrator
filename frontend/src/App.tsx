import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import DataIngestion from './components/DataIngestion';
import Navbar from './components/Navbar';

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

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Navbar />
                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Routes>
                        <Route path="/" element={<DataIngestion />} />
                    </Routes>
                </Container>
            </Router>
        </ThemeProvider>
    );
}

export default App; 