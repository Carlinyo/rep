import { ChatService } from "../services/chat-services";

export const GetGroupsA = () => (dispatch: (xxx: any) => Groups) => {
    ChatService.getGroups().then((data)=>{
        return data
    })
};