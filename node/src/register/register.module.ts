import { Module } from "@nestjs/common";
import { User } from "src/model/user.entity";
import { RegisterController } from "./register.controller";
import { RegisterService } from "./register.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { groups } from "src/model/groups.entity";
import { Group_User } from "src/model/group_user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, groups, Group_User])],
  providers: [RegisterService],
  controllers: [RegisterController],
  exports: [TypeOrmModule],
})
export class RegisterModule {}
