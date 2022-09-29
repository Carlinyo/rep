import { Body, Controller, Get, Post, RawBodyRequest } from '@nestjs/common';
import { UserDto } from 'src/dto/user.dto';
import { RegisterService } from './register.service';

@Controller()
export class RegisterController {
    constructor(private regService:RegisterService){}
    @Post('/joinToGroup')
    async joinToGroup(@Body() body : RawBodyRequest<UserDto>){
        return await this.regService.JoinToGroup(body)
    }
    @Post('/leaveGroup')
    leaveGroup(@Body() id:RawBodyRequest<UserDto>){
        this.regService.leaveGroup(id)
    }
    @Get('/getUsers')
    async getUsers(){
        return await this.regService.getUsers()
    }
    @Get('/getGroups')
    async getGroups() {
       return await this.regService.getGroups()
    }
    @Post('/getGroupData')
    async getGroupData(@Body() body:RawBodyRequest<string>){
        return await this.regService.GetGroupData(Object.keys(body)[0])
    }
}