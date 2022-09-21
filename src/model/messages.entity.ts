import { Column, PrimaryGeneratedColumn } from "typeorm";

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