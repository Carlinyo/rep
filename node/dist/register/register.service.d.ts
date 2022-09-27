import { RawBodyRequest } from "@nestjs/common";
import { UserDto } from "src/dto/user.dto";
import { GroupDto } from "src/dto/group.dto";
import { DataSource, FindManyOptions, Repository } from "typeorm";
export declare class RegisterService {
    private users;
    private Groups;
    dataSource: DataSource;
    constructor(users: Repository<RawBodyRequest<UserDto>>, Groups: Repository<RawBodyRequest<GroupDto>> | FindManyOptions<RawBodyRequest<GroupDto>> | any);
    JoinToGroup(user: RawBodyRequest<UserDto>): Promise<RawBodyRequest<UserDto>[] | "Group is Full">;
    getGroups(): Promise<any>;
    leaveGroup(id: UserDto): Promise<void>;
}
