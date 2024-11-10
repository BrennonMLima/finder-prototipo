import { InternalException, NotFoundException } from "../exceptions/exceptions";
import { Films } from "../models/film.model";
import { Users } from "../models/user.model";

export class FilmService{
    static async getAllFilms(): Promise<Films[]>{
        try{
            const films = await Films.find()
            if(films.length === 0)
                throw new NotFoundException("Filmes não encontrados.")

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

    static async addFilm(filmData: Films, loggedUser: Users): Promise<Films>{
        try{
            const film = Films.create({
                title: filmData.title,
                description: filmData.description
            });

            film.users = [loggedUser];

            const newFilm = await Films.save(film);
            return newFilm
        }  catch(error){
            console.error(error);
            throw new InternalException(`Erro ao adicionar o filme`);
        }
    }
}