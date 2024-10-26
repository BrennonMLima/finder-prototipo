import * as express from "express";
import { Request, Response } from "express";
import { GroupService } from "../services/group.service";
import protectedRoute from "../security/guard";
import { Groups } from "../models/group.model";

const groupRouter = express.Router();

groupRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
  try {
    const groups = await GroupService.getAllGroups();
    return res.send({ groups: groups });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao consultar tabela de grupos." });
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

groupRouter.post("/", async (req: Request, res: Response) => {
  const { name, description, genre, userEmails } = req.body;

  try {
    const groupData: Partial<Groups> = { name, description, genre };
    const group = await GroupService.createGroup(
      groupData as Groups,
      userEmails
    );
    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar grupo" });
  }
});

groupRouter.delete(
  "/:id",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await GroupService.deleteGroup(id);
      res.status(202).send({ message: "Grupo excluído com sucesso." });
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
    res.status(500).json({ message: "Erro ao obter usuários do grupo" });
  }
});

export default groupRouter;
