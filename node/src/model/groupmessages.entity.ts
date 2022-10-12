import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { groups } from "./groups.entity";
import { Messages } from "./messages.entity";
import { User } from "./user.entity";
@Entity()
export class GroupsMessages {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(()=>User,(user:User)=>user)
  @JoinColumn()
  from:User;
  @ManyToOne(()=>groups,(group:groups)=>group)
  @JoinColumn()
  group:User;
  @ManyToOne(()=>Messages,(messages:Messages)=>messages)
  @JoinColumn()
  message:Messages;
}