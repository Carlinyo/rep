import { Body, Controller, Param, Post, RawBodyRequest } from '@nestjs/common';
import { AppService } from './app.service';
import { MessageDto } from './dto/message.dto';
import { User } from './model/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('/joinGroup')
  joinToGroup(@Body() body:RawBodyRequest<User>){
    
  }
  @Post('/sendMessage')
  sendMessage(@Body() body:RawBodyRequest<MessageDto>){
    this.appService.sendMessage(body)
  }
  @Post('/getMessages')
  getMessages(@Param() id : MessageDto){
    this.appService.getUserMessages(id)
  }
}
