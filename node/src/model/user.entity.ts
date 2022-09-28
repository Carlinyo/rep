import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
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
}
