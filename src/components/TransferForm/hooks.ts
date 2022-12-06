import {useContext} from "react";
import ApiContext from "../../contexts/api-context";
import {useQuery} from "@tanstack/react-query";
import {getUserList} from "../../queries";

export function useSearchUser(value: { searchTerm: string }) {
    const {client} = useContext(ApiContext);
    // const dispatch = useDispatch()

    const data =
        useQuery({
            queryKey: ['getUserList', value],
            queryFn: async () => await getUserList(client, value),
            enabled: !!value.searchTerm,
        });

    return {
        isLoading: data.isLoading,
        isFetching: data.isFetching,
        list: data.data
    }
}
