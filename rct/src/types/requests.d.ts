declare global{
    interface GroupData{
        messages?:GroupMessages[];
        users?:User[]

    }
    interface JoinUserData{
        user?:User;
        status:string;
    }
}
export {}