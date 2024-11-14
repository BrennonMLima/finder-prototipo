import { Entity, Column, ManyToMany, PrimaryColumn, BaseEntity } from "typeorm";
import { Films } from "./film.model";
import { Groups } from "./group.model";


@Entity()
export class Genres extends BaseEntity{

    @PrimaryColumn()
    id: number;

    @Column()
    name:string;

    @ManyToMany(() => Films, (film) => film.genres)
    films: Films[];

    @ManyToMany(() => Groups, (group) => group.genres)
    groups: Groups[];

}