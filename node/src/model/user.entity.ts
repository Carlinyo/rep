
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GroupsMessages } from "./groupmessages.entity";
import { groups } from "./groups.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @ManyToOne(() => groups, (group: groups) => group)
  @JoinColumn()
  group: groups;
  @Column({default:0})
  type:number
}