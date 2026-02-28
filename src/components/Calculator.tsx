import React, { useCallback, useMemo, useState } from 'react';
import {
    Alert,
    AppBar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Toolbar,
    Tooltip,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ViewListIcon from '@mui/icons-material/ViewList';
import HomeIcon from '@mui/icons-material/Home';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { v4 as uuidv4 } from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';

import PayingPopulation from './inputs/PayingPopulation';
import BudgetTarget from './inputs/BudgetTarget';
import NetWorthTarget from './inputs/NetWorthTarget';
import LevyTypeEditor from './inputs/LevyTypeEditor';
// import TaxBracket from './tax/TaxBracket';
import TaxBracketCondensed from './tax/TaxBracketCondensed.tsx';
import ScenarioManager from './tax/ScenarioManager.tsx';
import TotalTaxRevenueByBracket from './charts/TotalTaxRevenueByBracket';
import TaxDueOverNetWorth from './charts/TaxDueOverNetWorth';
import TotalNetWorthByBracket from './charts/TotalNetWorthByBracket';

import { LevyTypeDefinition, TaxBracketData } from '../types';
import {
    calculateBracketTax,
    calculateNetWorth,
    calculatePopulationBalance,
    calculateTaxPercentage,
    calculateTotalNetWorth,
    calculateTotalTax,
    updateBracketTaxes,
} from '../utils/calculations.ts';
import { formatMoney, formatPopulation } from '../utils/formatters.ts';
import { usePersistedState } from '../hooks/usePersistedState';
import { DATA_MODELS } from '../data/definitions.ts';
import { Info } from '@mui/icons-material';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C']
/**
 * Main calculator component that manages state and coordinates other components
 */
const Calculator: React.FC = () => {
    const {
        modelId,
        population,
        populationName,
        populationDescription,
        budgetTarget,
        budgetTargetName,
        budgetTargetDescription,
        netWorthTarget,
        netWorthTargetName,
        netWorthTargetDescription,
        levyTypeDefs,
        brackets,
        loadModel,
        setPopulation,
        setPopulationMeta,
        setBudgetTarget,
        setBudgetTargetMeta,
        setNetWorthTarget,
        setNetWorthTargetMeta,
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
        }, { replace: true });
    }, [setSearchParams]);

    const [levyEditorOpen, setLevyEditorOpen] = useState(false);
    const [editingLevyDef, setEditingLevyDef] = useState<LevyTypeDefinition | null>(null);

    type SortField = 'population' | 'netWorth' | 'netWorthPerPerson' | 'effectiveRate' | 'totalTax';
    const [sortField, setSortField] = useState<SortField>('netWorth');
    const [sortAsc, setSortAsc] = useState(false);

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
    const totalNetWorth = useMemo(
        () => calculateTotalNetWorth(computedBrackets),
        [computedBrackets],
    );
    const netWorthBalance = netWorthTarget - totalNetWorth;

    const sortedBrackets = useMemo(() => {
        const sorted = [...computedBrackets].sort((a, b) => {
            let aVal = 0, bVal = 0;
            switch (sortField) {
                case 'population':
                    aVal = a.population;
                    bVal = b.population;
                    break;
                case 'netWorth':
                    aVal = calculateNetWorth(a);
                    bVal = calculateNetWorth(b);
                    break;
                case 'netWorthPerPerson':
                    aVal = a.population > 0 ? calculateNetWorth(a) / a.population : 0;
                    bVal = b.population > 0 ? calculateNetWorth(b) / b.population : 0;
                    break;
                case 'effectiveRate': {
                    const aNet = calculateNetWorth(a);
                    const bNet = calculateNetWorth(b);
                    aVal = aNet > 0 ? calculateBracketTax(a) / aNet : 0;
                    bVal = bNet > 0 ? calculateBracketTax(b) / bNet : 0;
                    break;
                }
                case 'totalTax':
                    aVal = calculateBracketTax(a);
                    bVal = calculateBracketTax(b);
                    break;
            }
            return sortAsc ? aVal - bVal : bVal - aVal;
        });
        return sorted;
    }, [computedBrackets, sortField, sortAsc]);

    const handleBracketChange = (id: string, changes: Partial<TaxBracketData>) => {
        setBrackets(brackets.map(bracket =>
            bracket.id === id ? { ...bracket, ...changes } : bracket,
        ));
    };

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    const addNewBracket = () => {
        const newBracket: TaxBracketData = {
            color: getRandomColor(),
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
                levyTypes: [...bracket.levyTypes, { key: def.key, category: def.category, dollars: 0, taxRate: def.defaultRate }],
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
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box width={'100%'} >
            {/* ── Consolidated header bar ── */}
            <AppBar position="relative" elevation={2} >
                <Toolbar sx={{ display: 'flex', alignItems: 'space-between', gap: 1, backgroundColor: '#0c0c0c' }}>
                    <Tooltip title="Back to Home">
                        <IconButton component={RouterLink} to="/" size="small">
                            <HomeIcon />
                        </IconButton>
                    </Tooltip>

                    <Box sx={{ width: '100%', ml:2 }}>
                    <TextField 
                    value={modelId}
                    onChange={(e) => loadModel(e.target.value)}
                    select                    
                    label="Data Model"
                    size="small"
                    variant="standard"
                    >
                        {DATA_MODELS.map(m => (
                            <MenuItem key={m.id} value={m.id}>
                                <Tooltip title={m.description} placement="right" arrow>
                                    <Box sx={{ width: '100%' }}>{m.name}</Box>
                                </Tooltip>
                            </MenuItem>
                        ))}
                    </TextField>
                    </Box>

                    <ScenarioManager
                        currentState={{
                            modelId,
                            population,
                            populationName,
                            populationDescription,
                            budgetTarget,
                            budgetTargetName,
                            budgetTargetDescription,
                            netWorthTarget,
                            netWorthTargetName,
                            netWorthTargetDescription,
                            levyTypeDefs,
                            brackets: computedBrackets,
                        }}
                        totalTaxRevenue={totalTaxRevenue}
                        taxBalancePercentage={taxBalancePercentage}
                        scenarios={scenarios}
                        onSave={name => saveScenario(name, totalTaxRevenue, taxBalancePercentage)}
                        onLoad={loadScenario}
                        onDelete={deleteScenario}
                        onReset={resetToDefaults}
                    />
                </Toolbar>
            </AppBar>

            <Grid container spacing={1} sx={{py:4}}>
                {/* Left column - Global settings */}
                <Grid container direction={'column'}
                    sx={{ px: 1 }}
                    size={{ xs: 12, md: 4 }}
                 gap={2} style={{ position: 'relative' }}>

                    {/* Inputs */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <PayingPopulation
                            val={population}
                            name={populationName}
                            description={populationDescription}
                            onValueChange={setPopulation}
                            onMetaChange={setPopulationMeta}
                        />
                        <BudgetTarget
                            val={budgetTarget}
                            name={budgetTargetName}
                            description={budgetTargetDescription}
                            onValueChange={setBudgetTarget}
                            onMetaChange={setBudgetTargetMeta}
                        />
                        <NetWorthTarget
                            val={netWorthTarget}
                            name={netWorthTargetName}
                            description={netWorthTargetDescription}
                            onValueChange={setNetWorthTarget}
                            onMetaChange={setNetWorthTargetMeta}
                        />
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* Results: bracket sums → total → coverage equation */}
                    {(() => {
                        const pct = taxBalancePercentage;
                        const color = pct >= 100 ? 'green' : pct >= 90 ? 'orange' : 'red';
                        return (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {/* Bracket sums mini-table */}
                                <Box sx={{ px: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ letterSpacing: 0.5 }}>
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
                                                <Typography variant="caption" sx={{ color: b.color, fontWeight: 600 }}>
                                                    {b.name}
                                                </Typography>
                                                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                                                    {formatMoney(tax, { notation: 'compact' })}
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
                                        <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                                            {formatMoney(totalTaxRevenue, { notation: 'compact' })}
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
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="body2" fontWeight={600}>
                                            {formatMoney(totalTaxRevenue, { notation: 'compact' })}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                                            revenue
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" color="text.disabled">÷</Typography>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="body2" fontWeight={600}>
                                            {formatMoney(budgetTarget, { notation: 'compact' })}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                                            target
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" color="text.disabled">=</Typography>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="body2" fontWeight={700} color={color}>
                                            {pct.toFixed(2)}%
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                                            coverage
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        );
                    })()}

                    <Grid sx={{ pt: 3 }}>
                        <TotalTaxRevenueByBracket budgetTarget={budgetTarget}
                            brackets={computedBrackets} />
                    </Grid>

                    <Grid>
                        <TotalNetWorthByBracket brackets={computedBrackets} />
                    </Grid>

                    <Grid>
                        <TaxDueOverNetWorth budgetTarget={budgetTarget}
                            brackets={computedBrackets} />
                    </Grid>
                </Grid>

                {/* Right column - Tax brackets and results */}
                <Grid size={{ xs: 12, md: 8 }}>

                    {viewMode === 'edit' && (
                        <>
                            {/* Levy type management */}
                            <Paper sx={{ p: 2, mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="subtitle2">
                                        Holdings &amp; Debts
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={() => { setEditingLevyDef(null); setLevyEditorOpen(true); }}
                                    >
                                        Add
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {levyTypeDefs.map(def => (
                                        <Chip
                                            key={def.key}
                                            label={def.name}
                                            color={def.category === 'debt' ? 'warning' : 'default'}
                                            variant={def.category === 'debt' ? 'outlined' : 'filled'}
                                            icon={<Info />}
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
                        </>
                    )}

                    <Box sx={{ px: 2 }}>
                        <Grid container sx={{mb: 2}} >
                            <Grid flexGrow={1}>
                                <FormControl size="small" sx={{ minWidth: 200 }}>
                                    <InputLabel id="sort-brackets-label">Sort Brackets By</InputLabel>
                                    <Select
                                        labelId="sort-brackets-label"
                                        label="Sort Brackets By"
                                        value={sortField}
                                        onChange={e => setSortField(e.target.value as SortField)}
                                    >
                                        <MenuItem value="population">Total Population</MenuItem>
                                        <MenuItem value="netWorth">Total Net Wealth</MenuItem>
                                        <MenuItem value="netWorthPerPerson">Net Wealth per Person</MenuItem>
                                        <MenuItem value="effectiveRate">Effective Rate</MenuItem>
                                        <MenuItem value="totalTax">Total Taxes Due</MenuItem>
                                    </Select>
                                </FormControl>
                                <Tooltip title={sortAsc ? 'Ascending' : 'Descending'}>
                                    <IconButton size="small" onClick={() => setSortAsc(prev => !prev)}>
                                        {sortAsc ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                                    </IconButton>
                                </Tooltip>
                            </Grid>

                            <Grid>
                            <ToggleButtonGroup
                                value={viewMode}
                                exclusive
                                onChange={(_e, val) => val && setViewMode(val)}
                                size="small"
                                color="secondary"
                            >
                                <ToggleButton value="condensed">
                                    <ViewListIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                    Summary
                                </ToggleButton>
                                <ToggleButton value="edit">
                                    <EditIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                    Edit
                                </ToggleButton>
                            </ToggleButtonGroup>
                            </Grid>
                        </Grid>

                        {populationBalance !== 0 && (
                            <Alert
                                severity={populationBalance < 0 ? 'error' : 'warning'}
                                sx={{ mb: 2 }}
                            >
                                {populationBalance < 0
                                    ? `Population mismatch: ${Math.abs(populationBalance).toLocaleString()} more people in brackets than total!`
                                    : `${populationBalance.toLocaleString()} people not included in any bracket.`}
                            </Alert>
                        )}

                        {netWorthBalance !== 0 && (() => {
                            const pctOff = netWorthTarget > 0
                                ? Math.abs(netWorthBalance) / netWorthTarget
                                : 1;
                            const severity = pctOff <= 0.001 ? 'success' : pctOff <= 0.01 ? 'warning' : 'error';
                            return (
                                <Alert severity={'warning'} color={severity} sx={{mb: 2}}>
                                    {netWorthBalance < 0
                                        ? `net wealth still exceeds target by ${formatMoney(Math.abs(netWorthBalance), {notation: 'compact'})}`
                                        : `${formatMoney(netWorthBalance, {notation: 'compact'})} in net wealth not accounted for in brackets`}
                                </Alert>
                            );
                        })()}

                        {sortedBrackets.map(bracket => (
                            <Box key={bracket.id} sx={{ position: 'relative' }}>
                                <TaxBracketCondensed
                                    bracket={bracket}
                                    totalPopulation={population}
                                    levyTypeDefs={levyTypeDefs}
                                    onChange={viewMode === 'edit' ? handleBracketChange : undefined}
                                />
                                {viewMode === 'edit' && (
                                    <Button
                                        variant="text"
                                        color="error"
                                        size="small"
                                        onClick={() => removeBracket(bracket.id)}
                                        sx={{ position: 'absolute', top: 4, right: 4, minWidth: 0, fontSize: 11 }}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </Box>
                        ))}

                        {viewMode === 'edit' && (
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={addNewBracket}
                                >
                                    Add Bracket
                                </Button>
                            </Box>
                        )}
                    </Box>

                    {/* Totals footer */}
                    {computedBrackets.length > 0 && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            pt: .5,
                            mt: 2,
                            mx: 2,
                            borderTop: 1,
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
                </Grid>
            </Grid>

            <Dialog open={isStale} onClose={dismissStale} maxWidth="sm" fullWidth>
                <DialogTitle>Default Variables Updated</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 1 }}>
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
