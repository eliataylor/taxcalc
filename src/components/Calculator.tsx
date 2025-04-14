import React, {useEffect, useState} from 'react';
import {Alert, Box, Button, Divider, Grid, List, ListItemText, Paper, Typography} from '@mui/material';
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
            "id": "75ece48e-5aac-4da5-942f-0bf5c3e4c4dd",
            "name": "Not Holding",
            "population": 82975000,
            "popPercent": 0.25,
            "color": "#0088FE",
            "levyTypes": [
                {
                    "name": "Checking Account Balance",
                    "dollars": 500,
                    "taxRate": 0.05
                },
                {
                    "name": "Savings Account Balance",
                    "dollars": 0,
                    "taxRate": 0.1
                },
                {
                    "name": "Overseas Balance",
                    "dollars": 0,
                    "taxRate": 0.1
                },
                {
                    "name": "Occupied Property",
                    "dollars": 0,
                    "taxRate": 0.05
                },
                {
                    "name": "Vacant Property",
                    "dollars": 0,
                    "taxRate": 0.3
                }
            ],
            "totalTax": 2074375000
        },
        {
            "id": "6eef75e3-3296-4930-8913-3ab2ad9e325b",
            "name": "Lower Holders",
            "population": 116165000,
            "popPercent": 0.35,
            "color": "#8884D8",
            "levyTypes": [
                {
                    "name": "Checking Account Balance",
                    "dollars": 2000,
                    "taxRate": 0.07
                },
                {
                    "name": "Savings Account Balance",
                    "dollars": 5000,
                    "taxRate": 0.07
                },
                {
                    "name": "Overseas Balance",
                    "dollars": 0,
                    "taxRate": 0.1
                },
                {
                    "name": "Occupied Property",
                    "dollars": 0,
                    "taxRate": 0.05
                },
                {
                    "name": "Vacant Property",
                    "dollars": 0,
                    "taxRate": 0.3
                }
            ],
            "totalTax": 56920850000.00001
        },
        {
            "id": "e09b9289-735f-40cf-a278-6133e3c6d308",
            "name": "Mid Holders",
            "population": 99570000,
            "popPercent": 0.3,
            "color": "#00C49F",
            "levyTypes": [
                {
                    "name": "Checking Account Balance",
                    "dollars": 20000,
                    "taxRate": 0.07
                },
                {
                    "name": "Savings Account Balance",
                    "dollars": 50000,
                    "taxRate": 0.07
                },
                {
                    "name": "Overseas Balance",
                    "dollars": 5000,
                    "taxRate": 0.1
                },
                {
                    "name": "Occupied Property",
                    "dollars": 200000,
                    "taxRate": 0.05
                },
                {
                    "name": "Vacant Property",
                    "dollars": 0,
                    "taxRate": 0.3
                }
            ],
            "totalTax": 1533378000000
        },
        {
            "id": "32a6f43d-ed64-4c27-a479-26dc43e01ac9",
            "name": "High Holders",
            "population": 33189200.000000004,
            "popPercent": 0.09999758963543237,
            "color": "#FFBB28",
            "levyTypes": [
                {
                    "name": "Checking Account Balance",
                    "dollars": 200000,
                    "taxRate": 0.1
                },
                {
                    "name": "Savings Account Balance",
                    "dollars": 200000,
                    "taxRate": 0.1
                },
                {
                    "name": "Overseas Balance",
                    "dollars": 20000,
                    "taxRate": 0.1
                },
                {
                    "name": "Occupied Property",
                    "dollars": 500000,
                    "taxRate": 0.05
                },
                {
                    "name": "Vacant Property",
                    "dollars": 400000,
                    "taxRate": 0.3
                }
            ],
            "totalTax": 6206380400000.001
        },
        {
            "id": "ed04e7d9-99fe-4a0b-aeb4-c22dd0b03347",
            "name": "Top 3%",
            "population": 800,
            "popPercent": 0.0000024103645676408555,
            "color": "#FF8042",
            "levyTypes": [
                {
                    "name": "Checking Account Balance",
                    "dollars": 50000000,
                    "taxRate": 0.15
                },
                {
                    "name": "Savings Account Balance",
                    "dollars": 1000000000,
                    "taxRate": 0.15
                },
                {
                    "name": "Overseas Balance",
                    "dollars": 100000000,
                    "taxRate": 0.1
                },
                {
                    "name": "Occupied Property",
                    "dollars": 100000000,
                    "taxRate": 0.05
                },
                {
                    "name": "Vacant Property",
                    "dollars": 10000000,
                    "taxRate": 0.3
                }
            ],
            "totalTax": 140400000000
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
            color: "#FF8042",
            id: uuidv4(),
            name: `Bracket ${brackets.length + 1}`,
            popPercent: 0,
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
            ]
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
            <Box p={1} mb={4}>
                <Typography variant="h6" component={'h1'}>
                    <em>What if Taxes were based on <b>Net Worth</b> instead of Annual Income?</em>
                </Typography>

                <Typography variant="body2" component={'li'} sx={{marginLeft:2}}>
                    <b>Pros</b>: Encourage circulation of money supply :)
                </Typography>

                <Typography variant="body2" component={'li'} sx={{marginLeft:2, marginBottom:2}}>
                    <b>Cons</b>: Encourages consumerism :(
                </Typography>

                <Typography variant="subtitle1">
                    <b>The goal</b> for this calculator is to build a fair tax schedule that earns at least our current Federal Budget.</Typography>
                <Typography variant="subtitle1" sx={{marginBottom:0}}><b>One challenge</b> is how to define "Net Worth" for Individuals, Banks, and Corporations. Our current definition for Individuals is based on these 5
                    variables:</Typography>

                <List sx={{marginLeft:2, paddingTop:0, marginTop:0}}>
                    <ListItemText primary={"Checking Account Balance"}
                                  secondary={"This only includes easily accessible capital."}/>
                    <ListItemText primary={"Savings Account Balance"}
                                  secondary={"This includes long term accounts with early withdrawal penalties like IRAs and CDs."}/>
                    <ListItemText primary={"Overseas Balance"}
                                  secondary={"This is to prevent offshoring money to avoid taxes."}/>
                    <ListItemText primary={"Occupied Property"}
                                  secondary={"This would be a lower tax rate on land value, when the land is occupied similar to the overall area's density, given other uses like agriculture and industry."}/>
                    <ListItemText primary={"Vacant Property"}
                                  secondary={"This would be a higher rate to prevent parking large capital in vacant land."}/>
                </List>

                <Typography variant="subtitle1">
                    To contribute, please open Issues or Pull Requests on the open source code on <a
                    href={"https://github.com/eliataylor/taxcalc"}
                    target={"_blank"}><img src={'github-mark-white.svg'} height={17}
                                           style={{marginRight: 3}}/>GitHub</a>. Also consider contributing to this
                    Google Doc of <a
                    href={"https://docs.google.com/document/d/1qCxG9i8CHDaBKULj7ITyCVCcWngkd6edAwGGiV1Z2Zo/edit?usp=sharing"}
                    target={"_blank"}>research</a> gathered by Gemini <img src={'gemini-logo.png'} height={17} style={{marginRight: 0}}/>.
                </Typography>


            </Box>

            <Grid container p={1} justifyContent={'space-between'}>

                <Grid>
                    <Typography variant="subtitle1">

                    </Typography>
                </Grid>
            </Grid>


            <Grid container spacing={1}>
                {/* 2Left column - Global settings */}
                <Grid size={{xs: 12, md: 4}} style={{position: 'relative'}}>
                    <Paper sx={{p: 1, pt: 1, height: '100%'}}>

                        <Grid container mb={4} spacing={1} gap={2} justifyContent={'space-between'}>
                            <ImportScenario onImport={handleImport}/>
                            <ExportScenario
                                population={population}
                                moneySupply={moneySupply}
                                brackets={brackets}
                                totalTaxRevenue={totalTaxRevenue}
                                taxBalancePercentage={taxBalancePercentage}
                            />
                        </Grid>

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
                            <Typography
                                color={totalTaxRevenue > moneySupply ? 'green' : 'red'}>${formatPopulation(totalTaxRevenue)} ({taxBalancePercentage.toFixed(2)}%
                                of
                                money supply)</Typography>
                        </Box>

                        <Box sx={{pt: 3}}>
                            <TotalTaxRevenueByBracket moneySupply={moneySupply}
                                                      brackets={brackets}/>
                            <TaxDueOverNetWorth moneySupply={moneySupply}
                                                brackets={brackets}/>
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
                                size={'small'}
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
                                    sx={{mt: -3}}
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
