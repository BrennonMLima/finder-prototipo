import { Entity, Column, ManyToMany } from "typeorm";
import { BaseModel } from "./base.model";
import { Users } from "./user.model";

@Entity()
export class Groups extends BaseModel {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    genre: string;

    @ManyToMany(() => Users, user => user.groups)
    users: Users[];
}