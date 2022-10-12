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
  @Column()
  message: string;
  @Column()
  date:string;
}