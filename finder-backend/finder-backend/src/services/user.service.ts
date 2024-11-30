import { UserDTO } from "../dto/user.dto";
import { InternalException, NotFoundException } from "../exceptions/exceptions";
import { Users } from "../models/user.model";
import { SecurityClass } from "../security/security";
export class UserService {

  static async getUserById(userId: string): Promise<Users> {
    try {
      const user = await Users.findOneBy({ id: userId });
  
      if (!user) throw new NotFoundException("Usuário não encontrado.");
  
      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao buscar usuário.");
    }
  }
  

  static async getUserByEmail(userEmail: string): Promise<Users> {
    try {
      const user = await Users.findOneBy({ email: userEmail });
      if (!user) throw new NotFoundException("Usuário não encontrado.");

      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao consultar tabela de usuários.");
    }
  }

  static async createUser(userData: Users): Promise<UserDTO> {
    try {
      const userHashPassword = await SecurityClass.encryptUserPassword(
        userData.password
      );
  
      const user = Users.create({
        name: userData.name,
        email: userData.email,
        password: userHashPassword,
        profileImageId: 0,
      });
  
      const newUser = await Users.save(user);
  
      return new UserDTO(
        newUser.name,
        newUser.email,
        newUser.createdAt,
        newUser.id,
        newUser.profileImageId
      );
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException(`Erro ao criar usu�rio.`);
    }
  }
  

  static async deleteUser(userId: string): Promise<void> {
    try {
      await Users.delete({ id: userId });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new Error(`Erro ao deletar usuário`);
    }
  }

  static async updateUser(
    userId: string,
    userData: Partial<Users>
  ): Promise<Users> {
    try {
      const user = await Users.findOneBy({ id: userId });
  
      if (!user) throw new NotFoundException("Usu�rio nao encontrado.");
  
      if (userData.password) {
        userData.password = await SecurityClass.encryptUserPassword(
          userData.password
        );
      }
  
      Object.assign(user, userData);
      const updatedUser = await Users.save(user);
  
      return updatedUser;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao atualizar usu�rio.");
    }
  }

  static async updateProfileImage(userId: string, profileImageId: number): Promise<Users> {
    try {
      const user = await Users.findOneBy({ id: userId });
  
      if (!user) throw new NotFoundException("Usuário não encontrado.");
  
      user.profileImageId = profileImageId;
      const updatedUser = await Users.save(user);
  
      return updatedUser;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao atualizar foto de perfil.");
    }
  }
  
  
}
