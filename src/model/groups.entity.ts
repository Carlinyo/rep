import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from "./user.entity";
@Entity()
export class groups {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToMany(() => User, { cascade: true })
  @JoinTable()
  users:User[]
  @Column()
  name: string;
}
