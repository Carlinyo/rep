import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: "" })
  username: string;
  // @ManyToOne(() => groups, (group: groups) => group)
  // @JoinColumn()
  // group: groups;
  @Column({ default: 0 })
  type: number;
  @Column({ default: 0 })
  verification: number;
  @Column()
  password: string;
  @Column({ default: "" })
  token: string;
}