import React from 'react';
import {Box, Card, CardContent, Grid, InputAdornment, Slider, TextField, Tooltip, Typography} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {TaxBracketProps} from '../../types';
import {formatMoney, formatPercentage, formatPopulation} from '../../utils/formatters.ts';
import {lighten} from '@mui/material/styles';
import {calculateBracketTax, calculateNetWorth} from '../../utils/calculations.ts';

/**
 * Component for configuring a tax bracket
 */
const TaxBracket: React.FC<TaxBracketProps> = ({
                                                   bracket,
                                                   totalPopulation,
                                                   levyTypeDefs,
                                                   onChange,
                                               }) => {
    const {id, name, population} = bracket;
    const pop = population || 1;
    const popPercent = totalPopulation > 0 ? population / totalPopulation : 0;

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(id, {name: e.target.value});
    };

    const handlePopulationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10) || 0;
        onChange(id, {population: value});
    };

    const handleLevyDollars = (index: number, dollars: number) => {
        const newLeviables = [...bracket.levyTypes];
        newLeviables[index] = {...newLeviables[index], dollars};
        onChange(id, {levyTypes: newLeviables});
    };

    const handleLevyRate = (index: number, rate: number) => {
        const newLeviables = [...bracket.levyTypes];
        newLeviables[index] = {...newLeviables[index], taxRate: rate / 100};
        onChange(id, {levyTypes: newLeviables});
    };

    const getLevyName = (key: string): string => {
        return levyTypeDefs.find(d => d.key === key)?.name ?? key;
    };

    const getLevyDescription = (key: string): string | undefined => {
        return levyTypeDefs.find(d => d.key === key)?.description;
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
                        helperText={`${formatPopulation(population)} is ${formatPercentage(popPercent)} of paying population`}
                        slotProps={{
                            formHelperText: {
                                sx: {color: bracket.color}
                            }
                        }}
                    />

                    <Grid mt={3} direction={'column'} container justifyContent={'space-between'} gap={3}>
                        {bracket.levyTypes.map((levyType, index) => {
                            const levyName = getLevyName(levyType.key);
                            const levyDesc = getLevyDescription(levyType.key);

                            return (
                                <Grid container wrap={'nowrap'}
                                      justifyContent={'space-between'}
                                      alignContent={'flex-start'}
                                      alignItems={'flex-start'} gap={3}
                                      key={[bracket.id, levyType.key].join('-')}>
                                    <Grid>
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5}}>
                                            <Typography variant="caption" color={levyType.category === 'debt' ? 'warning.main' : 'text.secondary'}>
                                                {levyType.category === 'debt' ? '− ' : ''}{levyName}
                                            </Typography>
                                            {levyDesc && (
                                                <Tooltip title={levyDesc} arrow placement="top">
                                                    <InfoOutlinedIcon sx={{fontSize: 14, color: 'text.disabled', cursor: 'help'}}/>
                                                </Tooltip>
                                            )}
                                        </Box>
                                        <TextField
                                            label={levyName}
                                            value={levyType.dollars}
                                            onChange={(e) => handleLevyDollars(index, parseFloat(e.target.value) || 0)}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            }}
                                            helperText={`${formatMoney(levyType.dollars)} ~per person`}
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
                                            Rate: {levyType.dollars === 0 ? '0%' : [formatPercentage(levyType.taxRate), formatMoney(levyType.taxRate * levyType.dollars)].join(' ')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </Grid>

                    <Grid>
                        <Typography variant={'subtitle1'} align={'center'} color={bracket.color}><b>Net Wealth</b>:
                            ${formatPopulation(calculateNetWorth(bracket))} /
                            ${formatPopulation(calculateNetWorth(bracket) / pop)} ~per
                            person</Typography>
                        <Typography variant={'subtitle1'} align={'center'} color={bracket.color}><b>Taxes Due</b>:
                            ${formatPopulation(calculateBracketTax(bracket))} /
                            ${formatPopulation(calculateBracketTax(bracket) / pop)} ~per
                            person</Typography>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TaxBracket;
