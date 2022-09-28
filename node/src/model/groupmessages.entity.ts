import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { groups } from "./groups.entity";
import { User } from "./user.entity";
@Entity()
export class GroupsMessages {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(()=>User,(user:User)=>user)
  @JoinColumn()
  from:User;
  @ManyToOne(()=>groups,(group:groups)=>group)
  @JoinColumn()
  group:User;
  @Column()
  message:string
}