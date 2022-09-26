import { Injectable, RawBodyRequest } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from "src/dto/user.dto";
import { GroupDto } from "src/dto/group.dto";
import { groups } from "src/model/groups.entity";
import { User } from "src/model/user.entity";
import { DataSource, FindManyOptions, Repository } from "typeorm";
@Injectable()
export class RegisterService {
  dataSource: DataSource;
  constructor(
    @InjectRepository(User) private users: Repository<RawBodyRequest<UserDto>>,
    @InjectRepository(groups)
    private Groups:
      | Repository<RawBodyRequest<GroupDto>>
      | FindManyOptions<RawBodyRequest<GroupDto>>
      | any
  ) {}
  async JoinToGroup(user: RawBodyRequest<UserDto>) {
    let group = await this.users.findBy({ groupId: user.groupId });
    let contains: number = 0;
    group.forEach((el) => {
      if (el.username === user.username) {
        contains = 1;
        return user.username + "_" + Math.round(Math.random() * 100);
      }
    });
    if (group.length < 5 && contains === 0) {
      this.users.save(user);
    } else {
      return "Group is Full";
    }
  }
  async getGroups() {
    return await this.Groups.find();
  }
  async leaveGroup(id: UserDto) {
    let user: any = await this.users.findOneBy(id);
    await this.users.delete(user);
  }
}