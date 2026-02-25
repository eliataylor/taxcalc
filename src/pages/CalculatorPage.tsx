import React from 'react';
import { Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Calculator from '../components/Calculator';

/**
 * Page that renders the Net Worth tax calculator with a link back to home.
 */
const CalculatorPage: React.FC = () => {
    return (
        <Box width="100%">
            <Box sx={{ px: 1, pt: 1, pb: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                    component={RouterLink}
                    to="/"
                    startIcon={<ArrowBackIcon />}
                    size="small"
                    sx={{ textTransform: 'none' }}
                >
                    Back to home
                </Button>
            </Box>
            <Calculator />
        </Box>
    );
};

export default CalculatorPage;
