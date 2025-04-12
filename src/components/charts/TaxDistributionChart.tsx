import React, {useMemo} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {TaxDistributionChartProps} from '../../types';
import {calculateBracketTax} from '../../utils/calculations';
import {formatMoney} from '../../utils/formatters';

/**
 * Pie chart showing tax distribution by bracket
 */
const TaxDistributionChart: React.FC<TaxDistributionChartProps> = ({brackets}) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C'];

    const data = useMemo(() => {
        return brackets.map((bracket, index) => {
            const taxAmount = calculateBracketTax(bracket);
            return {
                name: bracket.name,
                value: taxAmount,
                color: COLORS[index % COLORS.length]
            };
        });
    }, [brackets]);

    const totalTax = useMemo(() => {
        return data.reduce((sum, item) => sum + item.value, 0);
    }, [data]);

    // Custom tooltip for the pie chart
    const CustomTooltip = ({active, payload}: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const percentage = ((data.value / totalTax) * 100).toFixed(2);

            return (
                <Paper sx={{p: 2, boxShadow: 3}}>
                    <Typography variant="body2" color="textSecondary">
                        <strong>{data.name}</strong>
                    </Typography>
                    <Typography variant="body2">
                        {formatMoney(data.value, {notation: 'standard'})}
                    </Typography>
                    <Typography variant="body2">
                        {percentage}% of total
                    </Typography>
                </Paper>
            );
        }
        return null;
    };

    if (brackets.length === 0 || totalTax === 0) {
        return (
            <Box sx={{p: 3, textAlign: 'center'}}>
                <Typography variant="body1">No tax brackets defined or tax amounts are zero.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{width: '100%', height: 400}}>
            <Typography variant="h6" align="center" gutterBottom>
                Tax Distribution by Bracket
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color}/>
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default TaxDistributionChart;
