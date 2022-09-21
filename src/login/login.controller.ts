import { Controller, Get, Render } from '@nestjs/common';

@Controller('login')
export class LoginController {
    @Get('/login')
    @Render('login')
    getLoginPage(){
        return  { message:'Im in Login Page' }
    }
}
