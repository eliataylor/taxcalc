import React from 'react';
import {Box, Card, CardContent, InputAdornment, Slider, TextField, Typography} from '@mui/material';
import MoneyField from '../inputs/MoneyField';
import PopulationField from '../inputs/PopulationField';
import {TaxBracketProps} from '../../types';
import {formatPercentage} from '../../utils/formatters.ts';

/**
 * Component for configuring a tax bracket
 */
const TaxBracket: React.FC<TaxBracketProps> = ({
                                                   bracket,
                                                   totalPopulation,
                                                   onChange
                                               }) => {
    const {id, name, population, incomeThreshold, taxRate} = bracket;

    const populationPercentage = totalPopulation > 0
        ? (population / totalPopulation) * 100
        : 0;

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(id, {name: e.target.value});
    };

    const handlePopulationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10) || 0;
        onChange(id, {population: value});
    };

    const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        onChange(id, {incomeThreshold: value});
    };

    const handleTaxRateChange = (_event: Event, newValue: number | number[]) => {
        onChange(id, {taxRate: (newValue as number) / 100});
    };

    return (
        <Card variant="outlined" sx={{mb: 2}}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {name || "Tax Bracket"}
                </Typography>

                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    <TextField
                        label="Bracket Name"
                        value={name}
                        onChange={handleNameChange}
                        fullWidth
                    />

                    <TextField
                        label="Population Count"
                        type="number"
                        value={population}
                        onChange={handlePopulationChange}
                        fullWidth
                        InputProps={{
                            endAdornment: <InputAdornment position="end">people</InputAdornment>,
                        }}
                    />

                    <Box>
                        <PopulationField val={population}/>
                        <Typography variant="body2" color="text.secondary">
                            {formatPercentage(populationPercentage / 100)} of total population
                        </Typography>
                    </Box>

                    <TextField
                        label="Income Threshold"
                        type="number"
                        value={incomeThreshold}
                        onChange={handleThresholdChange}
                        fullWidth
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                    />

                    <Box>
                        <Typography gutterBottom>
                            Tax Rate: {formatPercentage(taxRate)}
                        </Typography>
                        <Slider
                            value={taxRate * 100}
                            onChange={handleTaxRateChange}
                            aria-labelledby="tax-rate-slider"
                            min={0}
                            max={100}
                            step={0.1}
                        />
                    </Box>

                    <MoneyField
                        val={incomeThreshold * population}
                        levy={taxRate}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default TaxBracket;
