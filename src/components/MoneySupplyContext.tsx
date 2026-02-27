import React from 'react';
import {Box, Tooltip, Typography} from '@mui/material';
import {MONEY_SUPPLY_REFS} from '../data/definitions.ts';

const M1 = MONEY_SUPPLY_REFS.m1;
const M2 = MONEY_SUPPLY_REFS.m2;

interface MoneySupplyContextProps {
    totalTaxRevenue: number;
}

const MoneySupplyContext: React.FC<MoneySupplyContextProps> = ({totalTaxRevenue}) => {
    const pctM1 = totalTaxRevenue > 0 ? (totalTaxRevenue / M1.value) * 100 : 0;
    const pctM2 = totalTaxRevenue > 0 ? (totalTaxRevenue / M2.value) * 100 : 0;

    const items = [
        {label: 'M1', pct: pctM1, description: M1.description},
        {label: 'M2', pct: pctM2, description: M2.description},
    ];

    return (
        <Box sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            py: 0.5,
        }}>
            {items.map(({label, pct, description}) => (
                <Tooltip key={label} title={description ?? ''} placement="top" arrow>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 0.5,
                        cursor: 'help',
                    }}>
                        <Typography variant="caption" color="text.secondary">
                            {label}
                        </Typography>
                        <Typography variant="caption" fontWeight={600} sx={{fontFamily: 'monospace'}}>
                            {pct.toFixed(2)}%
                        </Typography>
                    </Box>
                </Tooltip>
            ))}
        </Box>
    );
};

export default MoneySupplyContext;
