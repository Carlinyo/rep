import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  @Render('login')
  getLoginPage(){
    return  { message:'Im in Login Page' }
  }
  @Get('/home')
  @Render('home')
  getHomePage(){
    return { message:'Im in home page' }
  }
  @Get('/register')
  @Render('register')
  getRegisterPage(){
    return { message:'Im in register page' }
  }
}
