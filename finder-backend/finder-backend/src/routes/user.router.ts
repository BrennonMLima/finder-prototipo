import * as express from "express";
import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import protectedRoute from "../security/guard";
import { UserDTO } from "../dto/user.dto";
import { Users } from "../models/user.model";
import * as jwt from "jsonwebtoken";

const userRouter = express.Router();

userRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as { id: string };
    const loggedUserId = decoded.id;

    const loggedUser = await UserService.getUserById(loggedUserId);

    const userDTO = new UserDTO(
      loggedUser.name,
      loggedUser.email,
      loggedUser.createdAt,
      loggedUser.id,
      loggedUser.profileImageId
    );

    return res.status(200).send({ user: userDTO });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Erro ao buscar usuário logado." });
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
    const userDTO = new UserDTO(
      user.name,
      user.email,
      user.createdAt,
      user.id,
      user.profileImageId
    );

    return res.status(201).send({ user: userDTO });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao criar usu�rio." });
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

userRouter.put("/", protectedRoute, async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const { name, email, password, profileImageId } = req.body;

  console.log('Dados recebidos no backendeee:', name);

  if (!authorization) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.decode(token) as { id: string };
    const loggedUser= decoded.id;

    const updatedUser = await UserService.updateUser(loggedUser, {
      name
    });

    const userDTO = new UserDTO(
      updatedUser.name,
      updatedUser.email,
      updatedUser.createdAt,
      updatedUser.id,
      updatedUser.profileImageId
    );

    return res.status(200).send({ user: userDTO });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Erro ao atualizar usu�rio." });
  }
});

userRouter.put("/changePassword", protectedRoute, async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const { currentPassword, newPassword } = req.body;

  if (!authorization) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authorization.split(" ")[1];

  try{
    const decoded = jwt.decode(token) as { id: string };
    const loggedUser= decoded.id;

    await UserService.changeUserPassword(loggedUser, currentPassword, newPassword);

    return res.status(200).json({ message: "Senha alterada com sucesso"});
  }catch(error){
    console.log(error);
    return res.status(500).send({ message: "Erro ao alterar a senha"});
  }

  
})

userRouter.put("/profile-image", async (req: Request, res: Response) => {
  const { profileImageId } = req.body;
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

    if (!profileImageId) {
      return res.status(400).json({ message: "ID da imagem de perfil é obrigatório." });
    }

    const updatedUser = await UserService.updateProfileImage(
      loggedUser.id,
      profileImageId
    );

    return res.status(200).json({
      message: "Foto de perfil atualizada com sucesso!",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        createdAt: updatedUser.createdAt,
        profileImageId: updatedUser.profileImageId,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar foto de perfil." });
  }
});



export default userRouter;
