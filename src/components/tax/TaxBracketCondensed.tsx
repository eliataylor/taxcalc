import React from 'react';
import {Box, Card, CardContent, Grid, LinearProgress, Tooltip, Typography} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {LevyTypeDefinition, TaxBracketData} from '../../types';
import {formatMoney, formatPercentage, formatPopulation} from '../../utils/formatters.ts';
import {calculateBracketTax, calculateNetWorth} from '../../utils/calculations.ts';

interface TaxBracketCondensedProps {
    bracket: TaxBracketData;
    totalPopulation: number;
    levyTypeDefs: LevyTypeDefinition[];
}

/**
 * Read-only condensed view of a tax bracket, showing key figures in a compact card
 */
const TaxBracketCondensed: React.FC<TaxBracketCondensedProps> = ({
    bracket,
    totalPopulation,
    levyTypeDefs,
}) => {
    const netWorth = calculateNetWorth(bracket);
    const tax = calculateBracketTax(bracket);
    const pop = bracket.population || 1;
    const popFraction = totalPopulation > 0 ? bracket.population / totalPopulation : 0;
    const effectiveRate = netWorth > 0 ? tax / netWorth : 0;

    const getLevyName = (key: string): string =>
        levyTypeDefs.find(d => d.key === key)?.name ?? key;

    return (
        <Card
            variant="outlined"
            sx={{
                mb: 1,
                borderLeft: 4,
                borderLeftColor: bracket.color,
            }}
        >
            <CardContent sx={{py: 1.5, px: 2, '&:last-child': {pb: 1.5}}}>
                {/* Header row: name + population */}
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1}}>
                    <Typography variant="subtitle1" sx={{fontWeight: 600, color: bracket.color}}>
                        {bracket.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatPopulation(bracket.population)} ({formatPercentage(popFraction)})
                    </Typography>
                </Box>

                {/* Population bar */}
                <LinearProgress
                    variant="determinate"
                    value={Math.min(popFraction * 100, 100)}
                    sx={{
                        mb: 1.5,
                        height: 4,
                        borderRadius: 2,
                        bgcolor: 'action.hover',
                        '& .MuiLinearProgress-bar': {bgcolor: bracket.color},
                    }}
                />

                {/* Levy breakdown - compact table-like rows */}
                <Grid container spacing={0.5} sx={{mb: 1.5}}>
                    {bracket.levyTypes.map(levy => {
                        const levyTax = levy.taxRate * levy.dollars;
                        return (
                            <Grid size={12} key={levy.key}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    py: 0.25,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                                        <Typography variant="caption" color={levy.category === 'debt' ? 'warning.main' : 'text.secondary'} sx={{minWidth: 120}}>
                                            {levy.category === 'debt' ? '− ' : ''}{getLevyName(levy.key)}
                                        </Typography>
                                        <Tooltip title={levyTypeDefs.find(d => d.key === levy.key)?.description || ''} arrow placement="top">
                                            <InfoOutlinedIcon sx={{fontSize: 12, color: 'text.disabled', cursor: 'help'}}/>
                                        </Tooltip>
                                    </Box>
                                    <Box sx={{display: 'flex', gap: 2, alignItems: 'baseline'}}>
                                        <Typography variant="caption" color="text.secondary">
                                            {formatMoney(levy.dollars)}
                                        </Typography>
                                        <Typography variant="caption" sx={{minWidth: 40, textAlign: 'right'}}>
                                            {levy.dollars === 0 ? '—' : formatPercentage(levy.taxRate)}
                                        </Typography>
                                        <Typography variant="caption" sx={{fontWeight: 500, minWidth: 60, textAlign: 'right'}}>
                                            {levy.dollars === 0 ? '—' : formatMoney(levyTax)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>

                {/* Summary row */}
                <Box sx={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1}}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Net Worth</Typography>
                        <Typography variant="body2" sx={{fontWeight: 600}}>
                            ${formatPopulation(netWorth)}
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ml: 0.5}}>
                                (${formatMoney(netWorth / pop, {notation: 'compact'})} ~per person)
                            </Typography>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Tax Due</Typography>
                        <Typography variant="body2" sx={{fontWeight: 600, color: bracket.color}}>
                            ${formatPopulation(tax)}
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ml: 0.5}}>
                                (${formatMoney(tax / pop, {notation: 'compact'})} ~per person)
                            </Typography>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Effective Rate</Typography>
                        <Typography variant="body2" sx={{fontWeight: 600}}>
                            {formatPercentage(effectiveRate)}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TaxBracketCondensed;
