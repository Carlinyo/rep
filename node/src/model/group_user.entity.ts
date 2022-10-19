import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { groups } from "./groups.entity";
import { User } from "./user.entity";

@Entity()
export class Group_User {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => groups, (group: groups) => group)
  @JoinColumn()
  group: groups;
  @ManyToOne(() => User, (user: User) => user)
  @JoinColumn()
  user: User;
}