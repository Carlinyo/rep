import { Body, Controller, Get, Param, Post, RawBodyRequest } from '@nestjs/common';
import { ChatService } from './chat/chat.service';
import { GroupMessagesI } from './dto/groupmessage.dto';
import { MessageDto } from './dto/message.dto';

@Controller()
export class AppController {
  constructor(private readonly chatService: ChatService) {}
  @Post('/sendMessage')
  sendMessage(@Body() body:RawBodyRequest<MessageDto>){
    this.chatService.sendMessage(body)
  }
  @Post('/getMessages')
  getMessages(@Body() id:RawBodyRequest<MessageDto>){
    this.chatService.getUserMessages(id)
  }
  @Get('/getGroupMessages')
  getGroupMessages(@Param() groupId:number){
    this.chatService.getGroupMessages(groupId)
  }
  @Post('/sendMessageToGroup')
  sendGroupMessage(@Body() body : RawBodyRequest<GroupMessagesI>){
    this.chatService.sendGroupMessage(body)
  }
}