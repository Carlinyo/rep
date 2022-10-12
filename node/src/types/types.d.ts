import { GroupMessagesI } from "src/dto/groupmessage.dto";
import { MessageDto } from "src/dto/message.dto";

declare global {
  interface sendMessageTypes {
    message: MessageDto;
    from:string;
    group:string;
  }
}