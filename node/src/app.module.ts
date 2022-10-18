import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Messages } from "./model/messages.entity";
import { User } from "./model/user.entity";
import { HomeController } from "./home/home.controller";
import { HomeModule } from "./home/home.module";
import { groups } from "./model/groups.entity";
import { GroupsMessages } from "./model/groupmessages.entity";
import { ChatService } from "./chat/chat.service";
import { ChatModule } from "./chat/chat.module";
import { Group_User } from "./model/group_user.entity";
import { JoinedUserMessage } from "./model/joined-user-emtity";
import { LeftUsers } from "./model/letf-users.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "asdasd123",
      database: "chat_db",
      entities: [
        User,
        Messages,
        groups,
        GroupsMessages,
        Group_User,
        JoinedUserMessage,
        LeftUsers
      ],
      synchronize: true,
      autoLoadEntities: true,
    }),
    HomeModule,
    TypeOrmModule.forFeature([
      Messages,
      GroupsMessages,
      JoinedUserMessage,
      User,
      groups,
      Group_User,
      LeftUsers
    ]),
    ChatModule,
  ],
  controllers: [AppController, HomeController],
  providers: [AppService, ChatService],
  exports: [TypeOrmModule],
})
export class AppModule {}
