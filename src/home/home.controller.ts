import { Controller, Get, Render } from '@nestjs/common';

@Controller('home')
export class HomeController {
    @Get('/home')
    @Render('home')
    getHomePage(){
        return { message:'Im in home page' }
    }
}
