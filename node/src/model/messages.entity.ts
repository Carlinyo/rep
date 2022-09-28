import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user: User) => user)
  @JoinColumn()
  from: User;
  @ManyToOne(() => User, (user: User) => user)
  @JoinColumn()
  to: User;
  @Column()
  message: string;
}