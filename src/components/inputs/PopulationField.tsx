import React from 'react';
import {Box, Typography} from '@mui/material';
import {PopulationFieldProps} from '../../types';

/**
 * Renders a population value with human-readable formatting
 */
const PopulationField: React.FC<PopulationFieldProps> = ({val}) => {
    // Format the population value with commas
    const formattedPopulation = val.toLocaleString();

    // Create a more human-readable version for large numbers
    let humanReadable = '';
    if (val >= 1_000_000_000) {
        humanReadable = `${(val / 1_000_000_000).toFixed(2)} billion`;
    } else if (val >= 1_000_000) {
        humanReadable = `${(val / 1_000_000).toFixed(2)} million`;
    } else if (val >= 1_000) {
        humanReadable = `${(val / 1_000).toFixed(2)} thousand`;
    }

    return (
        <Box>
            <Typography variant="body1">
                <strong>Population:</strong> {formattedPopulation}
                {humanReadable && <span> ({humanReadable})</span>}
            </Typography>
        </Box>
    );
};

export default PopulationField;
