import * as express from "express";
import { Request, Response } from "express";
import { FilmService } from "../services/film.service";
import protectedRoute from "../security/guard";
import { Users } from "../models/user.model";
import * as jwt from "jsonwebtoken";
import { Films } from "../models/film.model";

const filmRouter = express.Router();

filmRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
  try {
    const films = await FilmService.getAllFilms();
    return res.send({ films: films });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao consultar a tabela de filmes." });
  }
});

filmRouter.get("/id", protectedRoute, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const films = await FilmService.getFilmById(id);
    return res.send({ films: films });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao consultar a tabela de filmes." });
  }
});

filmRouter.post("/", protectedRoute, async (req: Request, res: Response) => {
  const { id, title, description, isVoted, genreIds } = req.body;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as { email: string };
    const loggedUserEmail = decoded.email;

    const loggedUser = await Users.findOne({
      where: { email: loggedUserEmail },
    });

    if (!loggedUser) {
      return res.status(401).json({ message: "Usuário não autorizado" });
    }

    const filmData: Partial<Films> = { id, title, description };

    const film = await FilmService.addFilm(
      filmData as Films,
      loggedUser,
      isVoted,
      genreIds
    );

    return res.status(201).json({ film });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao adicionar filme" });
  }
});

filmRouter.post("/:filmId/watched", async (req, res) => {
  const { filmId } = req.params;
  const { userId, groupId } = req.body;

  try {
    await FilmService.markAsWatched(userId, filmId, groupId);
    return res.status(200).json({ message: "Filme marcado como assistido" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

export default filmRouter;
