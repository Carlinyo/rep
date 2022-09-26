import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from 'src/model/messages.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
    imports:[TypeOrmModule.forFeature([Messages])],
    providers:[ChatService,ChatGateway]
})
export class ChatModule {}