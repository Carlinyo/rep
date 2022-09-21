import { Controller, Get } from '@nestjs/common';

@Controller('home')
export class HomeController {
    @Get('/home')
    getHomePage(){
        return 'Im in home page' 
    }
}