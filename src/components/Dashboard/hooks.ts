import {useMutation, useQuery} from "@tanstack/react-query";
import {useDispatch} from "react-redux";
import {addHistory, setHistory, TransactionPayload, updateBalance, updateInfo} from "../../store/infoSlice";
import {useCallback, useContext} from "react";
import ApiContext from "../../contexts/api-context";
import {setMessage} from "../../store/uiSlice";

export function useUserInfo() {
    const {client} = useContext(ApiContext);
    const dispatch = useDispatch()

    const data = useQuery({
        queryKey: ['userInfo'],
        queryFn: async () => {
            const res = await client.get(`/api/protected/user-info`);

            const info = {
                id: res.data.user_info_token.id,
                name: res.data.user_info_token.name,
                email: res.data.user_info_token.email,
                balance: +res.data.user_info_token.balance
            };

            dispatch(updateInfo(info))

            return info;
        }
    })

    return {
        isLoading: data.isLoading,
        isFetching: data.isFetching,
        info: data.data
    }
}

export function useTransactionsHistory() {
    const {client} = useContext(ApiContext);
    const dispatch = useDispatch()

    const data = useQuery({
        queryKey: ['transactions'],
        queryFn: async () => {
            const res = await client.get(`/api/protected/transactions`);

            const history = res.data.trans_token.map((t: any) => ({
                id: t.id.toString(),
                date: t.date.toString(),
                username: t.username.toString(),
                amount: +t.amount,
                balance: +t.balance
            } as TransactionPayload)) as TransactionPayload[];

            history.sort((a, b) => a.date > b.date ? -1 : 1)

            dispatch(setHistory(history));

            return history;
        }
    })

    return {
        isLoading: data.isLoading,
        isFetching: data.isFetching,
        history: data.data
    }
}

export function useTransferFunds() {
    const {client} = useContext(ApiContext);
    const dispatch = useDispatch()

    const mutation = useMutation({
        mutationFn: async (order: { name: string; amount: number }) => {
            const res = await client.post('/api/protected/transactions', order);
            return {
                id: res.data.trans_token.id,
                date: res.data.trans_token.date,
                username: res.data.trans_token.username,
                amount: +res.data.trans_token.amount,
                balance: +res.data.trans_token.balance,
            } as TransactionPayload;
        },
        onSuccess: (data, variables,) => {
            dispatch(updateBalance(data.balance));
            dispatch(addHistory(data));
            dispatch(setMessage({
                text: `Successfully transferred ${-data.amount} PW to ${data.username}`,
                isError: false
            }));
        }
    })

    const transferFunds = useCallback(async (order: { name: string, amount: number }) => {
        await mutation.mutate(order)
    }, [mutation])

    return {
        isLoading: mutation.isLoading,
        transferFunds
    }
}

