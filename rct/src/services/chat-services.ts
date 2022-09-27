import axios, { AxiosResponse } from 'axios'

const getGroups = () => {
    return axios.get('https://localhost:5001/getGroups').then((data:AxiosResponse<Groups>)=>{
        return data.data
    })
}

export const ChatService = {
    getGroups
};