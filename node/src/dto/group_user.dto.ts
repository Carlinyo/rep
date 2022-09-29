import { groups } from "src/model/groups.entity"
import { User } from "src/model/user.entity"

export class Group_UserDto{
    id:number;
    group:groups;
    user:User;
}