import React from 'react';
import {Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography} from '@mui/material';
import PopulationField from './PopulationField';
import {CensusFigure, PayingPopulationProps} from '../../types';

// Sample census figures (you would likely get these from an API or database)
const CENSUS_FIGURES: CensusFigure[] = [
    {id: 'total', name: 'Total Population', value: 331_900_000},
    {id: 'adult', name: 'Adult Population (18+)', value: 258_300_000},
    {id: 'workforce', name: 'Workforce', value: 164_000_000},
    {id: 'taxpayers', name: 'Taxpayers', value: 144_500_000},
    {id: 'high_income', name: 'High Income Earners', value: 11_200_000},
];

/**
 * A PopulationField with a Select box for various census figures
 */
const PayingPopulation: React.FC<PayingPopulationProps> = ({val, onValueChange}) => {
    // Find the currently selected census figure or use a default
    const selectedFigure = CENSUS_FIGURES.find(fig => fig.value === val) ||
        {id: 'custom', name: 'Custom', value: val};

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value;
        const figure = CENSUS_FIGURES.find(fig => fig.id === selectedId);
        if (figure && onValueChange) {
            onValueChange(figure.value);
        }
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <Typography variant="h6">Paying Population</Typography>

            <FormControl fullWidth>
                <InputLabel id="census-select-label">Census Category</InputLabel>
                <Select
                    labelId="census-select-label"
                    id="census-select"
                    value={selectedFigure.id}
                    label="Census Category"
                    onChange={handleChange}
                >
                    {CENSUS_FIGURES.map(figure => (
                        <MenuItem key={figure.id} value={figure.id}>
                            {figure.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <PopulationField val={val}/>
        </Box>
    );
};

export default PayingPopulation;
