import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {LevyTypeDefinition, PersistedState, TaxBracketData} from '../types';
import {
    CENSUS_FIGURES,
    DEFAULT_LEVY_TYPES,
    MONEY_SUPPLY_TYPES,
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

    useEffect(() => {
        setUserState(readPersistedState());
    }, []);

    const userLevyDefs: LevyTypeDefinition[] = userState?.levyTypeDefs ?? [];
    const userBrackets: TaxBracketData[] = userState?.brackets ?? [];

    const hasCustomConfig = userState !== null;
    const levyDefsChanged = hasCustomConfig && JSON.stringify(userLevyDefs.map(d => d.key).sort()) !== JSON.stringify(DEFAULT_LEVY_TYPES.map(d => d.key).sort());

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

            {/* Section 2: Global Inputs - Money Supply */}
            <Typography variant="h6" sx={{mb: 1}}>Money Supply / Revenue Target Options</Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                The reference figure used to evaluate whether total tax revenue is sufficient. Total revenue is shown as a percentage of this value.
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
                        {MONEY_SUPPLY_TYPES.map(ms => (
                            <TableRow key={ms.id}>
                                <TableCell>{ms.name}</TableCell>
                                <TableCell align="right">${formatPopulation(ms.value)}</TableCell>
                                <TableCell>{ms.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Section 3: Default Levy Type Definitions */}
            <Typography variant="h6" sx={{mb: 1}}>Default Levy Types (Net Worth Components)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                Net Worth = Assets &minus; Debts. Asset levy types add to taxable worth; debt levy types reduce it.
                Each category has a ~per-person dollar amount and an independent rate within every bracket.
                For assets the rate is a tax rate; for debts the rate is a deduction percentage.
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{mb: 4}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Description</strong></TableCell>
                            <TableCell><strong>Rationale</strong></TableCell>
                            <TableCell align="right"><strong>Default Rate</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {DEFAULT_LEVY_TYPES.map(lt => (
                            <TableRow key={lt.key}>
                                <TableCell>
                                    <Typography variant="caption" color={lt.category === 'debt' ? 'warning.main' : 'success.main'} sx={{textTransform: 'uppercase', fontWeight: 600}}>
                                        {lt.category}
                                    </Typography>
                                </TableCell>
                                <TableCell>{lt.name}</TableCell>
                                <TableCell>{lt.description}</TableCell>
                                <TableCell>{lt.rationale}</TableCell>
                                <TableCell align="right">{formatPercentage(lt.defaultRate)}</TableCell>
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
                            <TableCell>Tax as % of Money Supply</TableCell>
                            <TableCell><code>(totalTaxRevenue / moneySupply) * 100</code></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Divider sx={{my: 4}}/>

            {/* Section 7: Your Current Configuration (dynamic) */}
            <Typography variant="h5" sx={{mb: 1}}>Your Current Configuration</Typography>

            {!hasCustomConfig ? (
                <Paper variant="outlined" sx={{p: 3, textAlign: 'center'}}>
                    <Typography variant="body1" color="text.secondary">
                        No saved configuration. Defaults are loaded when you open the{' '}
                        <RouterLink to="/calculator">Calculator</RouterLink>.
                    </Typography>
                </Paper>
            ) : (
                <>
                    {/* User's levy types */}
                    {levyDefsChanged && (
                        <>
                            <Typography variant="subtitle1" sx={{mb: 1}}>Custom Levy Types</Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{mb: 3}}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Category</strong></TableCell>
                                            <TableCell><strong>Key</strong></TableCell>
                                            <TableCell><strong>Name</strong></TableCell>
                                            <TableCell><strong>Description</strong></TableCell>
                                            <TableCell align="right"><strong>Default Rate</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {userLevyDefs.map(lt => (
                                            <TableRow key={lt.key}>
                                                <TableCell>
                                                    <Typography variant="caption" color={lt.category === 'debt' ? 'warning.main' : 'success.main'} sx={{textTransform: 'uppercase', fontWeight: 600}}>
                                                        {lt.category}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell><code>{lt.key}</code></TableCell>
                                                <TableCell>{lt.name}</TableCell>
                                                <TableCell>{lt.description || '—'}</TableCell>
                                                <TableCell align="right">{formatPercentage(lt.defaultRate)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}

                    {/* Condensed bracket summary */}
                    <Typography variant="subtitle1" sx={{mb: 1}}>Bracket Summary</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                        Population: {formatPopulation(userState.population)} · Money Supply: ${formatPopulation(userState.moneySupply)}
                    </Typography>
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
                </>
            )}
        </Box>
    );
};

export default VariablesPage;
