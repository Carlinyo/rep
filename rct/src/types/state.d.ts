declare global {
    interface State{
        groups:Groups[];
        users:User[];
        joinReqData:any;
        groupData:GroupData;
    }
}
export {}