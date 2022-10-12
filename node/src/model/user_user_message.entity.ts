import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserToUserMessage{
    @PrimaryGeneratedColumn()
    id:number;
    @ManyToOne(() => User, (user: User) => user)
    @JoinColumn()
    from: User;
    @ManyToOne(() => User, (user: User) => user)
    @JoinColumn()
    to: User;
}