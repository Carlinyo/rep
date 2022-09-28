import { ChatService } from "../services/chat-services";
import { getGroups, getUsers } from "../store/reducers/chatReducer";

export const GetGroupsA = () => (dispatch: (xxx: any) => Groups) => {
    ChatService.getGroups().then((data)=>{
        dispatch(getGroups(data))
    })
};
export const GetUsersA = () => (dispatch : (xxx : any) => User)=>{
    ChatService.getUsers().then((data)=>{
        dispatch(getUsers(data))
    })
}