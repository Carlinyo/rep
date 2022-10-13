import { Injectable, RawBodyRequest } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupDto } from "src/dto/group.dto";
import { Group_UserDto } from "src/dto/group_user.dto";
import { groups } from "src/model/groups.entity";
import { Group_User } from "src/model/group_user.entity";
import { DataSource, FindManyOptions, Repository } from "typeorm";
@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(groups)
    private Groups:
      | Repository<RawBodyRequest<GroupDto>>
      | FindManyOptions<RawBodyRequest<GroupDto>>
      | any,
    @InjectRepository(Group_User)
    private group_user:
      | Repository<RawBodyRequest<Group_UserDto>>
      | FindManyOptions<RawBodyRequest<Group_UserDto>>
      | any
  ) {}
  dataSource: DataSource;
  
}
