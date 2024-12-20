import * as express from "express";
import { Request, Response } from "express";
import { GroupService } from "../services/group.service";
import protectedRoute from "../security/guard";
import { Groups } from "../models/group.model";
import * as jwt from "jsonwebtoken";
import { Users } from "../models/user.model";
import { Genres } from "../models/genre.model";
import { In } from "typeorm";
import { NotFoundException } from "../exceptions/exceptions";

const groupRouter = express.Router();

groupRouter.get("/", async (req: Request, res: Response) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as { email: string };
    const loggedUserEmail = decoded.email;

    const user = await Users.findOne({ where: { email: loggedUserEmail } });

    if (!user) {
      return res.status(401).json({ message: "Usuário não autorizado" });
    }
    const groups = await GroupService.getUserGroups(user.id);
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao obter grupos do usuário" });
  }
});

groupRouter.get("/:id", protectedRoute, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const group = await GroupService.getGroupById(id);
    return res.send({ groups: group });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao consultar tabela de grupos." });
  }
});

groupRouter.post("/", protectedRoute, async (req: Request, res: Response) => {
  const { name, description, genreIds } = req.body;
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

    const groupData: Partial<Groups> = { name, description };

    const group = await GroupService.createGroup(
      groupData as Groups,
      genreIds,
      loggedUser
    );

    return res.status(201).json({ group });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar grupo" });
  }
});

groupRouter.put("/:id", protectedRoute, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, genreIds } = req.body;

  try {
    const groupData: Partial<Groups> = { name, description };
    const updatedGroup = await GroupService.updateGroup(
      id,
      groupData,
      genreIds
    );

    return res.status(200).json({ group: updatedGroup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar grupo" });
  }
});

groupRouter.delete(
  "/:id/leave",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const token = authorization.split(" ")[1];

    try {
      const decoded = jwt.decode(token) as { email: string };
      const loggedUserEmail = decoded.email;

      const user = await Users.findOne({ where: { email: loggedUserEmail } });

      if (!user) {
        return res.status(401).json({ message: "Usuário não autorizado" });
      }

      await GroupService.deleteGroup(id, user.id);
      res.status(202).send({ message: "Usuário saiu do grupo com sucesso." });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Erro ao sair do grupo." });
    }
  }
);

groupRouter.get("/:groupId/users", async (req: Request, res: Response) => {
  const { groupId } = req.params;

  try {
    const users = await GroupService.getUsersInGroup(groupId);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao obter usuários do grupo" });
  }
});

groupRouter.post(
  "/:groupId/invite",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const  expirationTimeInSeconds = 3600;
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "Token não fornecido" });
    }
    
    try {
      const existingCode = GroupService.getValidIinviteVode(groupId);
  
      if(existingCode){
        console.log(`o codigo ja existe e é ${existingCode}`);
        return res.json({ inviteCode: existingCode});
      }
      const inviteCode = GroupService.createInviteCode(
        groupId,
        expirationTimeInSeconds
      );
      res.json({ inviteCode });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao gerar código de convite" });
    }
  }
);

groupRouter.get("/groupId/:inviteCode", async (req: Request, res: Response) => {
  const { inviteCode } = req.params;

  try {
    const groupId = GroupService.getGroupIdByInviteCode(inviteCode);
    if (!groupId) {
      return res.status(404).json({ message: "Código de convite inválido ou expirado." });
    }
    res.json({ groupId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar o ID do grupo." });
  }
});

groupRouter.post(
  "/:groupId/join",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const { inviteCode } = req.body;
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const token = authorization.split(" ")[1];

    try {
      const decoded = jwt.decode(token) as { email: string };
      const loggedUserEmail = decoded.email;

      const user = await Users.findOne({ where: { email: loggedUserEmail } });

      if (!user) {
        return res.status(401).json({ message: "Usuário não autorizado" });
      }

      await GroupService.addUserWithInviteCode(groupId, user.id, inviteCode);

      res
        .status(200)
        .json({ message: "Usuário adicionado ao groupo com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao adicionar usuário ao grupo" });
    }
  }
);

groupRouter.get(
  "/:id/genres",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const genres = await GroupService.getGroupGenres(id);
      res.status(200).json({ genres });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: "Grupo não encontrado." });
      } else {
        res.status(500).json({ message: "Erro ao buscar gêneros do grupo." });
      }
    }
  }
);

groupRouter.get(
  "/:id/ranking",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const rankedFilms = await GroupService.generateFilmRanking(id);

      res.status(200).json({
        message: "Ranking gerado com sucesso.",
        ranking: rankedFilms.map(({ film, votes }) => ({
          id: film.id,
          title: film.title,
          description: film.description,
          votes: votes,
          genres: film.genres,
        })),
      });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erro ao gerar ranking de filmes." });
      }
    }
  }
);

export default groupRouter;
