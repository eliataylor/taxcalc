import React from 'react';
import {Box, Tooltip, Typography} from '@mui/material';
import {MONEY_SUPPLY_REFS} from '../data/definitions.ts';

interface MoneySupplyContextProps {
    totalTaxRevenue: number;
}

const MoneySupplyContext: React.FC<MoneySupplyContextProps> = ({totalTaxRevenue}) => {
    const items = MONEY_SUPPLY_REFS.map(ref => ({
        label: ref.name,
        pct: totalTaxRevenue > 0 ? (totalTaxRevenue / ref.value) * 100 : 0,
        description: ref.description,
    }));

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
