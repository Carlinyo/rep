import { groups } from "src/model/groups.entity";

export class UserDto {
  username: string;
  group: groups;
}