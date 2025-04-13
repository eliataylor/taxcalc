import React, {useMemo} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {TaxDistributionChartProps} from '../../types';
import {calculateBracketTax} from '../../utils/calculations';
import {formatMoney} from '../../utils/formatters.ts';

/**
 * Pie chart showing tax distribution by bracket
 */
const TotalTaxRevenueByBracket: React.FC<TaxDistributionChartProps> = ({brackets}) => {

    const data = useMemo(() => {
        return brackets.map((bracket) => {
            const taxAmount = calculateBracketTax(bracket);
            return {
                name: bracket.name,
                value: taxAmount,
                color: bracket.color
            };
        });
    }, [brackets]);

    const totalTax = useMemo(() => {
        return data.reduce((sum, item) => sum + item.value, 0);
    }, [data]);

    // Add percentage to each data entry for display
    const dataWithPercentage = useMemo(() => {
        return data.map(item => ({
            ...item,
            percent: ((item.value / totalTax) * 100).toFixed(1)
        }));
    }, [data, totalTax]);

    // Custom tooltip for the pie chart
    const CustomTooltip = ({active, payload}: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <Paper sx={{p: 2, boxShadow: 3}}>
                    <Typography variant="body2" color="textSecondary">
                        <strong>{data.name}</strong>
                    </Typography>
                    <Typography variant="body2">
                        {formatMoney(data.value, {notation: 'standard'})}
                    </Typography>
                    <Typography variant="body2">
                        {data.percent}% of total
                    </Typography>
                </Paper>
            );
        }
        return null;
    };

    // Custom label that shows percentage on pie slices
    const renderCustomizedLabel = (props: any) => {
        const {cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload} = props;
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize="12"
                fontWeight="bold"
            >
                {`${payload.percent}%`}
            </text>
        );
    };

    // Custom formatter for the legend to include value and percentage
    const CustomizedLegend = (props: any) => {
        const {payload} = props;

        return (
            <ul style={{
                display: 'flex',
                flexDirection:'column',
                padding: 0, margin: 0, listStyle: 'none'
            }}>
                <li>
                    <u>Total Tax Revenues by Brackets</u>
                </li>
                {payload.map((entry: any, index: number) => (
                    <li key={`item-${index}`} style={{
                        display: 'block',
                        alignItems: 'center',
                        margin: '0 5px 5px 0'
                    }}>
                        <span style={{
                            display: 'inline-block',
                            width: 10,
                            height: 10,
                            backgroundColor: entry.color,
                            marginRight: 5
                        }}/>
                        <span>
                            {entry.value}: {formatMoney(entry.payload.value, {notation: 'compact'})} ({entry.payload.percent}%)
                        </span>
                    </li>
                ))}
            </ul>
        );
    };

    if (brackets.length === 0 || totalTax === 0) {
        return (
            <Box sx={{p: 3, textAlign: 'center'}}>
                <Typography variant="body1">No tax brackets defined or tax amounts are zero.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{width: '100%', height: 410}}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Legend content={<CustomizedLegend/>} verticalAlign="top"/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Pie
                        data={dataWithPercentage}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {dataWithPercentage.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color}/>
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default TotalTaxRevenueByBracket;
