import { groups } from "src/model/groups.entity";
import { User } from "src/model/user.entity";

export class JoinedUserMessagesDto{
    id?:number;
    user:User;
    message:string;
    date:string;
    group:groups;
    count?:string;
}