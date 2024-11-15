import { Entity, Column, ManyToMany, PrimaryColumn, BaseEntity, JoinTable, OneToMany } from "typeorm";
import { Users } from "./user.model";
import { Genres } from "./genre.model";
import { UserFilms } from "./userfilm.model";

@Entity()
export class Films extends BaseEntity{

    @PrimaryColumn()
    id: string;

    @Column()
    title:string;

    @Column({ type: 'varchar', length: 500 })
    description:string;

    @OneToMany(() => UserFilms, userFilms => userFilms.film)
    userFilms: UserFilms[];
    
    // @ManyToMany(() => Users, (user) => user.films)
    // users: Users[];
    @ManyToMany(() => Genres, genre => genre.films)
    @JoinTable({
        name: "film_genres",
        joinColumn: {
            name:"film_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name:"genre_id",
            referencedColumnName:"id"
        },
    })
    genres: Genres[];

}