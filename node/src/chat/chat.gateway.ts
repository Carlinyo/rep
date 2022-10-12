import { Bind, RawBodyRequest } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { NestGateway } from "@nestjs/websockets/interfaces/nest-gateway.interface";
import { ChatService } from "./chat.service";
import { Server, Socket } from "socket.io";
import { InjectRepository } from "@nestjs/typeorm";
import { Group_User } from "src/model/group_user.entity";
import { Group_UserDto } from "src/dto/group_user.dto";
import { Repository } from "typeorm";

@WebSocketGateway({ cors: "*:*" })
export class ChatGateway implements NestGateway {
  constructor(
    private chatService: ChatService,
    @InjectRepository(Group_User)
    private group_user: Repository<RawBodyRequest<Group_UserDto | any>>
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {}
  async handleConnection(socket: Socket) {
    let messages = await this.chatService.GetGroupData(socket.id);
    socket.emit("messages", messages);
  }
  async handleDisconnect(socket: Socket) {
    let user = await this.group_user.findOne({
      where: { user: socket.id },
      relations: { user: true, group: true },
    });
    if (user) {
      this.server.emit("users-changed", { user: user.username, event: "left" });
    }
  }

  @SubscribeMessage("sendMessage")
  async getGroupData(client:Socket,data: string) {
    client.emit('message',data)
    console.log(data);
    // let Data = await this.chatService.GetGroupData(data);
    // this.server.emit('groupData',Data)
  }

  @SubscribeMessage("sendMessage")
  sendMessage(message: sendMessageTypes) {
    this.chatService.sendGroupMessage(message);
  }

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage("chat")
  handleNewMessage(chat: sendMessageTypes, socket: Socket) {
    console.log(chat)
    this.chatService.sendGroupMessage(chat);
    socket.emit("newChat", chat);
    socket.broadcast.emit("newChat", chat);
  }
}