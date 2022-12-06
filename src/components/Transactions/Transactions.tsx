import * as React from 'react';
import Title from '../Title';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {setTransferDraft} from "../../store/uiSlice";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {DataGrid, GridColumns} from '@mui/x-data-grid';
import {useCallback, useMemo} from "react";
import {Button} from "@mui/material";

interface Row {
    id: string,
    date: string,
    amount: number,
    balance: number,
    username: string,
    isOutgoing: boolean,
}


export default function Transactions() {
    const transactions = useSelector((state: RootState) => state.info.history);
    const dispatch = useDispatch()

    const handleTransactionClick = useCallback((id: string) => {
        // console.log(id);
        const transaction = transactions.find(x => x.id === id);
        if (!transaction) {
            return;
        }

        dispatch(setTransferDraft({
            amount: transaction.amount,
            username: transaction.username,
        }));
    }, [dispatch, transactions]);

    const columns = useMemo<GridColumns<Row>>(() => [
            {field: 'id', headerName: 'Id'},
            {field: 'date', headerName: 'Date', width: 200},
            {
                field: 'amount', headerName: 'Amount', type: 'number', width: 70,
                valueGetter: params => `${params.value} PW`
            },
            {field: 'isOutgoing', headerName: 'Dir', type: 'boolean', width: 70},
            {field: 'username', headerName: 'Correspondent Name', minWidth: 200, flex: 1, flexShrink: 0},
            {
                field: 'balance',
                headerName: 'Balance',
                type: 'number',
                width: 90,
                valueGetter: params => `${params.value} PW`
            },
            {
                field: 'actions', headerName: 'Actions', type: 'actions',
                width: 130,
                getActions: (params) =>
                    [
                        <Button variant='contained'
                                size='small'
                                onClick={() => handleTransactionClick(params.row.id)}>{params.row.isOutgoing ? 'Send again' : 'Refund'}
                        </Button>
                    ]
            },
        ]
        , [handleTransactionClick])

    const rows = useMemo(() =>
        transactions.map(t => ({
            id: t.id,
            date: t.date,
            // direction: t.isOutgoing ? (<ArrowForwardIcon color={'error'}/>) : (<ArrowBackIcon color={'success'}/>),
            isOutgoing: t.isOutgoing,
            amount: t.amount,
            balance: t.balance,
            username: t.username,
        } as Row)), [transactions]);

    return (
        <React.Fragment>
            <Title>Transactions History</Title>
            <div style={{height: 400, width: '100%'}}>
                <DataGrid
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                id: false
                            },
                        },
                    }}
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    components={{
                        BooleanCellTrueIcon: () => <ArrowForwardIcon color={'success'}/>,
                        BooleanCellFalseIcon: () => <ArrowBackIcon color={'error'}/>,
                    }}
                />
            </div>

            {/*           <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell></TableCell>
                        <TableCell>User</TableCell>
                        <TableCell align="right">Balance</TableCell>
                        <TableCell align="right">Repeat</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((row) => (
                        <TableRow key={row.id} onClick={() => handleTransactionClick(row.id)}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.amount}PW</TableCell>
                            <TableCell align="right">{row.isOutgoing ? (<ArrowForwardIcon color={'error'}/>) : (
                                <ArrowBackIcon color={'success'}/>)}</TableCell>
                            <TableCell align="left">{row.username}</TableCell>
                            <TableCell align="right">{`${row.balance}PW`}</TableCell>
                            <TableCell align="right">Copy</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
 */}
        </React.Fragment>
    );
}