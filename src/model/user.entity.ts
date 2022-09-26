import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { groups } from "./groups.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  groupId: number;
  @ManyToMany(()=> groups)
  @JoinTable()
  groups:groups[]
}