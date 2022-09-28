import { Injectable, RawBodyRequest } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from "src/dto/user.dto";
import { GroupDto } from "src/dto/group.dto";
import { groups } from "src/model/groups.entity";
import { User } from "src/model/user.entity";
import { DataSource, FindManyOptions, Repository } from "typeorm";
import { Group_User } from "src/model/group_user.entity";
import { Group_UserDto } from "src/dto/group_user.dto";
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
      | any
  ) {}
  async JoinToGroup(user: RawBodyRequest<UserDto>) {
    console.log(user, "user");
    let group = await this.users.find({
      where: { groupsId: user.group },
      relation: ["group"],
    });
    console.log(group);
    let contains: number = 0;
    group.forEach((el: UserDto) => {
      if (el.username === user.username) {
        contains = 1;
        return user.username + "_" + Math.round(Math.random() * 100);
      }
    });
    if (group.length < 5 && contains === 0) {
      let User = await this.users.save(user);
      this.group_user.save({
        groupsId: user.group,
        group: user.group,
        user: User.id,
      });
      return group;
    } else {
      return "Group is Full";
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
    let Users = await this.users.find();
    console.log(Users);
    return await this.group_user.find({
      relations: ["user", "group"],
    });
  }
}
