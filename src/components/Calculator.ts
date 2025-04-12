import React, {useEffect, useState} from 'react';
import {Alert, Box, Button, Container, Divider, Grid, Paper, Tab, Tabs, Typography} from '@mui/material';
import {v4 as uuidv4} from 'uuid';

// Import components
import PayingPopulation from './inputs/PayingPopulation';
import MoneySupply from './inputs/MoneySupply';
import TaxBracket from './tax/TaxBracket';
import MoneyField from './inputs/MoneyField';
import ExportScenario from './tax/ExportScenario';
import ImportScenario from './tax/ImportScenario';
import TaxDistributionChart from './charts/TaxDistributionChart';
import PerCapitaTaxChart from './charts/PerCapitaTaxChart';
import IncomeTaxComparisonChart from './charts/IncomeTaxComparisonChart';

// Import types and utilities
import {ImportData, TabPanelProps, TaxBracketData} from '../types';
import {
  calculatePopulationBalance,
  calculateTaxPercentage,
  calculateTotalTax,
  updateBracketTaxes
} from '../utils/calculations';

/**
 * TabPanel component for visualization tabs
 */
function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role = "tabpanel"
    hidden = {value !== index
}
    id = {`tax-tabpanel-${index}`
}
    aria - labelledby = {`tax-tab-${index}`
}
    {...
        other
    }
>
    {
        value === index && (
            <Box sx = {
        {
            3
        }
    }>
        {
            children
        }
        </Box>
    )
    }
    </div>
)

}

/**
 * Main calculator component that manages state and coordinates other components
 */
const Calculator: React.FC = () => {
    // State for the calculator
    const [population, setPopulation] = useState<number>(144_500_000); // Default to taxpayers
    const [moneySupply, setMoneySupply] = useState<number>(4_800_000_000_000); // Default to tax revenue
    const [tabValue, setTabValue] = useState(0);
    const [brackets, setBrackets] = useState<TaxBracketData[]>([
        {
            id: uuidv4(),
            name: 'Lower Income',
            population: 72_000_000,
            incomeThreshold: 30_000,
            taxRate: 0.10,
            totalTax: 0
        },
        {
            id: uuidv4(),
            name: 'Middle Income',
            population: 60_000_000,
            incomeThreshold: 75_000,
            taxRate: 0.22,
            totalTax: 0
        },
        {
            id: uuidv4(),
            name: 'Upper Income',
            population: 12_500_000,
            incomeThreshold: 200_000,
            taxRate: 0.35,
            totalTax: 0
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
            incomeThreshold: 50_000,
            taxRate: 0.15,
            totalTax: 0
        };

        setBrackets([...brackets, newBracket]);
    };

    const removeBracket = (id: string) => {
        setBrackets(brackets.filter(bracket => bracket.id !== id));
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
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
        <Container maxWidth = "lg"
    sx = {
    {
        4
    }
}>
    <Typography variant = "h4"
    gutterBottom >
    Tax
    Scenario
    Calculator
    < /Typography>

    < Grid
    container
    spacing = {3} >
        {/* Left column - Global settings */}
        < Grid
    item
    xs = {12}
    md = {4} >
    <Paper sx = {
    {
        3, height
    :
        '100%'
    }
}>
    <Box sx = {
    {
        3
    }
}>
    <PayingPopulation
        val = {population}
    onValueChange = {setPopulation}
    />
    < /Box>

    < Divider
    sx = {
    {
        3
    }
}
    />

    < Box >
    <MoneySupply
        val = {moneySupply}
    onValueChange = {setMoneySupply}
    />
    < /Box>
    < /Paper>
    < /Grid>

    {/* Right column - Tax brackets and results */
    }
    <Grid item
    xs = {12}
    md = {8} >
    <Paper sx = {
    {
        3, mb
    :
        3
    }
}>
    <Box sx = {
    {
        'flex', justifyContent
    :
        'space-between', alignItems
    :
        'center', mb
    :
        2
    }
}>
    <Typography variant = "h5" > Tax
    Brackets < /Typography>
    < Button
    variant = "contained"
    color = "primary"
    onClick = {addNewBracket}
        >
        Add
    Bracket
    < /Button>
    < /Box>

    {
        populationBalance !== 0 && (
            <Alert
                severity = {populationBalance < 0 ? "error" : "warning"
    }
        sx = {
        {
            2
        }
    }
    >
        {
            populationBalance < 0
                ? `Population mismatch: ${Math.abs(populationBalance).toLocaleString()} more people in brackets than total!`
                : `${populationBalance.toLocaleString()} people not included in any bracket.`
        }
        </Alert>
    )
    }

    {
        brackets.map(bracket => (
            <Box key = {bracket.id}
        sx = {
        {
            2
        }
    }>
        <TaxBracket
            bracket = {bracket}
        totalPopulation = {population}
        onChange = {handleBracketChange}
        />
        < Button
        variant = "outlined"
        color = "error"
        size = "small"
        onClick = {()
    =>
        removeBracket(bracket.id)
    }
        sx = {
        {
            -2, ml
        :
            2
        }
    }
    >
        Remove
        < /Button>
        < /Box>
    ))
    }
    </Paper>

    < Paper
    sx = {
    {
        3
    }
}>
    <Typography variant = "h5"
    gutterBottom >
    Tax
    Scenario
    Results
    < /Typography>

    < Box
    sx = {
    {
        2
    }
}>
    <Typography variant = "subtitle1" > Total
    Tax
    </Typography>
    < MoneyField
    val = {totalTaxRevenue}
    />
    < /Box>

    < Box
    sx = {
    {
        2
    }
}>
    <Typography variant = "subtitle1" >
        Percentage
    of
    Money
    Supply
    {
        taxBalancePercentage.toFixed(2)
    }
%
    </Typography>
    < /Box>

    < Box
    sx = {
    {
        2
    }
}>
    <Typography variant = "subtitle1" > Per
    Capita
    Tax
    </Typography>
    < MoneyField
    val = {population > 0 ? totalTaxRevenue / population : 0
}
    />
    < /Box>

    < Box
    sx = {
    {
        'flex'
    }
}>
    <ExportScenario
        population = {population}
    moneySupply = {moneySupply}
    brackets = {brackets}
    totalTaxRevenue = {totalTaxRevenue}
    taxBalancePercentage = {taxBalancePercentage}
    />

    < ImportScenario
    onImport = {handleImport}
    />
    < /Box>
    < /Paper>

    {/* Visualizations */
    }
    <Paper sx = {
    {
        3, mt
    :
        3
    }
}>
    <Typography variant = "h5"
    gutterBottom >
    Visualizations
    < /Typography>

    < Box
    sx = {
    {
        1, borderColor
    :
        'divider'
    }
}>
    <Tabs
        value = {tabValue}
    onChange = {handleTabChange}
    aria - label = "tax visualization tabs"
    >
    <Tab label = "Tax Distribution" / >
    <Tab label = "Per Capita Tax" / >
    <Tab label = "Income vs. Tax" / >
        </Tabs>
        < /Box>

        < TabPanel
    value = {tabValue}
    index = {0} >
    <TaxDistributionChart brackets = {brackets}
    />
    < /TabPanel>

    < TabPanel
    value = {tabValue}
    index = {1} >
    <PerCapitaTaxChart brackets = {brackets}
    />
    < /TabPanel>

    < TabPanel
    value = {tabValue}
    index = {2} >
    <IncomeTaxComparisonChart brackets = {brackets}
    />
    < /TabPanel>
    < /Paper>
    < /Grid>
    < /Grid>
    < /Container>
)

};

export default Calculator;
