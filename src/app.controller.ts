import { Body, Controller, Get, Param, Post, RawBodyRequest } from '@nestjs/common';
import { AppService } from './app.service';
import { MessageDto } from './dto/message.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('/sendMessage')
  sendMessage(@Body() body:RawBodyRequest<MessageDto>){
    this.appService.sendMessage(body)
  }
  @Post('/getMessages')
  getMessages(@Param() id : MessageDto){
    this.appService.getUserMessages(id)
  }
}
