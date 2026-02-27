import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import {Link as RouterLink, useLocation} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {LevyTypeDefinition, PersistedState, TaxBracketData} from '../types';
import {
    BUDGET_TARGETS,
    CENSUS_FIGURES,
    MONEY_SUPPLY_REFS,
} from '../data/definitions.ts';
import {calculateBracketTax, calculateNetWorth} from '../utils/calculations.ts';
import {formatMoney, formatPercentage, formatPopulation} from '../utils/formatters.ts';

const STATE_KEY = 'taxcalc_state';

function readPersistedState(): PersistedState | null {
    try {
        const raw = localStorage.getItem(STATE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

const VariablesPage: React.FC = () => {
    const [userState, setUserState] = useState<PersistedState | null>(null);
    const location = useLocation();

    useEffect(() => {
        setUserState(readPersistedState());
    }, []);

    useEffect(() => {
        if (location.hash) {
            const el = document.getElementById(location.hash.slice(1));
            if (el) {
                el.scrollIntoView({behavior: 'smooth', block: 'center'});
                el.style.transition = 'background-color 0.4s';
                el.style.backgroundColor = 'rgba(25,118,210,0.15)';
                const timeout = setTimeout(() => { el.style.backgroundColor = ''; }, 2500);
                return () => clearTimeout(timeout);
            }
        }
    }, [location.hash]);

    const userLevyDefs: LevyTypeDefinition[] = userState?.levyTypeDefs.sort((a) => a.category === 'debt' ? 1 : -1) ?? [];
    const userBrackets: TaxBracketData[] = userState?.brackets ?? [];

    return (
        <Box sx={{maxWidth: 900, mx: 'auto', px: 2, py: 4}}>
            <Button
                component={RouterLink}
                to="/"
                startIcon={<ArrowBackIcon/>}
                sx={{mb: 2}}
                size="small"
            >
                Home
            </Button>

            <Typography variant="h4" component="h1" sx={{mb: 1, fontWeight: 600}}>
                Model Variables and Bracket Construction
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{mb: 4}}>
                This model explores taxation based on <strong>Net Worth</strong> rather than Annual Income.
                Below is a complete reference of all variables, formulas, and constraints used in the calculator.
            </Typography>

            {/* Section 1: Global Inputs - Population */}
            <Typography variant="h6" sx={{mb: 1}}>Paying Population Options</Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                The total population against which tax brackets are allocated. All bracket populations must sum to this figure.
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{mb: 4}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell align="right"><strong>Value</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {CENSUS_FIGURES.map(fig => (
                            <TableRow key={fig.id}>
                                <TableCell>{fig.name}</TableCell>
                                <TableCell align="right">{formatPopulation(fig.value)}</TableCell>
                                <TableCell>{fig.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Section 2: Budget Target Options */}
            <Typography variant="h6" sx={{mb: 1}}>Budget Target Options</Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                The spending goal used to evaluate whether total tax revenue is sufficient. Total revenue is shown as a percentage of this target. Users can also enter a custom dollar amount.
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{mb: 4}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Preset</strong></TableCell>
                            <TableCell align="right"><strong>Value</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {BUDGET_TARGETS.map(bt => (
                            <TableRow key={bt.id}>
                                <TableCell>{bt.name}</TableCell>
                                <TableCell align="right">${formatPopulation(bt.value)}</TableCell>
                                <TableCell>{bt.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Section 2b: Money Supply Reference Figures */}
            <Typography variant="h6" sx={{mb: 1}}>Money Supply Reference Figures</Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                These are not budget targets but provide economic context — what fraction of circulating money would this tax capture?
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{mb: 4}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Measure</strong></TableCell>
                            <TableCell align="right"><strong>Value</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(MONEY_SUPPLY_REFS).map(([key, ref]) => (
                            <TableRow key={key}>
                                <TableCell>{ref.name}</TableCell>
                                <TableCell align="right">${formatPopulation(ref.value)}</TableCell>
                                <TableCell>{ref.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {/* Section 4: Bracket Anatomy */}
            <Typography variant="h6" sx={{mb: 1}}>Bracket Anatomy</Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                Each tax bracket represents a segment of the paying population grouped by wealth tier. A bracket contains:
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{mb: 4}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Field</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell><code>name</code></TableCell>
                            <TableCell>Label for the wealth tier (e.g. &ldquo;Not Holding&rdquo;, &ldquo;Mid Holders&rdquo;)</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><code>population</code></TableCell>
                            <TableCell>Number of individuals assigned to this bracket</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><code>popPercent</code></TableCell>
                            <TableCell>Bracket population as a fraction of total paying population</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><code>levyTypes[]</code></TableCell>
                            <TableCell>Array of asset and debt categories, each with <code>key</code>, <code>category</code> (&ldquo;asset&rdquo; or &ldquo;debt&rdquo;), <code>dollars</code> (~per-person value), and <code>taxRate</code></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Section 5: Population Constraint */}
            <Typography variant="h6" sx={{mb: 1}}>Population Constraint</Typography>
            <Paper variant="outlined" sx={{p: 2, mb: 4}}>
                <Typography variant="body1" sx={{mb: 1, fontFamily: 'monospace'}}>
                    sum(bracket.population) = payingPopulation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    The sum of all bracket populations must equal the selected paying population.
                    The calculator displays a warning when people are unaccounted for, and an error when bracket totals exceed the population.
                </Typography>
            </Paper>

            {/* Section 6: Calculation Formulas */}
            <Typography variant="h6" sx={{mb: 1}}>Calculation Formulas</Typography>
            <TableContainer component={Paper} variant="outlined" sx={{mb: 4}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Metric</strong></TableCell>
                            <TableCell><strong>Formula</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Per-Bracket Tax</TableCell>
                            <TableCell><code>(sum(assetRate * assetDollars) &minus; sum(debtRate * debtDollars)) * population</code></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Per-Bracket Net Worth</TableCell>
                            <TableCell><code>(sum(assetDollars) &minus; sum(debtDollars)) * population</code></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Gross Holdings</TableCell>
                            <TableCell><code>sum(assetDollars) * population</code> (debts excluded)</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Total Tax Revenue</TableCell>
                            <TableCell><code>sum(bracketTax)</code> across all brackets</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Coverage (% of Budget Target)</TableCell>
                            <TableCell><code>(totalTaxRevenue / budgetTarget) * 100</code></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider sx={{my: 4}}/>

            <Typography variant="h5" sx={{mb: 1}}>Holdings &amp; Debts</Typography>

            <Paper variant="outlined" sx={{p: 3}}>
            <Typography variant="body2" color="text.secondary" sx={{mb: 3}}>
                Net Worth = Holdings &minus; Debts. Each category has a ~per-person dollar amount and an independent rate within every bracket.
                For holdings the rate is a tax rate; for debts the rate is a deduction percentage.
            </Typography>

            <Typography variant="subtitle1" color="success.main" sx={{mb: 1.5, fontWeight: 600}}>Holdings</Typography>
                            <Grid container spacing={2} sx={{mb: 3}}>
                                {userLevyDefs.filter(lt => lt.category === 'asset').sort((a, b) => b.defaultRate - a.defaultRate).map(lt => (
                                    <Grid size={{xs: 12, sm: 6, md: 4}} key={lt.key} id={`levy-${lt.key}`}>
                                        <Card variant="outlined" sx={{height: '100%'}}>
                                            <CardContent sx={{pb: '16px !important'}}>
                                                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                                                    <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                                                        {lt.name}
                                                    </Typography>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        {formatPercentage(lt.defaultRate)}
                                                    </Typography>
                                                </Box>
                                                {lt.description && (
                                                    <Typography variant="body2" color="text.secondary" sx={{mb: lt.rationale ? 1 : 0}}>
                                                        {lt.description}
                                                    </Typography>
                                                )}
                                                {lt.rationale && (
                                                    <Typography variant="caption" color="text.secondary" sx={{display: 'block', fontStyle: 'italic'}}>
                                                        {lt.rationale}
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

            <Typography variant="subtitle1" color="warning.main" sx={{mb: 1.5, fontWeight: 600}}>Debts</Typography>
                            <Grid container spacing={2} sx={{mb: 1}}>
                                {userLevyDefs.filter(lt => lt.category === 'debt').sort((a, b) => b.defaultRate - a.defaultRate).map(lt => (
                                    <Grid size={{xs: 12, sm: 6, md: 4}} key={lt.key} id={`levy-${lt.key}`}>
                                        <Card variant="outlined" sx={{height: '100%'}}>
                                            <CardContent sx={{pb: '16px !important'}}>
                                                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                                                    <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                                                        {lt.name}
                                                    </Typography>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        {formatPercentage(lt.defaultRate)}
                                                    </Typography>
                                                </Box>
                                                {lt.description && (
                                                    <Typography variant="body2" color="text.secondary" sx={{mb: lt.rationale ? 1 : 0}}>
                                                        {lt.description}
                                                    </Typography>
                                                )}
                                                {lt.rationale && (
                                                    <Typography variant="caption" color="text.secondary" sx={{display: 'block', fontStyle: 'italic'}}>
                                                        {lt.rationale}
                                                    </Typography>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                </Paper>

                    {/* Condensed bracket summary */}
                    <Typography variant="subtitle1" sx={{mb: 1}}>Bracket Summary</Typography>
                    {userState && (
                        <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                            Population: {formatPopulation(userState.population)} · Budget Target: ${formatPopulation(userState.budgetTarget ?? userState.moneySupply ?? 0)}
                        </Typography>
                    )}
                    <TableContainer component={Paper} variant="outlined" sx={{mb: 3}}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Bracket</strong></TableCell>
                                    <TableCell align="right"><strong>Population</strong></TableCell>
                                    <TableCell align="right"><strong>~Net Worth / Person</strong></TableCell>
                                    <TableCell align="right"><strong>~Tax / Person</strong></TableCell>
                                    <TableCell align="right"><strong>Bracket Total Tax</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userBrackets.map(bracket => {
                                    const netWorth = calculateNetWorth(bracket);
                                    const tax = calculateBracketTax(bracket);
                                    const pop = bracket.population || 1;
                                    return (
                                        <TableRow key={bracket.id}>
                                            <TableCell>{bracket.name}</TableCell>
                                            <TableCell align="right">{formatPopulation(bracket.population)}</TableCell>
                                            <TableCell align="right">{formatMoney(netWorth / pop, {notation: 'compact'})}</TableCell>
                                            <TableCell align="right">{formatMoney(tax / pop, {notation: 'compact'})}</TableCell>
                                            <TableCell align="right">{formatMoney(tax, {notation: 'compact'})}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                <TableRow sx={{'& td': {fontWeight: 'bold'}}}>
                                    <TableCell>Totals</TableCell>
                                    <TableCell align="right">
                                        {formatPopulation(userBrackets.reduce((s, b) => s + b.population, 0))}
                                    </TableCell>
                                    <TableCell/>
                                    <TableCell/>
                                    <TableCell align="right">
                                        {formatMoney(
                                            userBrackets.reduce((s, b) => s + calculateBracketTax(b), 0),
                                            {notation: 'compact'},
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
        </Box>
    );
};

export default VariablesPage;
