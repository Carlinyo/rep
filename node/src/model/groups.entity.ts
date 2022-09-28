import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class groups {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(()=>User,(user:User)=>user)
  @JoinColumn()
  user:User[]
  @Column()
  groupsId:number
}