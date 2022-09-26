import { Entity,PrimaryGeneratedColumn, Column } from 'typeorm'
@Entity()
export class groups{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    name:string
}