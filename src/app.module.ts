import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Messages } from "./model/messages.entity";
import { User } from "./model/user.entity";
import { RegisterService } from "./register/register.service";
import { RegisterController } from "./register/register.controller";
import { RegisterModule } from "./register/register.module";
import { LoginController } from "./login/login.controller";
import { LoginModule } from "./login/login.module";
import { HomeController } from "./home/home.controller";
import { HomeModule } from "./home/home.module";
import { RouterModule } from "nest-router";

const routes = [
  { path: "", LoginController },
  { path: "register", RegisterController },
  { path: "home", HomeController },
];

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "asdasd123",
      database: "chat_db",
      entities: [User, Messages],
      synchronize: true,
    }),
    RegisterModule,
    LoginModule,
    HomeModule
  ],
  controllers: [
    AppController,
    RegisterController,
    LoginController,
    HomeController,
  ],
  providers: [AppService, RegisterService],
})
export class AppModule {}
