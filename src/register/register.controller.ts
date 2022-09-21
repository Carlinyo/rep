import { Controller, Get, Render } from '@nestjs/common';

@Controller('register')
export class RegisterController {
    @Get('/register')
    @Render('register')
    getRegisterPage(){
        return { message:'Im in register page' }
    }
}
