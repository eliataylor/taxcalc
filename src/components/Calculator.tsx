import React, {useCallback, useMemo, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Paper,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ViewListIcon from '@mui/icons-material/ViewList';
import {v4 as uuidv4} from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import {useSearchParams} from 'react-router-dom';

import PayingPopulation from './inputs/PayingPopulation';
import MoneySupply from './inputs/MoneySupply';
import TaxBracket from './tax/TaxBracket';
import TaxBracketCondensed from './tax/TaxBracketCondensed.tsx';
import ScenarioManager from './tax/ScenarioManager.tsx';
import TotalTaxRevenueByBracket from './charts/TotalTaxRevenueByBracket';
import TaxDueOverNetWorth from './charts/TaxDueOverNetWorth';

import {LevyTypeDefinition, TaxBracketData} from '../types';
import {
    calculatePopulationBalance,
    calculateTaxPercentage,
    calculateTotalTax,
    updateBracketTaxes,
} from '../utils/calculations.ts';
import {formatPopulation} from '../utils/formatters.ts';
import {usePersistedState} from '../hooks/usePersistedState';
import {MONEY_SUPPLY_TYPES} from '../data/definitions.ts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C']
/**
 * Main calculator component that manages state and coordinates other components
 */
const Calculator: React.FC = () => {
    const {
        population,
        moneySupply,
        levyTypeDefs,
        brackets,
        setPopulation,
        setMoneySupply,
        setLevyTypeDefs,
        setBrackets,
        saveScenario,
        loadScenario,
        deleteScenario,
        resetToDefaults,
        scenarios,
        isLoading,
    } = usePersistedState();

    const [searchParams, setSearchParams] = useSearchParams();
    const viewMode = searchParams.get('view') === 'condensed' ? 'condensed' : 'edit';

    const setViewMode = useCallback((mode: 'edit' | 'condensed') => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (mode === 'edit') {
                next.delete('view');
            } else {
                next.set('view', mode);
            }
            return next;
        }, {replace: true});
    }, [setSearchParams]);

    const [newLevyName, setNewLevyName] = useState('');
    const [newLevyCategory, setNewLevyCategory] = useState<'asset' | 'debt'>('asset');

    const computedBrackets = useMemo(() => updateBracketTaxes(brackets), [brackets]);
    const totalTaxRevenue = useMemo(() => calculateTotalTax(computedBrackets), [computedBrackets]);
    const populationBalance = useMemo(
        () => calculatePopulationBalance(population, computedBrackets),
        [population, computedBrackets],
    );
    const taxBalancePercentage = useMemo(
        () => calculateTaxPercentage(totalTaxRevenue, moneySupply),
        [totalTaxRevenue, moneySupply],
    );

    const handleBracketChange = (id: string, changes: Partial<TaxBracketData>) => {
        setBrackets(brackets.map(bracket =>
            bracket.id === id ? {...bracket, ...changes} : bracket,
        ));
    };

    const addNewBracket = () => {
        const newBracket: TaxBracketData = {
            color: '#FF8042',
            id: uuidv4(),
            name: `Bracket ${brackets.length + 1}`,
            popPercent: 0,
            population: 0,
            levyTypes: levyTypeDefs.map(def => ({
                key: def.key,
                category: def.category,
                dollars: 0,
                taxRate: def.defaultRate,
            })),
        };
        setBrackets([...brackets, newBracket]);
    };

    const removeBracket = (id: string) => {
        setBrackets(brackets.filter(bracket => bracket.id !== id));
    };

    const addLevyType = () => {
        const trimmed = newLevyName.trim();
        if (!trimmed) return;
        const key = trimmed.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        if (levyTypeDefs.some(d => d.key === key)) return;

        const newDef: LevyTypeDefinition = {
            key,
            name: trimmed,
            description: '',
            defaultRate: 0.05,
            category: newLevyCategory,
        };
        setLevyTypeDefs([...levyTypeDefs, newDef]);
        setBrackets(brackets.map(bracket => ({
            ...bracket,
            levyTypes: [...bracket.levyTypes, {key, category: newLevyCategory, dollars: 0, taxRate: newDef.defaultRate}],
        })));
        setNewLevyName('');
        setNewLevyCategory('asset');
    };

    const removeLevyType = (key: string) => {
        setLevyTypeDefs(levyTypeDefs.filter(d => d.key !== key));
        setBrackets(brackets.map(bracket => ({
            ...bracket,
            levyTypes: bracket.levyTypes.filter(l => l.key !== key),
        })));
    };

    if (isLoading) {
        return (
            <Box sx={{p: 4, textAlign: 'center'}}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box width={'100%'}>
            <Grid container p={1} justifyContent={'space-between'}>
                <Grid>
                    <Typography variant="subtitle1">
                    </Typography>
                </Grid>
            </Grid>

            <Grid container spacing={1}>
                {/* Left column - Global settings */}
                <Grid container direction={'column'}
                sx={{padding:1.5}}
                     size={{xs: 12, md: 4}} gap={2} style={{position: 'relative'}}>

                        <Grid container mb={4} spacing={1} gap={2} justifyContent={'space-between'}>
                            <ScenarioManager
                                population={population}
                                moneySupply={moneySupply}
                                levyTypeDefs={levyTypeDefs}
                                brackets={computedBrackets}
                                totalTaxRevenue={totalTaxRevenue}
                                taxBalancePercentage={taxBalancePercentage}
                                scenarios={scenarios}
                                onSave={name => saveScenario(name, totalTaxRevenue, taxBalancePercentage)}
                                onLoad={loadScenario}
                                onDelete={deleteScenario}
                                onReset={resetToDefaults}
                            />
                        </Grid>

                        <Grid sx={{mb: 3}}>
                            <PayingPopulation
                                val={population}
                                onValueChange={setPopulation}
                            />
                        </Grid>

                        <Divider sx={{my: 3}}/>

                        <Grid>
                            <MoneySupply
                                val={moneySupply}
                                onValueChange={setMoneySupply}
                            />
                        </Grid>

                        <Divider sx={{my: 3}}/>

                        <Grid sx={{mb: 2}}>
                            <Typography variant="subtitle2">Total Tax Revenue:</Typography>
                            {(() => {
                                const ref = MONEY_SUPPLY_TYPES.find(m => m.value === moneySupply);
                                const refName = ref?.name ?? 'reference';
                                const isAnnualFlow = ['federal_budget', 'tax_revenue', 'discretionary'].includes(ref?.id ?? '');
                                const pct = taxBalancePercentage;
                                let color: string;
                                if (isAnnualFlow) {
                                    color = pct > 100 ? 'red' : pct >= 60 ? 'green' : 'orange';
                                } else {
                                    color = pct > 50 ? 'red' : pct > 15 ? 'orange' : 'green';
                                }
                                return (
                                    <Typography color={color}>
                                        ${formatPopulation(totalTaxRevenue)} ({pct.toFixed(2)}% of {refName})
                                    </Typography>
                                );
                            })()}
                        </Grid>

                        <Grid sx={{pt: 3}}>
                            <TotalTaxRevenueByBracket moneySupply={moneySupply}
                                                      brackets={computedBrackets}/>
                        </Grid>

                        <Grid>
                            <TaxDueOverNetWorth moneySupply={moneySupply}
                                                brackets={computedBrackets}/>
                        </Grid>
                </Grid>

                {/* Right column - Tax brackets and results */}
                <Grid size={{xs: 12, md: 8}}>
                    {/* View toggle + header */}
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, px: 1}}>
                        <Typography variant="h5">Tax Brackets</Typography>
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(_e, val) => val && setViewMode(val)}
                            size="small"
                        >
                            <ToggleButton value="edit">
                                <EditIcon sx={{fontSize: 18, mr: 0.5}}/>
                                Edit
                            </ToggleButton>
                            <ToggleButton value="condensed">
                                <ViewListIcon sx={{fontSize: 18, mr: 0.5}}/>
                                Summary
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {viewMode === 'edit' && (
                        <>
                            {/* Levy type management */}
                            <Paper sx={{p: 2, mb: 2}}>
                                <Typography variant="subtitle2" sx={{mb: 1}}>
                                    Net Worth Components (Levy Types)
                                </Typography>
                                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1}}>
                                    {levyTypeDefs.map(def => (
                                        <Chip
                                            key={def.key}
                                            label={def.name}
                                            color={def.category === 'debt' ? 'warning' : 'default'}
                                            variant={def.category === 'debt' ? 'outlined' : 'filled'}
                                            onDelete={() => removeLevyType(def.key)}
                                            size="small"
                                        />
                                    ))}
                                </Box>
                                <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                                    <TextField
                                        size="small"
                                        placeholder="New levy type name"
                                        value={newLevyName}
                                        onChange={e => setNewLevyName(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addLevyType()}
                                    />
                                    <ToggleButtonGroup
                                        value={newLevyCategory}
                                        exclusive
                                        onChange={(_e, val) => val && setNewLevyCategory(val)}
                                        size="small"
                                    >
                                        <ToggleButton value="asset">Asset</ToggleButton>
                                        <ToggleButton value="debt">Debt</ToggleButton>
                                    </ToggleButtonGroup>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AddIcon/>}
                                        onClick={addLevyType}
                                        disabled={!newLevyName.trim()}
                                    >
                                        Add
                                    </Button>
                                </Box>
                            </Paper>

                            <Paper sx={{p: 1, mb: 3}}>
                                <Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 2}}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size={'small'}
                                        onClick={addNewBracket}
                                    >
                                        Add Bracket
                                    </Button>
                                </Box>

                                {populationBalance !== 0 && (
                                    <Alert
                                        severity={populationBalance < 0 ? 'error' : 'warning'}
                                        sx={{mb: 2}}
                                    >
                                        {populationBalance < 0
                                            ? `Population mismatch: ${Math.abs(populationBalance).toLocaleString()} more people in brackets than total!`
                                            : `${populationBalance.toLocaleString()} people not included in any bracket.`}
                                    </Alert>
                                )}

                                {computedBrackets.map(bracket => (
                                    <Box key={bracket.id} sx={{mb: 2}}>
                                        <TaxBracket
                                            bracket={bracket}
                                            totalPopulation={population}
                                            levyTypeDefs={levyTypeDefs}
                                            onChange={handleBracketChange}
                                        />
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => removeBracket(bracket.id)}
                                            sx={{mt: -3}}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                ))}
                            </Paper>
                        </>
                    )}

                    {viewMode === 'condensed' && (
                        <Paper sx={{p: 2, mb: 3}}>
                            {populationBalance !== 0 && (
                                <Alert
                                    severity={populationBalance < 0 ? 'error' : 'warning'}
                                    sx={{mb: 2}}
                                >
                                    {populationBalance < 0
                                        ? `Population mismatch: ${Math.abs(populationBalance).toLocaleString()} more people in brackets than total!`
                                        : `${populationBalance.toLocaleString()} people not included in any bracket.`}
                                </Alert>
                            )}

                            {computedBrackets.map(bracket => (
                                <TaxBracketCondensed
                                    key={bracket.id}
                                    bracket={bracket}
                                    totalPopulation={population}
                                    levyTypeDefs={levyTypeDefs}
                                />
                            ))}

                            {/* Totals footer */}
                            {computedBrackets.length > 0 && (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    pt: 1.5,
                                    mt: 1,
                                    borderTop: 2,
                                    borderColor: 'divider',
                                }}>
                                    <Typography variant="subtitle2">
                                        Total Population: {formatPopulation(computedBrackets.reduce((s, b) => s + b.population, 0))}
                                    </Typography>
                                    <Typography variant="subtitle2">
                                        Total Revenue: ${formatPopulation(totalTaxRevenue)} ({taxBalancePercentage.toFixed(2)}%)
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Calculator;
