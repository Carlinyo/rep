import { RawBodyRequest } from "@nestjs/common";
import { Repository } from "typeorm";
import { GroupMessagesI } from "./dto/groupmessage.dto";
import { MessageDto } from "./dto/message.dto";
export declare class AppService {
    private messages;
    private gMessages;
    constructor(messages: Repository<RawBodyRequest<MessageDto>>, gMessages: Repository<RawBodyRequest<GroupMessagesI>>);
    sendMessage(message: MessageDto): void;
    getUserMessages(id: MessageDto): void;
    getGroupMessages(groupId: number): Promise<RawBodyRequest<GroupMessagesI>[]>;
    sendGroupMessage(message: GroupMessagesI): void;
}
