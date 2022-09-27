declare global{
    interface Groups{
        id:number;
        name:string;
    }
    interface User{
        id:number;
        username:string;
        groupId:number;
    }
}
export {}