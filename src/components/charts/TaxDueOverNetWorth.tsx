import React, {useMemo} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {TaxDistributionChartProps} from '../../types';
import {calculateBracketTax, calculateNetWorth} from '../../utils/calculations.ts';
import {formatMoney} from '../../utils/formatters.ts';

/**
 * Bar chart showing tax due as percentage of net wealth by bracket
 */
const TaxDueOverNetWorth: React.FC<TaxDistributionChartProps> = ({brackets, budgetTarget}) => {

    const data = useMemo(() => {
        return brackets.map((bracket) => {
            const taxAmount = calculateBracketTax(bracket);
            const netWorth = calculateNetWorth(bracket);
            const pct = netWorth > 0 ? (taxAmount / netWorth) * 100 : 0;

            return {
                name: bracket.name,
                population: bracket.population,
                popPercent: bracket.popPercent,
                color: bracket.color,
                value: pct,
                percentValue: pct,
                totalTax: taxAmount
            };
        });
    }, [brackets, budgetTarget]);

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
                        Tax as % of Net Wealth: {data.percentValue.toFixed(2)}%
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

    const renderColoredTick = (props: any) => {
        const {x, y, payload} = props;
        const entry = data.find(d => d.name === payload.value);
        return (
            <text
                x={x - 4}
                y={y}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={11}
                fontWeight={600}
                fill={entry?.color ?? '#666'}
            >
                {payload.value}
            </text>
        );
    };

    return (
        <Box sx={{width: '100%'}}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{letterSpacing: 0.5}}>
                Percentage of Net Wealth Taxed
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{left: 10, right: 10, top: 8, bottom: 16}}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={.3}/>
                    <XAxis
                        type="number"
                        tickFormatter={(value) => `${value.toFixed(2)}%`}
                        domain={[0, 100]}
                        tick={{fontSize: 10}}
                        label={{value: '% of Net Wealth', position: 'bottom', offset: 0, style: {fontSize: 10, fill: '#888'}}}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={95}
                        tick={renderColoredTick}
                    />
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar
                        dataKey="value"
                        name="Tax as % of Net Wealth"
                        fill="#8884d8"
                        barSize={18}
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
