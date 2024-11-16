import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  Unique,
} from "typeorm";
import { Users } from "./user.model";
import { Films } from "./film.model";

@Entity()
@Unique(["user", "film"])
export class FilmRatings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 3, scale: 1 })
  rating: number;

  @ManyToOne(() => Users, (user) => user.userFilms, { onDelete: "CASCADE" })
  user: Users;

  @ManyToOne(() => Films, (film) => film.userFilms, { onDelete: "CASCADE" })
  film: Films;
}
