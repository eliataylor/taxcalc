import React from 'react';
import {Box, Card, CardContent, Grid, InputAdornment, Slider, TextField, Typography} from '@mui/material';
import {TaxBracketProps} from '../../types';
import {formatMoney, formatPercentage, formatPopulation} from '../../utils/formatters.ts';
import {lighten} from '@mui/material/styles'
import {calculateBracketTax, calculateNetWorth} from "../../utils/calculations.ts";

/**
 * Component for configuring a tax bracket
 */
const TaxBracket: React.FC<TaxBracketProps> = ({
                                                   bracket,
                                                   onChange
                                               }) => {
    const {id, name, population, popPercent} = bracket;

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(id, {name: e.target.value});
    };

    const handlePopulationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10) || 0;
        onChange(id, {population: value});
    };

    const handleLevyDollars = (index: number, dollars: number) => {
        const newLeviables = [...bracket.levyTypes]
        newLeviables[index].dollars = dollars;
        onChange(id, {levyTypes: newLeviables});
    };
    const handleLevyRate = (index: number, rate: number) => {
        const newLeviables = [...bracket.levyTypes]
        newLeviables[index].taxRate = rate / 100;
        onChange(id, {levyTypes: newLeviables});
    };


    return (
        <Card variant="outlined" sx={{mb: 2}}>
            <CardContent>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    <TextField
                        placeholder={'Tax Bracket Name'}
                        label="Bracket Name"
                        sx={{
                            '--mui-palette-primary-main': bracket.color,
                        }}
                        color="primary"
                        value={name}
                        onChange={handleNameChange}
                        fullWidth
                    />

                    <TextField
                        label="Population"
                        type="number"
                        value={Math.round(population)}
                        onChange={handlePopulationChange}
                        fullWidth
                        helperText={<Typography variant={'caption'} color={bracket.color}>
                            {formatPopulation(population)} is {formatPercentage(popPercent)} of paying population
                        </Typography>}
                    />

                    <Grid mt={3} direction={'column'} container justifyContent={'space-between'} gap={3}>
                        {bracket.levyTypes.map((levyType, index) => {
                            return <Grid container wrap={'nowrap'}
                                         justifyContent={'space-between'}
                                         alignContent={'flex-start'}
                                         alignItems={'flex-start'} gap={3}
                                         key={[bracket.id, levyType.name].join('-')}>
                                <Grid>
                                    <TextField
                                        label={levyType.name}
                                        value={levyType.dollars}
                                        onChange={(e) => handleLevyDollars(index, parseFloat(e.target.value) || 0)}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                        helperText={`${formatMoney(levyType.dollars)} per person`}
                                    />
                                </Grid>
                                <Grid sx={{flexGrow: 1}}>
                                    <Slider
                                        value={levyType.dollars === 0 ? 0 : levyType.taxRate * 100}
                                        onChange={(_e, newValue) => handleLevyRate(index, newValue)}
                                        aria-labelledby="tax-rate-slider"
                                        min={0}
                                        max={100}
                                        sx={{
                                            color: bracket.color,
                                            '&:hover': {
                                                color: lighten(bracket.color, .3),
                                            },
                                        }}
                                        step={1}
                                        disabled={levyType.dollars === 0}
                                    />

                                    <Typography align={'center'} variant={'subtitle2'}>
                                        Rate: {levyType.dollars === 0 ? `0%` : [formatPercentage(levyType.taxRate), formatMoney(levyType.taxRate * levyType.dollars)].join(' ')}
                                    </Typography>

                                </Grid>
                            </Grid>
                        })}
                    </Grid>

                    <Grid>
                        <Typography variant={'subtitle1'} align={'center'} color={bracket.color}><b>Net Worth</b>:
                            ${formatPopulation(calculateNetWorth(bracket))} /
                            ${formatPopulation(calculateNetWorth(bracket) / bracket.population)} per
                            person</Typography>
                        <Typography variant={'subtitle1'} align={'center'} color={bracket.color}><b>Taxes Due</b>:
                            ${formatPopulation(calculateBracketTax(bracket))} /
                            ${formatPopulation(calculateBracketTax(bracket) / bracket.population)} per
                            person</Typography>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TaxBracket;
