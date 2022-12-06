import {useCallback, useContext, useState} from "react";
import {useDispatch} from "react-redux";
import {useMutation} from "@tanstack/react-query";
import {logout, setToken, signin, signup} from "../../store/authSlice";
import ApiContext from "../../contexts/api-context";
import {setMessage} from "../../store/uiSlice";

export function useAutoLogin() {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState<boolean | undefined>();

    const autoLogin = useCallback(() => {
        // setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!!token) {
            dispatch(setToken(token));
        }

        setIsLoading(false);
    }, [dispatch]);

    return {
        autoLogin,
        isLoading
    }
}

export function useSignup() {
    const {client} = useContext(ApiContext);
    const dispatch = useDispatch()
    const mutation = useMutation({
        mutationFn: async (user: {email: string; username: string; password: string} ) => {
            const res = await client.post('/users', user);
            return res.data.id_token;
        },
        onSuccess: (data, variables, ) => {
            const token = data.toString();
            localStorage.setItem('token', token);
            dispatch(signup({ email: variables.email, username: variables.username, token: token}));
        }
    })

    const handleSubmit = useCallback( async (data: {email: string, username: string, password: string, password2: string}) => {
        if (data.password !== data.password2) {
            dispatch(setMessage({text: 'Passwords does not match', isError: true}));
            return false;
        }

        await mutation.mutate( {email: data.email, username: data.username, password: data.password})

        return true;
    }, [dispatch, mutation])

    return {
        handleSubmit,
    }
}

export function useSignin() {
    const dispatch = useDispatch()
    const {client} = useContext(ApiContext);

    const mutation = useMutation({
        mutationFn: async (user: {email: string; password: string} ) => {
            const res = await client.post('/sessions/create', user);
            return res.data.id_token;
        },
        onSuccess: (data, variables, ) => {
            const token = data.toString();
            localStorage.setItem('token', token);
            dispatch(signin({ email: variables.email, token: token}));
        }
    })
    const handleSubmit = useCallback(async (data: {email: string, password: string}) => {
        await mutation.mutate( {email: data.email, password: data.password})
    },[mutation]);

    return {
        handleSubmit,
    }
}

export function useLogout() {
    const dispatch = useDispatch()

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        dispatch(logout());
    }, [dispatch])

    return {
        logout: handleLogout
    }
}