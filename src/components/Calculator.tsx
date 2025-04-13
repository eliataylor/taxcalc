import React, {useEffect, useState} from 'react';
import {Alert, Box, Button, Divider, Grid, Paper, Typography} from '@mui/material';
import {v4 as uuidv4} from 'uuid';

// Import components
import PayingPopulation from './inputs/PayingPopulation';
import MoneySupply from './inputs/MoneySupply';
import TaxBracket from './tax/TaxBracket';
import ExportScenario from './tax/ExportScenario';
import ImportScenario from './tax/ImportScenario';
import TotalTaxRevenueByBracket from './charts/TotalTaxRevenueByBracket.tsx';

// Import types and utilities
import {ImportData, TaxBracketData} from '../types';
import {
    calculatePopulationBalance,
    calculateTaxPercentage,
    calculateTotalTax,
    updateBracketTaxes
} from '../utils/calculations';
import {formatPopulation} from "../utils/formatters.ts";
import TaxDueOverNetWorth from "./charts/TaxDueOverNetWorth.tsx";
import payingPopulation from "./inputs/PayingPopulation";

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C']
/**
 * Main calculator component that manages state and coordinates other components
 */
const Calculator: React.FC = () => {
    // State for the calculator
    const [population, setPopulation] = useState<number>(331_900_000); // Default to taxpayers
    const [moneySupply, setMoneySupply] = useState<number>(6_300_000_000_000); // Default to tax revenue
    const [brackets, setBrackets] = useState<TaxBracketData[]>([
        {
            id: uuidv4(),
            name: 'Not Holding',
            population: (331_900_000 * .25),
            popPercent: .25,
            color: '#0088FE',
            levyTypes: [
                {
                    name: 'Checking Account Balance',
                    dollars: 500,
                    taxRate: .05
                },
                {
                    name: 'Savings Account Balance',
                    dollars: 0,
                    taxRate: 0.10
                },
                {
                    name: 'Overseas Balance',
                    dollars: 0,
                    taxRate: 0.10
                },
                {
                    name: 'Occupied Property',
                    dollars: 0,
                    taxRate: 0.05
                },
                {
                    name: 'Vacant Property',
                    dollars: 0,
                    taxRate: 0.30
                }
            ]
        },
        {
            id: uuidv4(),
            name: 'Lower Holders',
            population: (331_900_000 * .35),
            popPercent: .35,
            color: '#8884D8',
            levyTypes: [
                {
                    name: 'Checking Account Balance',
                    dollars: 2000,
                    taxRate: 0.07
                },
                {
                    name: 'Savings Account Balance',
                    dollars: 5000,
                    taxRate: 0.07
                },
                {
                    name: 'Overseas Balance',
                    dollars: 0,
                    taxRate: 0.10
                },
                {
                    name: 'Occupied Property',
                    dollars: 0,
                    taxRate: 0.05
                },
                {
                    name: 'Vacant Property',
                    dollars: 0,
                    taxRate: 0.30
                }
            ]
        },
        {
            id: uuidv4(),
            name: 'Mid Holders',
            population: (331_900_000 * .30),
            popPercent: .30,
            color: '#00C49F',
            levyTypes: [
                {
                    name: 'Checking Account Balance',
                    dollars: 20000,
                    taxRate: 0.07
                },
                {
                    name: 'Savings Account Balance',
                    dollars: 50000,
                    taxRate: 0.07
                },
                {
                    name: 'Overseas Balance',
                    dollars: 5000,
                    taxRate: 0.10
                },
                {
                    name: 'Occupied Property',
                    dollars: 200000,
                    taxRate: 0.05
                },
                {
                    name: 'Vacant Property',
                    dollars: 0,
                    taxRate: 0.30
                }
            ]
        },
        {
            id: uuidv4(),
            name: 'High Holders',
            population: (331_900_000 * (.10 - (800 / 331_900_000))),
            popPercent: .10 - (800 / 331_900_000),
            color: '#FFBB28',
            levyTypes: [
                {
                    name: 'Checking Account Balance',
                    dollars: 200000,
                    taxRate: 0.10
                },
                {
                    name: 'Savings Account Balance',
                    dollars: 5000,
                    taxRate: 0.10
                },
                {
                    name: 'Overseas Balance',
                    dollars: 20000,
                    taxRate: 0.10
                },
                {
                    name: 'Occupied Property',
                    dollars: 500_000,
                    taxRate: 0.05
                },
                {
                    name: 'Vacant Property',
                    dollars: 500_000,
                    taxRate: 0.30
                }
            ]
        },
        {
            id: uuidv4(),
            name: 'Top 3%',
            population: (331_900_000 * (800 / 331_900_000)),
            popPercent: (800 / 331_900_000),
            color: '#FF8042',
            levyTypes: [
                {
                    name: 'Checking Account Balance',
                    dollars: 50_000_000,
                    taxRate: 0.15
                },
                {
                    name: 'Savings Account Balance',
                    dollars: 1_000_000_000,
                    taxRate: 0.15
                },
                {
                    name: 'Overseas Balance',
                    dollars: 100_000_000,
                    taxRate: 0.10
                },
                {
                    name: 'Occupied Property',
                    dollars: 100_000_000,
                    taxRate: 0.05
                },
                {
                    name: 'Vacant Property',
                    dollars: 10_000_000,
                    taxRate: 0.30
                }
            ]
        }
    ]);

    // Calculate tax metrics
    const [totalTaxRevenue, setTotalTaxRevenue] = useState<number>(0);
    const [populationBalance, setPopulationBalance] = useState<number>(0);
    const [taxBalancePercentage, setTaxBalancePercentage] = useState<number>(0);

    // Update calculations when related state changes
    useEffect(() => {
        // Calculate total tax revenue
        const newTotalTax = calculateTotalTax(brackets);
        setTotalTaxRevenue(newTotalTax);

        // Calculate population balance
        const newPopulationBalance = calculatePopulationBalance(population, brackets);
        setPopulationBalance(newPopulationBalance);

        // Calculate tax balance percentage
        const newTaxPercentage = calculateTaxPercentage(newTotalTax, moneySupply);
        setTaxBalancePercentage(newTaxPercentage);

        // Update the total tax for each bracket
        setBrackets(updateBracketTaxes(brackets));
    }, [brackets, population, moneySupply]);

    const handleBracketChange = (id: string, changes: Partial<TaxBracketData>) => {
        setBrackets(brackets.map(bracket =>
            bracket.id === id ? {...bracket, ...changes} : bracket
        ));
    };

    const addNewBracket = () => {
        const newBracket: TaxBracketData = {
            id: uuidv4(),
            name: `Bracket ${brackets.length + 1}`,
            population: 0,
            levyTypes: [
                {
                    name: 'Checking Account Balance',
                    dollars: 0,
                    taxRate: 0
                },
                {
                    name: 'Savings Account Balance',
                    dollars: 0,
                    taxRate: 0
                },
                {
                    name: 'Overseas Balance',
                    dollars: 2000,
                    taxRate: 0
                },
                {
                    name: 'Occupied Property',
                    dollars: 0,
                    taxRate: 0
                },
                {
                    name: 'Vacant Property',
                    dollars: 0,
                    taxRate: 0
                },
            ],
        };

        setBrackets([...brackets, newBracket]);
    };

    const removeBracket = (id: string) => {
        setBrackets(brackets.filter(bracket => bracket.id !== id));
    };

    const handleImport = (data: ImportData) => {
        setPopulation(data.population);
        setMoneySupply(data.moneySupply);

        // Ensure each imported bracket has an ID
        const bracketsWithIds = data.brackets.map(bracket => ({
            ...bracket,
            id: bracket.id || uuidv4()
        }));

        setBrackets(bracketsWithIds);
    };

    return (
        <Box width={'100%'}>
            <Grid container p={1} justifyContent={'space-between'}>
                <Grid>
                    <Typography variant="h4" component={'h1'}>
                        New Era Tax Calculator
                    </Typography>
                    <Typography variant="subtitle1">
                        <a href={"https://docs.google.com/document/d/1qCxG9i8CHDaBKULj7ITyCVCcWngkd6edAwGGiV1Z2Zo/edit?usp=sharing"}
                           target={"_blank"}>Research and Data Sources</a>
                    </Typography>
                </Grid>

                <Grid spacing={1} gap={2}>
                    <ExportScenario
                        population={population}
                        moneySupply={moneySupply}
                        brackets={brackets}
                        totalTaxRevenue={totalTaxRevenue}
                        taxBalancePercentage={taxBalancePercentage}
                    />

                    <ImportScenario onImport={handleImport}/>
                </Grid>
            </Grid>


            <Grid container spacing={1}>
                {/* 2Left column - Global settings */}
                <Grid size={{xs: 12, md: 4}} style={{position:'relative'}}>
                    <Paper sx={{p: 1, pt: 2, height: '100%'}}>
                        <Box sx={{mb: 3}}>
                            <PayingPopulation
                                val={population}
                                onValueChange={setPopulation}
                            />
                        </Box>

                        <Divider sx={{my: 3}}/>

                        <Box>
                            <MoneySupply
                                val={moneySupply}
                                onValueChange={setMoneySupply}
                            />
                        </Box>

                        <Divider sx={{my: 3}}/>

                        <Box sx={{mb: 2}}>
                            <Typography variant="subtitle2">Total Tax Revenue:</Typography>
                            <Typography color={totalTaxRevenue > moneySupply ? 'green' : 'red'}>${formatPopulation(totalTaxRevenue)} ({taxBalancePercentage.toFixed(2)}% of
                                money supply)</Typography>
                        </Box>

                        <Box sx={{pt: 3}}>
                            <TotalTaxRevenueByBracket payingPopulation={payingPopulation} moneySupply={moneySupply} brackets={brackets} />
                            <TaxDueOverNetWorth payingPopulation={payingPopulation} moneySupply={moneySupply} brackets={brackets} />
                        </Box>

                    </Paper>
                </Grid>

                {/* Right column - Tax brackets and results */}
                <Grid size={{xs: 12, md: 8}}>
                    <Paper sx={{p: 1, mb: 3}}>
                        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2}}>
                            <Typography variant="h5">Tax Brackets</Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={addNewBracket}
                            >
                                Add Bracket
                            </Button>
                        </Box>

                        {populationBalance !== 0 && (
                            <Alert
                                severity={populationBalance < 0 ? "error" : "warning"}
                                sx={{mb: 2}}
                            >
                                {populationBalance < 0
                                    ? `Population mismatch: ${Math.abs(populationBalance).toLocaleString()} more people in brackets than total!`
                                    : `${populationBalance.toLocaleString()} people not included in any bracket.`}
                            </Alert>
                        )}

                        {brackets.map(bracket => (
                            <Box key={bracket.id} sx={{mb: 2}}>
                                <TaxBracket
                                    bracket={bracket}
                                    totalPopulation={population}
                                    onChange={handleBracketChange}
                                />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() => removeBracket(bracket.id)}
                                    sx={{mt: -2, ml: 2}}
                                >
                                    Remove
                                </Button>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Calculator;
