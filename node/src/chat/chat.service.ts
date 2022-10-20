import { Injectable, RawBodyRequest } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GroupDto } from "src/dto/group.dto";
import { GroupMessagesI } from "src/dto/groupmessage.dto";
import { Group_UserDto } from "src/dto/group_user.dto";
import { JoinedUserMessagesDto } from "src/dto/joined-user-messages.dto";
import { MessageDto } from "src/dto/message.dto";
import { UserDto } from "src/dto/user.dto";
import { GroupsMessages } from "src/model/groupmessages.entity";
import { groups } from "src/model/groups.entity";
import { Group_User } from "src/model/group_user.entity";
import { JoinedUserMessage } from "src/model/joined-user-emtity";
import { LeftUsers } from "src/model/letf-users.entity";
import { Messages } from "src/model/messages.entity";
import { User } from "src/model/user.entity";
import { FindManyOptions, Repository } from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(User)
    private users:
      | Repository<RawBodyRequest<UserDto>>
      | FindManyOptions<RawBodyRequest<UserDto>>
      | any,
    @InjectRepository(Group_User)
    private group_user:
      | Repository<RawBodyRequest<Group_UserDto>>
      | FindManyOptions<RawBodyRequest<Group_UserDto>>
      | any,
    @InjectRepository(GroupsMessages)
    private gMessages:
      | Repository<RawBodyRequest<GroupMessagesI>>
      | FindManyOptions<RawBodyRequest<GroupMessagesI>>
      | any,
    @InjectRepository(Messages)
    private messages:
      | Repository<RawBodyRequest<MessageDto>>
      | FindManyOptions<RawBodyRequest<MessageDto>>
      | any,
    @InjectRepository(groups)
    private Groups:
      | Repository<RawBodyRequest<GroupDto>>
      | FindManyOptions<RawBodyRequest<MessageDto>>
      | any,
    // @InjectRepository(JoinedUserMessage)
    // private joinedUserMessages:
    //   | Repository<RawBodyRequest<JoinedUserMessagesDto>>
    //   | FindManyOptions<RawBodyRequest<JoinedUserMessagesDto>>
    //   | any,
    // @InjectRepository(LeftUsers)
    // private LeftUsersMessage:
    //   | Repository<RawBodyRequest<JoinedUserMessagesDto>>
    //   | FindManyOptions<RawBodyRequest<JoinedUserMessagesDto>>
    //   | any
  ) {}

  async sendGroupMessage(body: sendMessageTypes) {
    let Message = await this.messages.save(body.message);
    await this.gMessages.save({
      message: Message.id,
      from: body.from,
      group: body.group,
    });
  }
  // async LogoutUser(id: string) {
  //   let groupUser = await this.group_user.findOne({ where: { user: +id } });
  //   if (groupUser) {
  //     await this.group_user.delete(groupUser);
  //   }
  // }
  // async JoinToGroup(user: RawBodyRequest<UserDto>) {
  //   let group = await this.users.find({
  //     relations: { group: true },
  //   });
  //   let groupUsers = group.filter((el: UserDto) => el.group.id === +user.group);
  //   let contains: number = 0;
  //   for (let i = 0; i < groupUsers.length; i++) {
  //     if (groupUsers[i].username === user.username) {
  //       contains = 1;
  //       return {
  //         status: user.username + "_" + Math.round(Math.random() * 100),
  //       };
  //     }
  //   }
  //   if (groupUsers.length < 5 && contains === 0) {
  //     let User = await this.users.save(user);
  //     await this.group_user.save({
  //       group: user.group,
  //       user: User.id,
  //     });
  //     return { user: User, status: "Ok" };
  //   }
  // }

  async getUser(id: string) {
    return await this.users.find({ where: { id: id } });
  }
  async leaveGroup(id: UserDto) {
    let user: User = await this.users.findOneBy(id);
    await this.users.delete(user);
  }

  async GetGroupData(id: string) {
    let groupMessages = await this.gMessages.find({
      relations: { group: true, from: true, message: true },
    })
    let groupUsers = groupMessages
      .filter((el: Group_UserDto) => el.group.id === +id)
      .sort((a: GroupMessagesI, b: GroupMessagesI) => b.id > a.id)
    let users = await this.group_user.find({ where: { group: +id },relations:['user', 'group'] })
    return { messages: groupUsers, users: users }
  }
  async getGroups() {
    return await this.Groups.find();
  }
  async getUsers() {
    return await this.group_user.find({
      relations: ["user", "group"],
    });
  }
  // async sendJoinedUserMessages(message: JoinedUserMessagesDto) {
  //   let Message = await this.joinedUserMessages.save(message);
  //   setTimeout(async () => {
  //     await this.joinedUserMessages.delete(Message);
  //   }, 15000);
  //   return Message;
  // }
  // async getJoinedMessages() {
  //   return await this.joinedUserMessages.find();
  // }
  // async sendLeftUserMessage(data: any) {
  //   let message = await this.LeftUsersMessage.save(data);
  //   setTimeout(async () => {
  //     await this.LeftUsersMessage.delete(message);
  //   }, 15000);
  //   return message;
  // }
  // async getLeftMessages() {
  //   return await this.LeftUsersMessage.find();
  // }
  async createUser(data: any) {
    let user = await this.users.save({
      username: data.data.to_email,
      type: 0,
      verification: 0,
      password: "",
      token: data.token
    });
    data.data.groups.map(async (group: string) => {
      await this.group_user.save({ group: group, user: user.id });
    });
    return user;
  }
  async updateUser(data: any) {
    let currUser = await this.users.find({
      where: { username: data.data.to_email },
    });
    await this.users.update({ id: currUser[0].id }, { token: data.token });
  }

  async findUserByToken(token: string) {
    let user = await this.users.findOneBy({ token: token });
    return await this.group_user.find({
      where: { user: user.id },
      relations: { user: true, group: true },
    });
  }

  async findUser(data: any) {
    await this.users.update(
      { token: data.token },
      { verification: 1, password: await bcrypt.hash(data.data.password, 10) }
    );
    return await this.findUserByToken(data.token);
  }
}