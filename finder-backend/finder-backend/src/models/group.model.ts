import { Entity, Column, ManyToMany, OneToMany, JoinTable } from "typeorm";
import { BaseModel } from "./base.model";
import { Users } from "./user.model";
import { Events } from "./event.model";
import { Genres } from "./genre.model";

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

  @ManyToMany(() => Genres, genre => genre.groups)
    @JoinTable({
        name: "group_genres",
        joinColumn: {
            name:"group_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name:"genre_id",
            referencedColumnName:"id"
        }
    })
    genres: Genres[];
}
