import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Messages } from "./model/messages.entity";
import { User } from "./model/user.entity";
import { RegisterModule } from "./register/register.module";
import { HomeController } from "./home/home.controller";
import { HomeModule } from "./home/home.module";
import { groups } from "./model/groups.entity";
import { GroupsMessages } from "./model/groupmessages.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "asdasd123",
      database: "chat_db",
      entities: [User, Messages,groups,GroupsMessages],
      synchronize: true,
      autoLoadEntities : true
    }),
    RegisterModule,
    HomeModule,
    TypeOrmModule.forFeature([Messages,GroupsMessages])
  ],
  controllers: [
    AppController,
    HomeController,
  ],
  providers: [AppService],
  exports:[TypeOrmModule]
})
export class AppModule {}
