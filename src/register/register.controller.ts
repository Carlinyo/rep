import { Body, Controller, Get, Post, RawBodyRequest } from '@nestjs/common';
import { UserDto } from 'src/dto/app.dto';
import { RegisterService } from './register.service';

@Controller()
export class RegisterController {
    constructor(private regService:RegisterService){}
    @Get('/')
    getRegisterPage(){
        return "Im in Register Page"
    }
    @Post('/addUser')
    addUser(@Body() body:RawBodyRequest<UserDto>) {
        this.regService.JoinToGroup(body)
    }
    @Get('/getGroups')
    async getGroups() {
       await this.regService.getGroups()
    }
}