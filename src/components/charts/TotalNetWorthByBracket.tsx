import React, {useMemo} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {HoldingsTaxComparisonChartProps} from '../../types';
import {calculateNetWorth} from '../../utils/calculations.ts';
import {formatMoney} from '../../utils/formatters.ts';

/**
 * Bar chart showing total net wealth by tax bracket
 */
const TotalNetWorthByBracket: React.FC<HoldingsTaxComparisonChartProps> = ({brackets}) => {

    const data = useMemo(() => {
        return brackets.map((bracket) => {
            const netWorth = calculateNetWorth(bracket);
            return {
                name: bracket.name,
                color: bracket.color,
                value: netWorth,
                population: bracket.population,
            };
        });
    }, [brackets]);

    const totalNetWorth = useMemo(() => {
        return data.reduce((sum, item) => sum + item.value, 0);
    }, [data]);

    const CustomTooltip = ({active, payload}: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            const pct = totalNetWorth > 0 ? ((d.value / totalNetWorth) * 100).toFixed(1) : '0';

            return (
                <Paper sx={{p: 2, boxShadow: 3}}>
                    <Typography variant="body2" color="textSecondary">
                        <strong>{d.name}</strong>
                    </Typography>
                    <Typography variant="body2">
                        Net Wealth: {formatMoney(d.value, {notation: 'standard'})}
                    </Typography>
                    <Typography variant="body2">
                        {pct}% of total
                    </Typography>
                    <Typography variant="body2">
                        Population: {d.population.toLocaleString()}
                    </Typography>
                </Paper>
            );
        }
        return null;
    };

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

    if (brackets.length === 0) {
        return (
            <Box sx={{p: 3, textAlign: 'center'}}>
                <Typography variant="body1">No tax brackets defined.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{width: '100%'}}>
            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{letterSpacing: 0.5}}>
                Total Net Wealth by Bracket
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{left: 10, right: 10, top: 8, bottom: 16}}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3}/>
                    <XAxis
                        type="number"
                        tickFormatter={(value) =>
                            formatMoney(value, {notation: 'compact', maximumFractionDigits: 0})
                        }
                        tick={{fontSize: 10}}
                        domain={[0, Math.max(...data.map(d => d.value)) * 1.1]}
                        label={{value: 'Net Wealth', position: 'bottom', offset: 0, style: {fontSize: 10, fill: '#888'}}}
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
                        name="Net Wealth"
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

export default TotalNetWorthByBracket;
