import { Entity, Column, ManyToMany, OneToMany } from "typeorm";
import { BaseModel } from "./base.model";
import { Users } from "./user.model";
import { Events } from "./event.model";

@Entity()
export class Groups extends BaseModel {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column("simple-array")
  genre: string[];

  @ManyToMany(() => Users, (user) => user.groups)
  users: Users[];

  @OneToMany(() => Events, (event) => event.group)
  events: Events[];
}
