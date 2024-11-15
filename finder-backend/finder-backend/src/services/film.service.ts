import { getRepository, In } from "typeorm";
import { InternalException, NotFoundException } from "../exceptions/exceptions";
import { Films } from "../models/film.model";
import { Users } from "../models/user.model";
import { UserFilms } from "../models/userfilm.model";
import { Genres } from '../models/genre.model';

export class FilmService{
    static async getAllFilms(): Promise<Films[]>{
        try{
            const films = await Films.find()
            if(films.length === 0)
                throw new NotFoundException("Filmes não encontrados.");

            return films;
        } catch(error){
            console.error(error);
            if(error instanceof NotFoundException) throw error;
            throw new InternalException("Erro ao consultar tabela de filmes.");
        }
    }
 
    static async getFilmById(filmId: string): Promise<Films>{
        try{
            const film = await Films.findOneBy({id: filmId});
            if(!film) throw new NotFoundException("Filme não encontrado");

            return film;
        } catch(error){
            console.error(error);
            if(error instanceof NotFoundException) throw error;
            throw new InternalException("Erro ao consultar tabela de filmes.");
        }
    }    

    static async addFilm(filmData: Films, loggedUser: Users, isVoted: boolean, genreIds: number[]): Promise<Films>{
        try{
            console.log(genreIds);
            if (!Array.isArray(genreIds) || genreIds.length === 0) { 
                throw new Error("genreIds deve ser um array não vazio"); 

            }
            const genres = await Genres.findBy({
                id: In(genreIds),
            });

            if(!Array.isArray(genres) || genres.length === 0){
                throw new Error("Gêneros não encontrados");
            }

            const film = Films.create({
                id: filmData.id,
                title: filmData.title,
                description: filmData.description,
                genres: genres
            });

            const newFilm = await Films.save(film);

            const userFilm = UserFilms.create({
                user:loggedUser,
                watched : false,
                film: newFilm,
                isVoted: isVoted
            });
            await UserFilms.save(userFilm);

            return newFilm
        }  catch(error){
            console.error(error);
            throw new InternalException(`Erro ao adicionar o filme`);
        }
    }
}