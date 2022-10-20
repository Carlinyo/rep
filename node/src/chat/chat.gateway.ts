import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { NestGateway } from "@nestjs/websockets/interfaces/nest-gateway.interface";
import { ChatService } from "./chat.service";
import { Server, Socket } from "socket.io";
import { Group_User } from "src/model/group_user.entity";

@WebSocketGateway({ cors: "*:*", transport: ["websocket"] })
export class ChatGateway implements NestGateway {
  constructor(private chatService: ChatService) {}

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
      await this.chatService.sendGroupMessage(message);
      data = await this.chatService.GetGroupData(message.group);
    } else if (message.status) {
      data = await this.chatService.GetGroupData(message.id);
    }
    socket.emit("groupData", data);
    socket.broadcast.emit("groupData", data);
  }

  // @SubscribeMessage("join")
  // async joinToGroup(socket: Socket, data: any) {
  //   console.log(data);
  //   let Data = await this.chatService.JoinToGroup(data);
  //   socket.emit("status", Data);
  // }

  @SubscribeMessage("input")
  async onInput(socket: Socket, data: any) {
    if (data.typing) {
      socket.broadcast.emit("typing", { from: data.userId, status: "true" });
    } else {
      socket.broadcast.emit("typing", { from: data.userId, status: "false" });
    }
  }
  // @SubscribeMessage("user")
  // async joinedUsername(socket: Socket, data: JoinedUserMessagesDto) {
  //   let date = new Date().getHours() + ":" + new Date().getMinutes();
  //   data.date = date;
  //   if (data.count === "0") {
  //     delete data.count;
  //     let Message = await this.chatService.sendJoinedUserMessages(data);
  //     let messages = await this.chatService.getJoinedMessages();
  //     socket.emit("joinedUser", { message: Message, messages });
  //     socket.broadcast.emit("joinedUser", { message: Message, messages });
  //   } else {
  //     let messages = await this.chatService.getJoinedMessages();
  //     socket.emit("joinedUser", { messages });
  //     socket.broadcast.emit("joinedUser", { messages });
  //   }
  // }
  // @SubscribeMessage("logOutUser")
  // async deleteUser(socket: Socket, data: any) {
  //   let date = new Date().getHours() + ":" + new Date().getMinutes();
  //   data.date = date;
  //   await this.chatService.sendLeftUserMessage(data);
  //   let messages = await this.chatService.getLeftMessages();
  //   socket.emit("getLeftMessages", messages);
  //   socket.broadcast.emit("getLeftMessages", messages);
  //   if (data.user) {
  //     await this.chatService.LogoutUser(data.user);
  //   }
  // }
  @SubscribeMessage("login")
  async login(socket: Socket, data: any) {
    await this.chatService.findUser(data);
  }
  @SubscribeMessage("createUser")
  async createUser(socket: Socket, data: any) {
    let users = await this.chatService.getUsers();
    if (
      users.every((el: Group_User) => el.user.username !== data.data.to_email)
    ) {
      await this.chatService.createUser(data);
    } else {
      await this.chatService.updateUser(data);
    }
  }
  @SubscribeMessage("getUserByToken")
  async getUserByToken(socket: Socket, data: string) {
    let user = await this.chatService.findUserByToken(data);
    user = user.sort((a: any, b: any) => a.id - b.id);
    socket.emit("userByToken", user);
  }
}