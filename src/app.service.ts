import { Injectable, RawBodyRequest } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GroupMessagesI } from "./dto/groupmessage.dto";
import { MessageDto } from "./dto/message.dto";
import { GroupsMessages } from "./model/groupmessages.entity";
import { Messages } from "./model/messages.entity";

@Injectable()
export class AppService {
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