import { RawBodyRequest } from "@nestjs/common";
import {
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

@WebSocketGateway({ cors: "*:*", transport: ["websocket"] })
export class ChatGateway implements NestGateway {
  constructor(
    private chatService: ChatService,
    @InjectRepository(Group_User)
    private group_user: Repository<RawBodyRequest<Group_UserDto | any>>
  ) {}

  @WebSocketServer()
  private server: Server;

  afterInit(server: Server) {}
  async handleConnection(socket: Socket) {}
  async handleDisconnect(socket: Socket) {}
  @SubscribeMessage("getUsers")
  async getUsers(socket: Socket) {
    let users = await this.chatService.getUsers();
    socket.emit("getUsers", users);
  }
  @SubscribeMessage("getGroups")
  async getGroups(socket: Socket) {
    let groups = await this.chatService.getGroups();
    socket.emit("getGroups", groups);
  }
  @SubscribeMessage("groupMessage")
  async getGroupMessage(socket: Socket, message: any) {
    let data;
    if (!message.status) {
      console.log(message)
      await this.chatService.sendGroupMessage(message);
      data = await this.chatService.GetGroupData(message.group);
    } else if (message.status) {
      data = await this.chatService.GetGroupData(message.id);
    }
    socket.emit("groupData", data);
    socket.broadcast.emit("groupData", data);
  }
  @SubscribeMessage("join")
  async joinToGroup(socket: Socket, data: any) {
    let Data = await this.chatService.JoinToGroup(data);
    socket.emit("status", Data);
  }
  @SubscribeMessage("input")
  async onInput(socket: Socket, data: any) {
    if (data.typing) {
      socket.broadcast.emit("typing", { from: data.userId, status: "true" });
    } else {
      socket.broadcast.emit("typing", { from: data.userId, status: "false" });
    }
  }
  @SubscribeMessage("joinedUser")
  async getJoinedUser(socket: Socket, data: any) {
    let user = await this.chatService.getUser(data.user);
    data.from = data.user;
    delete data.user
    data.message = { message: user[0].username + " is joined" };
    data.message.date = new Date().getHours() + ":" + new Date().getMinutes();
    console.log(data);
    // await this.chatService.sendGroupMessage(data);
  }
}