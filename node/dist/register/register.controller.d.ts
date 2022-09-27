import { RawBodyRequest } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { RegisterService } from './register.service';
export declare class RegisterController {
    private regService;
    constructor(regService: RegisterService);
    joinToGroup(body: RawBodyRequest<UserDto>): void;
    leaveGroup(id: RawBodyRequest<UserDto>): void;
    getGroups(): Promise<void>;
}
