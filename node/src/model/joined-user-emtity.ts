import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { groups } from "./groups.entity";
import { User } from "./user.entity";

@Entity()
export class JoinedUserMessage {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user: User) => user)
  @JoinColumn()
  user: User;
  @ManyToOne(() => groups, (group: groups) => group)
  @JoinColumn()
  group: groups;
  @Column()
  date: string;
  @Column()
  message: string;
}