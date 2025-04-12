import React from 'react';
import {Box, Typography} from '@mui/material';
import {MoneyFieldProps} from '../../types';
import {formatMoney} from "../../utils/formatters.ts";

/**
 * Renders a monetary value with formatted dollar string
 */
const MoneyField: React.FC<MoneyFieldProps> = ({val, levy = 0}) => {
    // Format the money value as a dollar string
    const formattedMoney = formatMoney(val);

    // Calculate the levy amount if provided
    const levyAmount = val * levy;
    const formattedLevy = levy > 0 ? formatMoney(levyAmount) : null;

    return (
        <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <Typography variant="body1">
                <strong>Value:</strong> {formattedMoney} ({val.toLocaleString()})
            </Typography>

            {levy > 0 && (
                <Typography variant="body2" color="text.secondary">
                    <strong>Levy ({(levy * 100).toFixed(2)}%):</strong> {formattedLevy}
                </Typography>
            )}
        </Box>
    );
};

export default MoneyField;
