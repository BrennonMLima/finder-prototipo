import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { BaseModel } from "./base.model";
import { Groups } from "./group.model";
import { Films } from "./film.model";

@Entity()
export class Users extends BaseModel {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @ManyToMany(() => Groups, group => group.users)
    @JoinTable({
        name: "user_groups",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "group_id",
            referencedColumnName: "id"
        }
    })
    groups: Groups[];

    @ManyToMany(() => Films, film => film.users)
    @JoinTable({
        name: "user_films",
        joinColumn: {
            name: "user_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "film_id",
            referencedColumnName: "id"
        }
    })
    films: Films[];
}