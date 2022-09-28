import axios, { AxiosResponse } from 'axios'

const getGroups = async () => {
    return await axios.get('http://localhost:5001/getGroups').then((data:AxiosResponse<Groups>)=>{
        return data.data
    })
}

const getUsers = async () =>{
    return await axios.get('http://localhost:5001/getUsers').then((data:AxiosResponse<User>)=>{
        return data.data
    })
}

export const ChatService = {
    getGroups,
    getUsers
};