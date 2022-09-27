import { Column, PrimaryGeneratedColumn,Entity } from "typeorm";

@Entity()
export class Messages{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    fromId:number
    @Column()
    toId:number
    @Column()
    message:string
}