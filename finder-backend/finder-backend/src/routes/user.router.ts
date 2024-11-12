import * as express from "express";
import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import protectedRoute from "../security/guard";
import { UserDTO } from "../dto/user.dto";

const userRouter = express.Router();

userRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
  try {
    const users = await UserService.getAllUsers();
    const usersDTO = users.map((user) => {
      return {
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        id: user.id,
      };
    }) as UserDTO[];

    return res.send({ users: usersDTO });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao consultar tabela de usuários." });
  }
});

userRouter.get("/:id", protectedRoute, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await UserService.getUserById(id);
    const userDTO = {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      id: user.id,
    } as UserDTO;

    return res.send({ users: userDTO });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Erro ao consultar tabela de usuários." });
  }
});

userRouter.get(
  "/:email",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
      const user = await UserService.getUserByEmail(email);
      const userDTO = {
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        id: user.id,
      } as UserDTO;

      return res.send({ users: email });
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Erro ao consultar tabela de usuários." });
    }
  }
);

userRouter.post("/", async (req: Request, res: Response) => {
  const { body } = req;

  try {
    const user = await UserService.createUser(body);
    const userDTO = {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      id: user.id,
    } as UserDTO;

    return res.status(201).send({ user: userDTO });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao criar usuário." });
  }
});

userRouter.delete(
  "/:id",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await UserService.deleteUser(id);
      res.status(202).send({ message: "usuário excluÃ­do com sucesso." });
    } catch (error) {
      return res.status(500).send({ message: "Erro ao excluir usuário." });
    }
  }
);

userRouter.put("/:id", protectedRoute, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const updatedUser = await UserService.updateUser(id, {
      name,
      email,
      password,
    });
    const userDTO = {
      email: updatedUser.email,
      name: updatedUser.name,
      createdAt: updatedUser.createdAt,
      id: updatedUser.id,
    } as UserDTO;

    return res.status(200).send({ user: userDTO });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Erro ao atualizar usuário." });
  }
});

export default userRouter;
