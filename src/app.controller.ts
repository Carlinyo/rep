import { Body, Controller, Get, Param, Post, RawBodyRequest } from '@nestjs/common';
import { AppService } from './app.service';
import { GroupMessagesI } from './dto/groupmessage.dto';
import { MessageDto } from './dto/message.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Post('/sendMessage')
  sendMessage(@Body() body:RawBodyRequest<MessageDto>){
    this.appService.sendMessage(body)
  }
  @Post('/getMessages')
  getMessages(@Body() id:RawBodyRequest<MessageDto>){
    this.appService.getUserMessages(id)
  }
  @Get('/getGroupMessages')
  getGroupMessages(@Param() groupId:number){
    this.appService.getGroupMessages(groupId)
  }
  @Post('/sendMessageToGroup')
  sendGroupMessage(@Body() body : RawBodyRequest<GroupMessagesI>){
    this.appService.sendGroupMessage(body)
  }
}
