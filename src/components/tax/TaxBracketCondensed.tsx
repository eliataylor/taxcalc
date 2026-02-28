import React from 'react';
import {Box, Card, CardContent, Grid, LinearProgress, Link, Tooltip, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {LevyTypeDefinition, TaxBracketData} from '../../types';
import {formatMoney, formatPercentage, formatPopulation} from '../../utils/formatters.ts';
import {calculateBracketTax, calculateNetWorth} from '../../utils/calculations.ts';
import ClickToEdit from '../inputs/ClickToEdit.tsx';

interface TaxBracketCondensedProps {
    bracket: TaxBracketData;
    totalPopulation: number;
    levyTypeDefs: LevyTypeDefinition[];
    onChange?: (id: string, changes: Partial<TaxBracketData>) => void;
}

/**
 * Compact view of a tax bracket. Read-only by default; pass onChange to enable
 * click-to-edit on name, population, dollar amounts, and tax rates.
 */
const TaxBracketCondensed: React.FC<TaxBracketCondensedProps> = ({
    bracket,
    totalPopulation,
    levyTypeDefs,
    onChange,
}) => {
    const editable = !!onChange;
    const netWorth = calculateNetWorth(bracket);
    const tax = calculateBracketTax(bracket);
    const pop = bracket.population || 1;
    const popFraction = totalPopulation > 0 ? bracket.population / totalPopulation : 0;
    const effectiveRate = netWorth > 0 ? tax / netWorth : 0;

    const getLevyName = (key: string): string =>
        levyTypeDefs.find(d => d.key === key)?.name ?? key;

    const handleLevyField = (index: number, field: 'dollars' | 'taxRate', value: number) => {
        if (!onChange) return;
        const updated = [...bracket.levyTypes];
        updated[index] = {...updated[index], [field]: value};
        onChange(bracket.id, {levyTypes: updated});
    };

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
                    {editable ? (
                        <ClickToEdit
                            value={bracket.name}
                            type="text"
                            onCommit={v => onChange(bracket.id, {name: String(v)})}
                            typographyProps={{variant: 'subtitle1', sx: {fontWeight: 600, color: bracket.color}}}
                            inputWidth={160}
                        />
                    ) : (
                        <Typography variant="subtitle1" sx={{fontWeight: 600, color: bracket.color}}>
                            {bracket.name}
                        </Typography>
                    )}

                    <Box sx={{display: 'flex', alignItems: 'baseline', gap: 0.5}}>
                        <Typography variant="body2" color="text.secondary">pop:</Typography>
                        {editable ? (
                            <ClickToEdit
                                value={bracket.population}
                                type="number"
                                onCommit={v => onChange(bracket.id, {population: Math.round(Number(v))})}
                                format={v => formatPopulation(Number(v))}
                                typographyProps={{variant: 'body2', color: 'text.secondary'}}
                                inputWidth={120}
                            />
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                {formatPopulation(bracket.population)}
                            </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                            ({formatPercentage(popFraction)})
                        </Typography>
                    </Box>
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
                    {bracket.levyTypes.map((levy, index) => {
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
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                        {(() => {
                                            const def = levyTypeDefs.find(d => d.key === levy.key);
                                            return (
                                                <Tooltip
                                                    arrow
                                                    placement="top"
                                                    slotProps={{tooltip: {sx: {maxWidth: 360}}}}
                                                    title={
                                                        <Box sx={{p: 0.5}}>
                                                            {def?.description && (
                                                                <Typography variant="caption" display="block" sx={{mb: def?.rationale ? 0.75 : 0}}>
                                                                    {def.description}
                                                                </Typography>
                                                            )}
                                                            {def?.rationale && (
                                                                <Typography variant="caption" display="block" sx={{fontStyle: 'italic', opacity: 0.85}}>
                                                                    Rationale: {def.rationale}
                                                                </Typography>
                                                            )}
                                                            <Link
                                                                component={RouterLink}
                                                                to={`/variables#levy-${levy.key}`}
                                                                variant="caption"
                                                                sx={{display: 'block', mt: 0.75, color: 'info.light'}}
                                                            >
                                                                View full definition →
                                                            </Link>
                                                        </Box>
                                                    }
                                                >
                                                    <InfoOutlinedIcon sx={{fontSize: 12, color: 'text.disabled', cursor: 'help'}}/>
                                                </Tooltip>
                                            );
                                        })()}
                                        <Typography variant="caption" color={levy.category === 'debt' ? 'warning.main' : 'text.secondary'} sx={{minWidth: 120}}>
                                            {levy.category === 'debt' ? '− ' : ''}{getLevyName(levy.key)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{display: 'flex', gap: 2, alignItems: 'baseline'}}>
                                        {editable ? (
                                            <ClickToEdit
                                                value={levy.dollars}
                                                type="money"
                                                onCommit={v => handleLevyField(index, 'dollars', Number(v))}
                                                format={v => formatMoney(Number(v))}
                                                typographyProps={{variant: 'caption', color: 'text.secondary'}}
                                                inputWidth={100}
                                            />
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">
                                                {formatMoney(levy.dollars)}
                                            </Typography>
                                        )}
                                        {editable ? (
                                            <ClickToEdit
                                                value={levy.taxRate}
                                                type="percent"
                                                onCommit={v => handleLevyField(index, 'taxRate', Number(v))}
                                                format={v => formatPercentage(Number(v))}
                                                typographyProps={{variant: 'caption', sx: {minWidth: 40, textAlign: 'right'}}}
                                                inputWidth={60}
                                            />
                                        ) : (
                                            <Typography variant="caption" sx={{minWidth: 40, textAlign: 'right'}}>
                                                {formatPercentage(levy.taxRate)}
                                            </Typography>
                                        )}
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
                            {formatMoney(netWorth / pop, {notation: 'compact'})} per person
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ml: 0.5}}>
                            ({formatMoney(netWorth, {notation: 'compact'})} total)
                            </Typography>
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Tax Due</Typography>
                        <Typography variant="body2" sx={{fontWeight: 600, color: bracket.color}}>
                        {formatMoney(tax / pop, {notation: 'compact'})} per person 
                            <Typography component="span" variant="caption" color="text.secondary" sx={{ml: 0.5}}>
                            ({formatMoney(tax, {notation: 'compact'})} total)
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
