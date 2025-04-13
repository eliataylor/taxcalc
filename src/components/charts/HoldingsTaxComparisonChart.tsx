import React, {useMemo} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {HoldingsTaxComparisonChartProps} from '../../types';
import {calculateBracketTax, calculateTotalHoldings} from '../../utils/calculations';
import {formatMoney, formatPercentage} from '../../utils/formatters.ts';

/**
 * Stacked bar chart comparing Holdings and tax burden by bracket
 */
const HoldingsTaxComparisonChart: React.FC<HoldingsTaxComparisonChartProps> = ({brackets}) => {
    const data = useMemo(() => {
        return brackets.map(bracket => {
            const totalHoldings = calculateTotalHoldings(bracket);
            const totalTax = calculateBracketTax(bracket);
            const afterTaxHoldings = totalHoldings - totalTax;

            return {
                name: bracket.name,
                totalHoldings,
                totalTax,
                afterTaxHoldings,
                // For tooltip display
                formattedHoldings: formatMoney(totalHoldings, {notation: 'compact'}),
                formattedTax: formatMoney(totalTax, {notation: 'compact'}),
                formattedAfterTax: formatMoney(afterTaxHoldings, {notation: 'compact'})
            };
        });
    }, [brackets]);

    const CustomTooltip = ({active, payload, label}: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const effectiveRate = data.totalTax / data.totalHoldings;

            return (
                <Paper sx={{bgcolor: 'background.paper', p: 2, boxShadow: 3}}>
                    <Typography variant="body2" fontWeight="bold">{label}</Typography>
                    <Typography variant="body2">
                        Total Holdings: {data.formattedHoldings}
                    </Typography>
                    <Typography variant="body2" color="error.main">
                        Tax Burden: {data.formattedTax}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                        After-Tax Holdings: {data.formattedAfterTax}
                    </Typography>
                    <Typography variant="body2">
                        Effective Rate: {formatPercentage(effectiveRate)}
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
                Holdings vs. Tax Burden by Bracket
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
                                maximumFractionDigits: 0
                            })
                        }
                    />
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend/>
                    <Bar dataKey="afterTaxHoldings" stackId="a" fill="#4caf50" name="After-Tax Holdings"/>
                    <Bar dataKey="totalTax" stackId="a" fill="#f44336" name="Tax Amount"/>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default HoldingsTaxComparisonChart;
