import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {stat} from "fs";

export interface InfoState {
    id: string,
    name: string,
    balance: number
    lastUpdate: number

    history: TransactionRecord[]
}

export interface TransactionPayload {
    id: string,
    date: string,
    username: string,
    amount: number,
    balance: number
}
interface TransactionRecord {
    id: string,
    date: string,
    isOutgoing: boolean,
    username: string,
    amount: number,
    balance: number
}

export interface UpdateInfoPayload {
    id: string,
    name: string,
    balance: number
}

const initialState: InfoState = {
    id: '',
    name: '',
    balance: 0,
    lastUpdate: Date.now(),
    history: []
}

export const infoSlice = createSlice({
    name: 'info',
    initialState,
    reducers: {
        updateInfo: (state, action: PayloadAction<UpdateInfoPayload>) => {
            state.name = action.payload.name;
            state.id = action.payload.id;
            state.balance = action.payload.balance;
            state.lastUpdate = Date.now();
        },
        updateBalance: (state, action: PayloadAction<number>) => {
            state.balance = action.payload;
            state.lastUpdate = Date.now();
        },
        setHistory: (state, action: PayloadAction<TransactionPayload[]>) => {
            // const newRecord =
            state.history = action.payload.map((t) => ({
                id: t.id,
                amount: Math.abs(t.amount),
                balance: t.balance,
                date: t.date,
                username: t.username,
                isOutgoing: t.amount < 0
            } as TransactionRecord) );
        },
        addHistory: (state, action: PayloadAction<TransactionPayload>) => {
            state.history.unshift({
                id: action.payload.id,
                amount: Math.abs(action.payload.amount),
                balance: action.payload.balance,
                date: action.payload.date,
                username: action.payload.username,
                isOutgoing: action.payload.amount < 0
            } as TransactionRecord);
        },
    }
})

export const { updateInfo, updateBalance, setHistory, addHistory } = infoSlice.actions;

export default infoSlice.reducer;