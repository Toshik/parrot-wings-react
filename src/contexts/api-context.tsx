import axios, {AxiosError, AxiosInstance} from "axios";
import {config} from "../config";
import {createContext, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {setMessage} from "../store/uiSlice";
import {useLogout} from "../components/auth/hooks";

const ApiContext = createContext({
    client: {} as AxiosInstance
})

export function ApiContextProvider(props: any) {
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.auth.token);
    const {logout} = useLogout();

    const clientInstance = axios.create({
        baseURL: config.apiBaseUrl
    });

    useEffect(() => {
        clientInstance.interceptors.request.use((c) => {
            const originalConfig = c;

            if (!!token) {
                if (!originalConfig.headers) {
                    originalConfig.headers = {};
                }
                originalConfig.headers.Authorization = `Bearer ${token}`;
            }

            return originalConfig;
        });
    }, [clientInstance.interceptors.request, token]);


    useEffect(() => {
        clientInstance.interceptors.response.use((r) => r, (error) => {
            if(error.config?.url?.includes('/protected')) {
                if (error.response?.status === 401) {
                    logout();
                }
            }

            // console.log(error);
            dispatch(setMessage({text: error.response.data, isError: true}));
        })
    }, [clientInstance.interceptors.response, dispatch]);


    return (
        <ApiContext.Provider value={{client: clientInstance}}>
            {props.children}
        </ApiContext.Provider>
    )
}

export default ApiContext;