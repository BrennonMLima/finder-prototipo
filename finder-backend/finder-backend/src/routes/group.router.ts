import * as express from "express";
import { Request, Response } from "express";
import { GroupService } from "../services/group.service";
import protectedRoute from "../security/guard";
import { Groups } from "../models/group.model";
import * as jwt from "jsonwebtoken";
import { Users } from "../models/user.model";

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
  const { name, description, genre } = req.body;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Token nÃ£o fornecido" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as { email: string };
    const loggedUserEmail = decoded.email;

    const loggedUser = await Users.findOne({
      where: { email: loggedUserEmail },
    });

    if (!loggedUser) {
      return res.status(401).json({ message: "UsuÃ¡rio nÃ£o autorizado" });
    }

    const groupData: Partial<Groups> = { name, description, genre };

    const group = await GroupService.createGroup(
      groupData as Groups,
      loggedUser
    );

    return res.status(201).json({ group });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao criar grupo" });
  }
});

groupRouter.delete(
  "/:id",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await GroupService.deleteGroup(id);
      res.status(202).send({ message: "Grupo excluÃ­do com sucesso." });
    } catch (error) {
      return res.status(500).send({ message: "Erro ao excluir grupo." });
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
    res.status(500).json({ message: "Erro ao obter usuÃ¡rios do grupo" });
  }
});

export default groupRouter;
