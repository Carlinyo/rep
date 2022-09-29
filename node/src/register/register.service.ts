import { Injectable, RawBodyRequest } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from "src/dto/user.dto";
import { GroupDto } from "src/dto/group.dto";
import { groups } from "src/model/groups.entity";
import { User } from "src/model/user.entity";
import { DataSource, FindManyOptions, Repository } from "typeorm";
import { Group_User } from "src/model/group_user.entity";
import { Group_UserDto } from "src/dto/group_user.dto";
import { GroupsMessages } from "src/model/groupmessages.entity";
import { GroupMessagesI } from "src/dto/groupmessage.dto";
@Injectable()
export class RegisterService {
  dataSource: DataSource;
  constructor(
    @InjectRepository(User)
    private users:
      | Repository<RawBodyRequest<UserDto>>
      | FindManyOptions<RawBodyRequest<UserDto>>
      | any,
    @InjectRepository(Group_User)
    private group_user:
      | Repository<RawBodyRequest<Group_UserDto>>
      | FindManyOptions<RawBodyRequest<Group_UserDto>>
      | any,
    @InjectRepository(groups)
    private Groups:
      | Repository<RawBodyRequest<GroupDto>>
      | FindManyOptions<RawBodyRequest<GroupDto>>
      | any,
    @InjectRepository(GroupsMessages)
    private GroupMessages:
      | Repository<RawBodyRequest<GroupMessagesI>>
      | FindManyOptions<RawBodyRequest<GroupMessagesI>>
      | any
  ) {}
  async JoinToGroup(user: RawBodyRequest<UserDto>) {
    console.log(user);
    let group = await this.users.find({
      relations: { group: true },
    });
    let groupUsers = group.filter(
      (el: UserDto) => el.group.id === +user.group.group
    );
    let contains: number = 0;
    console.log(groupUsers);
    for (let i = 0; i < groupUsers.length; i++) {
      if (groupUsers[i].username === user.group.username) {
        console.log(1);
        contains = 1;
        return user.group.username + "_" + Math.round(Math.random() * 100);
      }
    }
    if (groupUsers.length < 5 && contains === 0) {
      console.log(2);
      let User = await this.users.save(user.group);
      this.group_user.save({
        group: user.group.group,
        user: User.id,
      });
      return "Ok";
    }
  }
  async getGroups() {
    return await this.Groups.find();
  }
  async leaveGroup(id: UserDto) {
    let user: User = await this.users.findOneBy(id);
    await this.users.delete(user);
  }
  async getUsers() {
    return await this.group_user.find({
      relations: ["user", "group"],
    });
  }
  async GetGroupData(id: string) {
    let users = await this.GroupMessages.find({
      relations: { group: true,from: true },
    });
    let groupUsers = users.filter((el: Group_UserDto) => el.group.id === +id);
    console.log(groupUsers);
  }
}
