import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GroupsMessages } from "src/model/groupmessages.entity";
import { groups } from "src/model/groups.entity";
import { Group_User } from "src/model/group_user.entity";
import { JoinedUserMessage } from "src/model/joined-user-emtity";
import { LeftUsers } from "src/model/letf-users.entity";
import { Messages } from "src/model/messages.entity";
import { User } from "src/model/user.entity";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";

@Module({
  imports: [TypeOrmModule.forFeature([User,groups,Messages, GroupsMessages, Group_User, JoinedUserMessage,LeftUsers])],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}