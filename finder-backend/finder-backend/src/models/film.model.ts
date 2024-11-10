import { Entity, Column, ManyToMany } from "typeorm";
import { BaseModel } from "./base.model";
import { Users } from "./user.model";

@Entity()
export class Films extends BaseModel{
    @Column()
    title:string;

    @Column()
    description:string;

    @ManyToMany(() => Users, (user) => user.films)
    users: Users[];

}