import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
@Entity()
export class GroupsMessages {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  fromId:number;
  @Column()
  groupId:number;
  @Column()
  message:string
}
