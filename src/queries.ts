import {AxiosInstance} from "axios";

export async function getUserList(axios: AxiosInstance, value: {searchTerm: string}) {
    console.log('Querying', value.searchTerm)
    const res = await axios.post(`/api/protected/users/list`, {filter: value.searchTerm});
    // console.log(res.data)
    return  res.data as { id: string, name: string }[]
}