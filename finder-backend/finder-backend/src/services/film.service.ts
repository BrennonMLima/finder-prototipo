import { getRepository, In } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { InternalException, NotFoundException } from "../exceptions/exceptions";
import { Films } from "../models/film.model";
import { Users } from "../models/user.model";
import { UserFilms } from "../models/userfilm.model";
import { Genres } from "../models/genre.model";
import { Groups } from "../models/group.model";

export class FilmService {
  static async getAllFilms(): Promise<Films[]> {
    try {
      const films = await Films.find();
      if (films.length === 0)
        throw new NotFoundException("Filmes não encontrados.");

      return films;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao consultar tabela de filmes.");
    }
  }

  static async getFilmById(filmId: string): Promise<Films> {
    try {
      const film = await Films.findOneBy({ id: filmId });
      if (!film) throw new NotFoundException("Filme não encontrado");

      return film;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao consultar tabela de filmes.");
    }
  }

  static async addFilm(
    filmData: Films,
    loggedUser: Users,
    isVoted: boolean,
    genreIds: number[]
  ): Promise<Films> {
    try {
      console.log(genreIds);
      if (!Array.isArray(genreIds) || genreIds.length === 0) {
        throw new Error("genreIds deve ser um array não vazio");
      }
      const genres = await Genres.findBy({
        id: In(genreIds),
      });

      if (!Array.isArray(genres) || genres.length === 0) {
        throw new Error("Gêneros não encontrados");
      }

      const film = Films.create({
        id: filmData.id,
        title: filmData.title,
        description: filmData.description,
        genres: genres,
      });
      const existingFilm = await Films.findOneBy({ id: filmData.id });
      console.log(existingFilm);

      if (!existingFilm) {
        const newFilm = await Films.save(film);

        const userFilm = UserFilms.create({
          user: loggedUser,
          watched: false,
          film: newFilm,
          isVoted: isVoted,
        });
        await UserFilms.save(userFilm);

        return newFilm;
      } else {
        const existingVote = await UserFilms.findOne({
          where: {
            film: { id: filmData.id },
            user: { id: loggedUser.id },
          },
        });

        if (!existingVote) {
          const userFilm = UserFilms.create({
            user: loggedUser,
            watched: false,
            film: film,
            isVoted: isVoted,
          });
          await UserFilms.save(userFilm);
        }
      }
    } catch (error) {
      console.error(error);
      throw new InternalException(`Erro ao adicionar o filme`);
    }
  }

  static async markAsWatched(
    userId: string,
    filmId: string,
    groupId: string
  ): Promise<void> {
    try {
      const group = await Groups.findOne({
        where: { id: groupId },
        relations: ["users"],
      });
      if (!group) {
        throw new NotFoundException("Grupo não encontrado");
      }

      const userInGroup = group.users.some((user) => user.id === userId);
      if (!userInGroup) {
        throw new NotFoundException("Usuário não pertence ao grupo fornecido");
      }

      const film = await Films.findOne({ where: { id: filmId } });
      if (!film) {
        throw new NotFoundException("Filme não encontrado");
      }

      const userFilmRecords = await UserFilms.find({
        where: {
          film,
          user: { id: In(group.users.map((user) => user.id)) },
        },
        relations: ["user"],
      });

      const updatedRecords = userFilmRecords.map((record) => {
        record.watched = true;
        record.isVoted = false;
        return record;
      });

      await UserFilms.save(updatedRecords);

      const usersWithoutRecords = group.users.filter(
        (groupUser) =>
          !userFilmRecords.some((record) => record.user.id === groupUser.id)
      );

      const newRecords = usersWithoutRecords.map((groupUser) =>
        UserFilms.create({
          user: groupUser,
          film,
          watched: true,
          isVoted: false,
        })
      );

      if (newRecords.length > 0) {
        await UserFilms.save(newRecords);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao marcar filme como assistido.");
    }
  }
}
