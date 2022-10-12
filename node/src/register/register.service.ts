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
}
