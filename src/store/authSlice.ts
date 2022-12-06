import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {stat} from "fs";

export interface AuthState {
    isAuthenticated: boolean,
    email?: string | undefined,
    token?: string | undefined
}

export interface SignupPayload {
    email: string,
    username: string,
    token: string,
}

export interface SigninPayload {
    email: string,
    token: string,
}

const initialState: AuthState = {
    isAuthenticated: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        signup: (state, action: PayloadAction<SignupPayload>) => {
            state.email = action.payload.email;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        signin: (state, action: PayloadAction<SigninPayload>) => {
            state.email = action.payload.email;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.email = undefined;
            state.token = undefined;
        },
    }
})

export const {setToken, signup, logout, signin} = authSlice.actions;

export default authSlice.reducer;