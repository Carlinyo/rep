import { Body, Controller, Get, Post, RawBodyRequest } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { RegisterService } from './register.service';

@Controller()
export class RegisterController {
    constructor(private regService:RegisterService){}
    @Post('/joinToGroup')
    joinToGroup(@Body() body : RawBodyRequest<UserDto>){
        this.regService.JoinToGroup(body)
    }
    @Post('/leaveGroup')
    leaveGroup(@Body() id:RawBodyRequest<UserDto>){
        this.regService.leaveGroup(id)
    }
    @Get('/getGroups')
    async getGroups() {
       await this.regService.getGroups()
    }  
}