import { UserDto } from "src/dto/user.dto";
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
export class LeftUsers {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user: UserDto) => user)
  @JoinColumn()
  user: number;
  @ManyToOne(() => groups, (group: groups) => group)
  @JoinColumn()
  group: number;
  @Column()
  date: string;
  @Column()
  message: string;
}
