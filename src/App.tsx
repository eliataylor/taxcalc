import React from 'react';
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import Calculator from './components/Calculator';

// Create a theme instance
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
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
            <CssBaseline/>
            <Calculator/>
        </ThemeProvider>
    );
};

export default App;
