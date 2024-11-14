// genre.seed.ts
import { Genres } from "../models/genre.model";
import { GenreServices } from "../services/genre.service";

const genresSeedData = [
  { id: 28, name: "acao" },
  { id: 12, name: "aventura" },
  { id: 35, name: "comedia" },
  { id: 16, name: "animacao" },
  { id: 80, name: "crime" },
  { id: 99, name: "documentario" },
  { id: 18, name: "drama" },
  { id: 10751, name: "familia" },
  { id: 14, name: "fantasia" },
  { id: 36, name: "historia" },
  { id: 27, name: "terror" },
  { id: 10402, name: "musica" },
  { id: 9648, name: "misterio" },
  { id: 10749, name: "romance" },
  { id: 878, name: "ficção cientifica" },
  { id: 10770, name: "cinema tv" },
  { id: 53, name: "thriller" },
  { id: 10752, name: "guerra" },
  { id: 37, name: "faroeste" },
];

export async function seedGenres() {
  for (const genreData of genresSeedData) {
    const existingGenre = await Genres.findOneBy({ id: genreData.id });
    if (!existingGenre) {
      const genre = await GenreServices.createGenre(genreData)
      await genre.save();
    }
  }
}
