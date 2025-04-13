import React from 'react';
import {MenuItem, TextField, Typography} from '@mui/material';
import {MoneySupplyOption, MoneySupplyProps} from '../../types';
import {formatPopulation} from "../../utils/formatters.ts";

// Different money supply formulations
const MONEY_SUPPLY_TYPES: MoneySupplyOption[] = [
    {id: 'm2', name: 'M2 (Broad Money)', value: 31_800_000_000_000},
    {id: 'm1', name: 'M1 (Narrow Money)', value: 21_100_000_000_000},
    {id: 'federal_budget', name: 'Federal Budget', value: 6_300_000_000_000},
    {id: 'tax_revenue', name: 'Federal Tax Revenue', value: 4_800_000_000_000},
    {id: 'discretionary', name: 'Discretionary Spending', value: 1_700_000_000_000},
];

/**
 * A MoneyField with a Select box for various money supply formulations
 */
const MoneySupply: React.FC<MoneySupplyProps> = ({val, onValueChange}) => {
    // Find the selected money supply type or use a default
    const selectedSupply = MONEY_SUPPLY_TYPES.find(supply => supply.value === val) ||
        {id: 'custom', name: 'Custom', value: val};


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedId = e.target.value;
        const supply = MONEY_SUPPLY_TYPES.find(supply => supply.id === selectedId);
        if (supply && onValueChange) {
            onValueChange(supply.value);
        }
    };

    return (
        <TextField
            label="Money Supply"
            select={true}
            id="money-supply"
            value={selectedSupply.id}
            onChange={handleChange}
            fullWidth
            helperText={<Typography variant="body2" color="text.secondary">
                ${formatPopulation(selectedSupply.value)}
            </Typography>}
        >
            {MONEY_SUPPLY_TYPES.map(supply => (
                <MenuItem key={supply.id} value={supply.id}>
                    {supply.name} (${formatPopulation(supply.value)})
                </MenuItem>
            ))}
        </TextField>
    );
};

export default MoneySupply;
