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

const joinGroup = async (group:Groups)=>{
    return await axios.post('http://localhost:5001/joinToGroup',{group}).then((data:AxiosResponse<any>)=>{
        if('user' in data.data){
            localStorage.userId = data.data.user?.id
        }
        console.log(data.data.status)
        return data.data.status
    })
}

const getGroupData = async (id:string | undefined)=>{
    return await axios.post('http://localhost:5001/getGroupData',id).then((data:AxiosResponse<Groups>)=>{
        return data.data
    })
}

const sendToGroupMessage = async (groupData:SendGroupData)=>{
    return await axios.post('http://localhost:5001/sendMessageToGroup',groupData).then((data:AxiosResponse<GroupMessages>)=>{
        return data.data
    })
}

export const ChatService = {
    getGroups,
    getUsers,
    joinGroup,
    getGroupData,
    sendToGroupMessage
};