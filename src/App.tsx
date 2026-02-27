import React from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CalculatorPage from './pages/CalculatorPage';
import VariablesPage from './pages/VariablesPage';

// Create a theme instance
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#4c99f1',
        },
        secondary: {
            main: '#f65b0f',
        },
        error: {
            main: '#f44336',
        },
        warning: {
            main: '#ff9800',
        },
        info: {
            main: '#2196f3',
        },
        success: {
            main: '#4caf50',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 500,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
    },
    components: {
        MuiPaper: {
            defaultProps: {
                elevation: 2,
            },
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 6,
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                size: 'small',
            },
        },
    },
});

/**
 * Main application component
 */
const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/calculator" element={<CalculatorPage />} />
                    <Route path="/variables" element={<VariablesPage />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
