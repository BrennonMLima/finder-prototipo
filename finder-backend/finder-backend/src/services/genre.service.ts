import { InternalException, NotFoundException } from "../exceptions/exceptions";
import { Genres } from "../models/genre.model";

export class GenreServices{
    static async getAllGenres(): Promise<Genres[]>{
        try{
            const genres = await Genres.find()
            if(genres.length === 0)
                throw new NotFoundException("Genêros não encontrados.");

            return genres;
        } catch(error){
            console.error(error);
            if(error instanceof NotFoundException) throw error;
            throw new InternalException("Erro ao consultar tabela de gêneros");
        }
    }

    static async getGenreById(genreId: number): Promise<Genres>{
        try{
            const genre = await Genres.findOneBy({id: genreId});
            if(!genre) throw new NotFoundException("Genero não encontrado");

            return genre;
        } catch(error){
            console.error(error);
            if(error instanceof NotFoundException) throw error;
            throw new InternalException("Erro ao consultar tabela de gêneros");
        }
    }

    static async createGenre(genreData: Partial<Genres>): Promise<Genres>{
        try{
            const genre = Genres.create({
                id: genreData.id,
                name: genreData.name
            })

            const newGenre = await Genres.save(genre);
            return newGenre;
        } catch(error){
            console.log(error);
            throw new InternalException("Erro ao adicionar gênero")
        }
    } 
}