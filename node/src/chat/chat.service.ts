import { Injectable, RawBodyRequest } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupMessagesI } from "src/dto/groupmessage.dto";
import { MessageDto } from "src/dto/message.dto";
import { GroupsMessages } from "src/model/groupmessages.entity";
import { Messages } from "src/model/messages.entity";
import { Repository } from "typeorm";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Messages)
    private messages: Repository<RawBodyRequest<MessageDto>>,
    @InjectRepository(GroupsMessages)
    private gMessages: Repository<RawBodyRequest<GroupMessagesI>>
  ) {}
  sendMessage(message: MessageDto) {
    this.messages.save(message);
  }
  getUserMessages(id: MessageDto) {
    this.messages.findBy(id);
  }
  async getGroupMessages(groupId: number) {
    return await this.gMessages.findBy({ groupId });
  }
  sendGroupMessage(message: GroupMessagesI) {
    this.gMessages.save(message);
  }
}