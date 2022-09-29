declare global {
    interface State{
        groups:Groups[];
        users:User[];
        joinReqData:string;
        groupData:Groups[]
    }
}
export {}