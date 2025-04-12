import React from 'react';
import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography} from '@mui/material';
import MoneyField from './MoneyField';
import {MoneySupplyOption, MoneySupplyProps} from '../../types';

// Different money supply formulations
const MONEY_SUPPLY_TYPES: MoneySupplyOption[] = [
    {id: 'm1', name: 'M1 (Narrow Money)', value: 21_100_000_000_000},
    {id: 'm2', name: 'M2 (Broad Money)', value: 31_800_000_000_000},
    {id: 'federal_budget', name: 'Federal Budget', value: 6_300_000_000_000},
    {id: 'discretionary', name: 'Discretionary Spending', value: 1_700_000_000_000},
    {id: 'tax_revenue', name: 'Federal Tax Revenue', value: 4_800_000_000_000},
];

/**
 * A MoneyField with a Select box for various money supply formulations
 */
const MoneySupply: React.FC<MoneySupplyProps> = ({val, onValueChange}) => {
    // Find the selected money supply type or use a default
    const selectedSupply = MONEY_SUPPLY_TYPES.find(supply => supply.value === val) ||
        {id: 'custom', name: 'Custom', value: val};

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value;
        const supply = MONEY_SUPPLY_TYPES.find(supply => supply.id === selectedId);
        if (supply && onValueChange) {
            onValueChange(supply.value);
        }
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <Typography variant="h6">Money Supply</Typography>

            <FormControl fullWidth>
                <InputLabel id="money-supply-select-label">Money Type</InputLabel>
                <Select
                    labelId="money-supply-select-label"
                    id="money-supply-select"
                    value={selectedSupply.id}
                    label="Money Type"
                    onChange={handleChange}
                >
                    {MONEY_SUPPLY_TYPES.map(supply => (
                        <MenuItem key={supply.id} value={supply.id}>
                            {supply.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <MoneyField val={val}/>
        </Box>
    );
};

export default MoneySupply;
