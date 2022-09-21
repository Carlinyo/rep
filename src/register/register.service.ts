import { Injectable, RawBodyRequest } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from "src/dto/app.dto";
import { GroupDto } from "src/dto/group.dto";
import { groups } from "src/model/groups.entity";
import { User } from "src/model/user.entity";
import { Repository } from "typeorm";
@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User) private users: Repository<RawBodyRequest<UserDto>>,
    @InjectRepository(groups) private groups: Repository<GroupDto>
  ) {}
  async registerUser(user: RawBodyRequest<UserDto>) {
   this.users.save(user);
  }
  async getGroups() {
    return await this.groups.find();
  }
}