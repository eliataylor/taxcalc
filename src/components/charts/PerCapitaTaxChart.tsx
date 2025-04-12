import React, {useMemo} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {PerCapitaTaxChartProps} from '../../types';
import {formatMoney, formatPercentage} from '../../utils/formatters.ts';

/**
 * Bar chart showing per capita tax burden by bracket
 */
const PerCapitaTaxChart: React.FC<PerCapitaTaxChartProps> = ({brackets}) => {
    const data = useMemo(() => {
        return brackets.map(bracket => {
            const perCapitaTax = bracket.incomeThreshold * bracket.taxRate;
            return {
                name: bracket.name,
                perCapitaTax,
                formattedAmount: formatMoney(perCapitaTax)
            };
        });
    }, [brackets]);

    const CustomTooltip = ({active, payload, label}: any) => {
        if (active && payload && payload.length) {
            const bracket = brackets.find(b => b.name === label);
            const taxRate = bracket ? bracket.taxRate : 0;

            return (
                <Paper sx={{bgcolor: 'background.paper', p: 2, boxShadow: 3}}>
                    <Typography variant="body2" fontWeight="bold">{label}</Typography>
                    <Typography variant="body2" color="primary">
                        Per Capita Tax: {payload[0].payload.formattedAmount}
                    </Typography>
                    <Typography variant="body2">
                        Tax Rate: {formatPercentage(taxRate)}
                    </Typography>
                    <Typography variant="body2">
                        Income Threshold: {formatMoney(bracket?.incomeThreshold || 0)}
                    </Typography>
                </Paper>
            );
        }
        return null;
    };

    if (brackets.length === 0) {
        return (
            <Box sx={{p: 3, textAlign: 'center'}}>
                <Typography variant="body1">No tax brackets defined.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{width: '100%', height: 400}}>
            <Typography variant="h6" align="center" gutterBottom>
                Per Capita Tax Burden by Bracket
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis
                        tickFormatter={(value) =>
                            formatMoney(value, {
                                notation: 'compact',
                                maximumFractionDigits: 1
                            })
                        }
                    />
                    <Tooltip content={<CustomTooltip/>}/>
                    <Bar dataKey="perCapitaTax" fill="#8884d8"/>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default PerCapitaTaxChart;
