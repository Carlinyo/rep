import { RawBodyRequest } from '@nestjs/common';
import { AppService } from './app.service';
import { GroupMessagesI } from './dto/groupmessage.dto';
import { MessageDto } from './dto/message.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    sendMessage(body: RawBodyRequest<MessageDto>): void;
    getMessages(id: RawBodyRequest<MessageDto>): void;
    getGroupMessages(groupId: number): void;
    sendGroupMessage(body: RawBodyRequest<GroupMessagesI>): void;
}
