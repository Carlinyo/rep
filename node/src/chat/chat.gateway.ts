import { Bind } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { NestGateway } from "@nestjs/websockets/interfaces/nest-gateway.interface";
import { MessageDto } from "src/dto/message.dto";
import { ChatService } from "./chat.service";
@WebSocketGateway()
export class ChatGateway implements NestGateway {
  constructor(private chatService: ChatService) {}
  afterInit(server: any) {
    console.log("Init", server);
  }
  handleConnection(socket: any) {
    process.nextTick(() => {
      socket.emit("messages");
    });
  }
  handleDisconnect(socket: any) {
    console.log("disconected", socket);
  }
  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage("chat")
  handleNewMessage(chat: MessageDto, socket: any) {
    this.chatService.sendMessage(chat)
    socket.emit("newChat", chat);
    socket.broadcast.emit("newChat", chat);
  }
}