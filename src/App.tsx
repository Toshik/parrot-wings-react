import React, {useEffect} from 'react';
import './App.css';
import {useSelector} from "react-redux";
import {RootState} from "./store";
import Auth from "./components/auth/Auth";
import Dashboard from "./components/Dashboard/Dashboard";
import {useAutoLogin} from "./components/auth/hooks";
import Messages from "./components/Messages/Messages";
import {useIsFetching, useIsMutating} from "@tanstack/react-query";
import {Backdrop, CircularProgress} from "@mui/material";

function App() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const { isLoading: isLoadingToken, autoLogin } = useAutoLogin();
    const isLoading = useIsFetching({ predicate: (query) => query.state.status === 'loading' })
    const isMutating = useIsMutating()


    useEffect(() => {
        autoLogin();
    }, [autoLogin])

    if (isLoadingToken === undefined) {
        return <></>
    }

    const shouldShowLoader = isLoading > 0 || isMutating > 0;

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={shouldShowLoader}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {!isAuthenticated && (<Auth/>)}
            {isAuthenticated && (<Dashboard />)}
            <Messages autoHideDuration={10000}/>
        </>
    )
}

export default App;
