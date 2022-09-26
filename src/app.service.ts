import { Injectable, RawBodyRequest } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageDto } from './dto/message.dto';
import { Messages } from './model/messages.entity';

@Injectable()
export class AppService {
  constructor(@InjectRepository(Messages) private messages: Repository<RawBodyRequest<MessageDto>>) {}
  sendMessage(message:MessageDto){
    this.messages.save(message)
  }
  getUserMessages(id:MessageDto){
    this.messages.findBy(id)
  }
  joinGroup(){
    
  }
}