import React, {useMemo} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {TaxDistributionChartProps} from '../../types';
import {calculateBracketTax} from '../../utils/calculations.ts';
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
        const {cx, cy, midAngle, innerRadius, outerRadius, payload} = props;
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
                fontSize="10"
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
                flexDirection: 'column',
                margin: '0 auto',
                padding: 0,
                listStyle: 'none',
                gap: 2,
            }}>
                <li style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#888',
                    letterSpacing: 0.5,
                    marginBottom: 4,
                }}>
                    Total Tax Revenue by Bracket
                </li>
                {payload.map((entry: any, index: number) => (
                    <li key={`item-${index}`} style={{
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: 1.4,
                    }}>
                        <span style={{
                            display: 'inline-block',
                            width: 8,
                            height: 8,
                            borderRadius: 2,
                            backgroundColor: entry.color,
                            marginRight: 6,
                            flexShrink: 0,
                        }}/>
                        <span style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: entry.color,
                            marginRight: 4,
                        }}>
                            {entry.value}
                        </span>
                        <span style={{fontSize: 10, color: '#999'}}>
                            {formatMoney(entry.payload.value, {notation: 'compact'})} ({entry.payload.percent}%)
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
