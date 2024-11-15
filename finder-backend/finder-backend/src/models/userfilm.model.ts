import {
  Entity,
  Column,
  ManyToMany,
  PrimaryColumn,
  BaseEntity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./user.model";
import { Films } from "./film.model";

@Entity("user_films")
export class UserFilms extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isVoted: boolean;

  @Column()
  watched: boolean;

  @ManyToOne(() => Users, (user) => user.userFilms)
  user: Users;

  @ManyToOne(() => Films, (film) => film.userFilms)
  film: Films;
}
