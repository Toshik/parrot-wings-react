import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {stat} from "fs";

export interface UiState {
    transferDraft: {
        username: string,
        amount: number,
        searchTerm: string,
        presetUsername: string,
    },
    message?: { text: string, isError: boolean } | undefined
}

export interface TransferDraftPayload {
    username: string,
    amount: number
}

export interface TransferStatePayload {
    username: string,
    amount: number
    searchTerm: string,
}

export interface MessagePayload {
    text: string,
    isError: boolean
}

const initialState: UiState = {
    transferDraft: {username: '', amount: 0, searchTerm: '', presetUsername: ''}
}

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setTransferDraft: (state, action: PayloadAction<TransferDraftPayload>) => {
            state.transferDraft.amount = action.payload.amount
            state.transferDraft.presetUsername = action.payload.username
            state.transferDraft.username = ''
            state.transferDraft.searchTerm = action.payload.username
        },
        updateTransferDraftUsername: (state, action: PayloadAction<string>) => {
            state.transferDraft.presetUsername = action.payload
        },
        setTransferState: (state, action: PayloadAction<TransferStatePayload>) => {
            state.transferDraft.amount = action.payload.amount
            state.transferDraft.username = action.payload.username
            state.transferDraft.searchTerm = action.payload.searchTerm
        },
        updateTransferStateAmount: (state, action: PayloadAction<number>) => {
            state.transferDraft.amount = action.payload
        },
        updateTransferStateUsername: (state, action: PayloadAction<string>) => {
            state.transferDraft.username = action.payload
        },
        updateTransferStateSearchterm: (state, action: PayloadAction<string>) => {
            state.transferDraft.searchTerm = action.payload
        },
        setMessage: (state, action: PayloadAction<MessagePayload | undefined>) => {
            state.message = action.payload
        }
    }
})

export const {
    setTransferDraft,
    updateTransferDraftUsername,
    setTransferState,
    updateTransferStateUsername,
    updateTransferStateAmount,
    updateTransferStateSearchterm,
    setMessage
} = uiSlice.actions;

export default uiSlice.reducer;