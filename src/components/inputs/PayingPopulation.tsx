import React from 'react';
import {MenuItem, TextField, Typography} from '@mui/material';
import {CensusFigure, PayingPopulationProps} from '../../types';
import {formatPopulation} from "../../utils/formatters.ts";

// Sample census figures (you would likely get these from an API or database)
const CENSUS_FIGURES: CensusFigure[] = [
    {id: 'total', name: 'Total Population', value: 331_900_000},
    {id: 'adult', name: 'Adult Population (18+)', value: 258_300_000},
    {id: 'workforce', name: 'Workforce', value: 164_000_000},
    {id: 'taxpayers', name: 'Taxpayers', value: 144_500_000},
    {id: 'high_holders', name: 'High Holders', value: 11_200_000},
];

/**
 * A PopulationField with a Select box for various census figures
 */
const PayingPopulation: React.FC<PayingPopulationProps> = ({val, onValueChange}) => {
    // Find the currently selected census figure or use a default
    const selectedFigure = CENSUS_FIGURES.find(fig => fig.value === val) ||
        {id: 'custom', name: 'Custom', value: val};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedId = e.target.value;
        const figure = CENSUS_FIGURES.find(fig => fig.id === selectedId);
        if (figure && onValueChange) {
            onValueChange(figure.value);
        }
    };

    return (
        <TextField
            label="Paying Population"
            select={true}
            id="paying-population"
            value={selectedFigure.id}
            onChange={handleChange}
            fullWidth
            helperText={<Typography variant="body2" color="text.secondary">
                {formatPopulation(selectedFigure.value)}
            </Typography>}
        >
            {CENSUS_FIGURES.map(figure => (
                <MenuItem key={figure.id} value={figure.id}>
                    {figure.name} ({formatPopulation(figure.value)})
                </MenuItem>
            ))}
        </TextField>
    );
};

export default PayingPopulation;
