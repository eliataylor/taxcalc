import React, {useCallback, useMemo, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ViewListIcon from '@mui/icons-material/ViewList';
import HomeIcon from '@mui/icons-material/Home';
import {v4 as uuidv4} from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import {Link as RouterLink, useSearchParams} from 'react-router-dom';

import PayingPopulation from './inputs/PayingPopulation';
import BudgetTarget from './inputs/BudgetTarget';
import LevyTypeEditor from './inputs/LevyTypeEditor';
// import TaxBracket from './tax/TaxBracket';
import TaxBracketCondensed from './tax/TaxBracketCondensed.tsx';
import ScenarioManager from './tax/ScenarioManager.tsx';
import TotalTaxRevenueByBracket from './charts/TotalTaxRevenueByBracket';
import TaxDueOverNetWorth from './charts/TaxDueOverNetWorth';

import {LevyTypeDefinition, TaxBracketData} from '../types';
import {
    calculateBracketTax,
    calculatePopulationBalance,
    calculateTaxPercentage,
    calculateTotalTax,
    updateBracketTaxes,
} from '../utils/calculations.ts';
import {formatMoney, formatPopulation} from '../utils/formatters.ts';
import {usePersistedState} from '../hooks/usePersistedState';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C']
/**
 * Main calculator component that manages state and coordinates other components
 */
const Calculator: React.FC = () => {
    const {
        population,
        budgetTarget,
        levyTypeDefs,
        brackets,
        setPopulation,
        setBudgetTarget,
        setLevyTypeDefs,
        setBrackets,
        saveScenario,
        loadScenario,
        deleteScenario,
        resetToDefaults,
        dismissStale,
        scenarios,
        isLoading,
        isStale,
    } = usePersistedState();

    const [searchParams, setSearchParams] = useSearchParams();
    const viewMode = searchParams.get('view') === 'edit' ? 'edit' : 'condensed';

    const setViewMode = useCallback((mode: 'edit' | 'condensed') => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (mode === 'edit') {
                next.set('view', 'edit');
            } else {
                next.delete('view');
            }
            return next;
        }, {replace: true});
    }, [setSearchParams]);

    const [levyEditorOpen, setLevyEditorOpen] = useState(false);
    const [editingLevyDef, setEditingLevyDef] = useState<LevyTypeDefinition | null>(null);

    const computedBrackets = useMemo(() => updateBracketTaxes(brackets), [brackets]);
    const totalTaxRevenue = useMemo(() => calculateTotalTax(computedBrackets), [computedBrackets]);
    const populationBalance = useMemo(
        () => calculatePopulationBalance(population, computedBrackets),
        [population, computedBrackets],
    );
    const taxBalancePercentage = useMemo(
        () => calculateTaxPercentage(totalTaxRevenue, budgetTarget),
        [totalTaxRevenue, budgetTarget],
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

    const saveLevyType = (def: LevyTypeDefinition) => {
        const existingIndex = levyTypeDefs.findIndex(d => d.key === def.key);
        if (existingIndex >= 0) {
            setLevyTypeDefs(levyTypeDefs.map(d => d.key === def.key ? def : d));
        } else {
            setLevyTypeDefs([...levyTypeDefs, def]);
            setBrackets(brackets.map(bracket => ({
                ...bracket,
                levyTypes: [...bracket.levyTypes, {key: def.key, category: def.category, dollars: 0, taxRate: def.defaultRate}],
            })));
        }
        setEditingLevyDef(null);
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
            {/* ── Consolidated header bar ── */}
            <Paper
                elevation={1}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                    px: 2,
                    py: 1,
                    mb: 1,
                    position: 'sticky',
                    top: 0,
                    zIndex: 'appBar',
                    borderRadius: 0,
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Tooltip title="Back to Home">
                        <IconButton component={RouterLink} to="/" size="small">
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>

                    <ScenarioManager
                        population={population}
                        budgetTarget={budgetTarget}
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
                </Box>

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
            </Paper>

            <Grid container spacing={1}>
                {/* Left column - Global settings */}
                <Grid container direction={'column'}
                sx={{padding:1.5}}
                     size={{xs: 12, md: 4}} gap={2} style={{position: 'relative'}}>

                        {/* Inputs */}
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <PayingPopulation
                                val={population}
                                onValueChange={setPopulation}
                            />
                            <BudgetTarget
                                val={budgetTarget}
                                onValueChange={setBudgetTarget}
                            />
                        </Box>

                        <Divider sx={{my: 1}} />

                        {/* Results: bracket sums → total → coverage equation */}
                        {(() => {
                            const pct = taxBalancePercentage;
                            const color = pct > 100 ? 'red' : pct >= 60 ? 'green' : 'orange';
                            return (
                                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                                    {/* Bracket sums mini-table */}
                                    <Box sx={{px: 0.5}}>
                                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{letterSpacing: 0.5}}>
                                            REVENUE BY BRACKET
                                        </Typography>
                                        {computedBrackets.map((b) => {
                                            const tax = calculateBracketTax(b);
                                            return (
                                                <Box key={b.id} sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    py: 0.25,
                                                }}>
                                                    <Typography variant="caption" sx={{color: b.color, fontWeight: 600}}>
                                                        {b.name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{fontFamily: 'monospace', fontWeight: 500}}>
                                                        {formatMoney(tax, {notation: 'compact'})}
                                                    </Typography>
                                                </Box>
                                            );
                                        })}

                                        {/* Total row */}
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderTop: 1,
                                            borderColor: 'divider',
                                            mt: 0.5,
                                            pt: 0.5,
                                        }}>
                                            <Typography variant="caption" fontWeight={700}>
                                                Total
                                            </Typography>
                                            <Typography variant="caption" sx={{fontFamily: 'monospace', fontWeight: 700}}>
                                                {formatMoney(totalTaxRevenue, {notation: 'compact'})}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Equation: revenue ÷ target = % */}
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 1,
                                        py: 1,
                                        px: 1.5,
                                        borderRadius: 1,
                                        bgcolor: 'action.hover',
                                    }}>
                                        <Box sx={{textAlign: 'center'}}>
                                            <Typography variant="body2" fontWeight={600}>
                                                {formatMoney(totalTaxRevenue, {notation: 'compact'})}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{lineHeight: 1}}>
                                                revenue
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" color="text.disabled">÷</Typography>
                                        <Box sx={{textAlign: 'center'}}>
                                            <Typography variant="body2" fontWeight={600}>
                                                {formatMoney(budgetTarget, {notation: 'compact'})}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{lineHeight: 1}}>
                                                target
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" color="text.disabled">=</Typography>
                                        <Box sx={{textAlign: 'center'}}>
                                            <Typography variant="body2" fontWeight={700} color={color}>
                                                {pct.toFixed(2)}%
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{lineHeight: 1}}>
                                                coverage
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })()}

                        <Grid sx={{pt: 3}}>
                            <TotalTaxRevenueByBracket budgetTarget={budgetTarget}
                                                      brackets={computedBrackets}/>
                        </Grid>

                        <Grid>
                            <TaxDueOverNetWorth budgetTarget={budgetTarget}
                                                brackets={computedBrackets}/>
                        </Grid>
                </Grid>

                {/* Right column - Tax brackets and results */}
                <Grid size={{xs: 12, md: 8}}>

                    {viewMode === 'edit' && (
                        <>
                            {/* Levy type management */}
                            <Paper sx={{p: 2, mb: 2}}>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                                    <Typography variant="subtitle2">
                                        Holdings &amp; Debts
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AddIcon/>}
                                        onClick={() => { setEditingLevyDef(null); setLevyEditorOpen(true); }}
                                    >
                                        Add
                                    </Button>
                                </Box>
                                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                    {levyTypeDefs.map(def => (
                                        <Chip
                                            key={def.key}
                                            label={def.name}
                                            color={def.category === 'debt' ? 'warning' : 'default'}
                                            variant={def.category === 'debt' ? 'outlined' : 'filled'}
                                            onClick={() => { setEditingLevyDef(def); setLevyEditorOpen(true); }}
                                            onDelete={() => removeLevyType(def.key)}
                                            size="small"
                                        />
                                    ))}
                                </Box>
                            </Paper>
                            <LevyTypeEditor
                                open={levyEditorOpen}
                                onClose={() => setLevyEditorOpen(false)}
                                onSave={saveLevyType}
                                existing={editingLevyDef}
                            />

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
                                    <Box key={bracket.id} sx={{position: 'relative'}}>
                                        <TaxBracketCondensed
                                            bracket={bracket}
                                            totalPopulation={population}
                                            levyTypeDefs={levyTypeDefs}
                                            onChange={handleBracketChange}
                                        />
                                        <Button
                                            variant="text"
                                            color="error"
                                            size="small"
                                            onClick={() => removeBracket(bracket.id)}
                                            sx={{position: 'absolute', top: 4, right: 4, minWidth: 0, fontSize: 11}}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                ))}

<Box sx={{display: 'flex', justifyContent: 'flex-end', mb: 1}}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size={'small'}
                                        onClick={addNewBracket}
                                    >
                                        Add Bracket
                                    </Button>
                                </Box>
                            </Paper>
                        </>
                    )}

                    {viewMode === 'condensed' && (
                        <Box sx={{p: 2, mb: 3}}>
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
                        </Box>
                    )}
                </Grid>
            </Grid>

            <Dialog open={isStale} onClose={dismissStale} maxWidth="sm" fullWidth>
                <DialogTitle>Default Variables Updated</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{mb: 1}}>
                        The default tax categories and rates have been updated since your last session.
                        You can reset to the latest defaults or keep your current configuration.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Your saved scenarios are not affected.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={dismissStale}>
                        Keep My Settings
                    </Button>
                    <Button onClick={resetToDefaults} variant="contained" color="primary">
                        Reset to Defaults
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Calculator;
