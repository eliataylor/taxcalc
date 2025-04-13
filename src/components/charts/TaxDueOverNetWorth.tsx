import React, {useMemo} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {TaxDistributionChartProps} from '../../types';
import {calculateBracketTax, calculateNetWorth} from '../../utils/calculations';
import {formatMoney} from '../../utils/formatters.ts';

/**
 * Bar chart showing tax due as percentage of net worth by bracket
 */
const TaxDueOverNetWorth: React.FC<TaxDistributionChartProps> = ({brackets, moneySupply}) => {

    const data = useMemo(() => {
        return brackets.map((bracket) => {
            const taxAmount = calculateBracketTax(bracket);
            const netWorth = calculateNetWorth(bracket);

            return {
                name: bracket.name,
                population: bracket.population,
                popPercent: bracket.popPercent,
                color: bracket.color,
                value: (taxAmount / netWorth) * 100, // Convert to percentage
                percentValue: (taxAmount / netWorth) * 100, // Store percentage value separately
                totalTax: taxAmount
            };
        });
    }, [brackets, moneySupply]);

    // Custom tooltip for the bar chart
    const CustomTooltip = ({active, payload}: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <Paper sx={{p: 2, boxShadow: 3}}>
                    <Typography variant="body2" color="textSecondary">
                        <strong>{data.name}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Tax as % of Net Worth: {data.percentValue.toFixed(2)}%
                    </Typography>
                    <Typography variant="body2">
                        Population: {data.population.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                        Total Tax: {formatMoney(data.totalTax, {notation: 'compact'})}
                    </Typography>
                </Paper>
            );
        }
        return null;
    };

    if (brackets.length === 0) {
        return (
            <Box sx={{p: 3, textAlign: 'center'}}>
                <Typography variant="body1">No tax brackets defined or per capita values are zero.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{width: '100%'}}>
            <Typography variant={'subtitle2'}><u>Percentage of Net Worth Taxed</u></Typography>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart
                    data={data}
                    layout="vertical"
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={.3}/>
                    <XAxis
                        type="number"
                        tickFormatter={(value) => `${value.toFixed(2)}%`}
                        domain={[0, 'dataMax']}
                        label={{value: 'Percentage of Net Worth', position: 'bottom', offset: 10}}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={100}
                    />
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar
                        dataKey="value"
                        name="Tax as % of Net Worth"
                        fill="#8884d8"
                        barSize={20}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color}/>
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default TaxDueOverNetWorth;
