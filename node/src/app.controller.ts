import {
  Body,
  Controller,
  Post,
  RawBodyRequest,
} from "@nestjs/common";
import { ChatService } from "./chat/chat.service";
import { GroupMessagesI } from "./dto/groupmessage.dto";
import { MessageDto } from "./dto/message.dto";

@Controller()
export class AppController {
  constructor(private readonly chatService: ChatService) {}
}