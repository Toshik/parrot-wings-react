import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import {useSelector} from "react-redux";
import {RootState} from "../store";
import {useMemo} from "react";
import {parseDate} from "../helpers";

export default function Chart() {
    const theme = useTheme();
    const transactions = useSelector((state: RootState) => state.info.history);
    
    const data = useMemo(() => {
        return transactions.map(t => {
            const date = parseDate(t.date);
            return ({
                date: `${date.toISOString()}`, amount: t.amount
            });
        })
    }, [transactions]);
    
    return (
        <React.Fragment>
            <Title>Funds movement Chart</Title>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis
                        dataKey="date"
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    />
                    <YAxis
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    >
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                textAnchor: 'middle',
                                fill: theme.palette.text.primary,
                                ...theme.typography.body1,
                            }}
                        >
                            Sales ($)
                        </Label>
                    </YAxis>
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="amount"
                        stroke={theme.palette.primary.main}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}