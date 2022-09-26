import { Bind } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from "@nestjs/websockets";
import { NestGateway } from "@nestjs/websockets/interfaces/nest-gateway.interface";
import { Messages } from "src/model/messages.entity";
import { ChatService } from "./chat.service";
@WebSocketGateway()
export class ChatGateway implements NestGateway {
  constructor(private chatService: ChatService) {}
  afterInit(server: any) {
    console.log("Init", server);
  }
  handleConnection(socket: any) {
    console.log(socket);
    process.nextTick(() => {
      socket.emit("messages");
    });
  }
  handleDisconnect(socket: any) {
    console.log("disconected", socket);
  }
  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage("chat")
  handleNewMessage(chat: Messages, socket: any) {
    console.log("New Chat", chat);
    this.chatService.sendMessage(chat)
    socket.emit("newChat", chat);
    socket.broadcast.emit("newChat", chat);
  }
}