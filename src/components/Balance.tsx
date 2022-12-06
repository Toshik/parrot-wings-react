import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import {useSelector} from "react-redux";
import {RootState} from "../store";

function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
}

export default function Balance() {

    const balance = useSelector((state: RootState) => state.info.balance);
    const lastUpdate = useSelector((state: RootState) => state.info.lastUpdate);

    const date = new Date(lastUpdate);

    return (
        <React.Fragment>
            <Title>Current balance</Title>
            <Typography component="p" variant="h4">
                {balance}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                Updated at {date.toDateString()}
            </Typography>
        </React.Fragment>
    );
}