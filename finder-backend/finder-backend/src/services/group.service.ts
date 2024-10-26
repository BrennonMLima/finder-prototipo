import { InternalException, NotFoundException } from "../exceptions/exceptions";
import { Groups } from "../models/group.model";
import { Users } from "../models/user.model";
import { In } from "typeorm";
// import { getRepository } from 'typeorm';

export class GroupService {
  static async getAllGroups(): Promise<Groups[]> {
    try {
      const groups = await Groups.find();
      if (groups.length === 0)
        throw new NotFoundException("Grupos não encontrados.");

      return groups;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao consultar tabela de grupos.");
    }
  }

  static async getGroupById(groupId: string): Promise<Groups> {
    try {
      const group = await Groups.findOneBy({ id: groupId });
      if (!group) throw new NotFoundException("Usuário não encontrado.");

      return group;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao consultar tabela de grupos.");
    }
  }

  static async createGroup(
    groupData: Groups,
    userEmails: string[]
  ): Promise<Groups> {
    try {
      const fixedEmail = "brennon@gmail.com";
      if (!userEmails.includes(fixedEmail)) {
        userEmails.push(fixedEmail);
      }

      const group = Groups.create({
        name: groupData.name,
        description: groupData.description,
        genre: groupData.genre,
      });

      const users = await Users.find({
        where: { email: In(userEmails) },
      });

      if (users.length !== userEmails.length) {
        const foundEmails = users.map((user) => user.email);
        const notFoundEmails = userEmails.filter(
          (email) => !foundEmails.includes(email)
        );
        console.warn(`
                Os usuários com estes e-mails não foram encontrados: ${notFoundEmails.join(
                  ", "
                )}`);
      }

      group.users = users;

      const newGroup = await Groups.save(group);

      return newGroup;
    } catch (error) {
      console.error(error);
      throw new InternalException(`Erro ao criar grupo`);
    }
  }

  static async deleteGroup(groupId: string): Promise<void> {
    try {
      const group = await Groups.findOneOrFail({
        where: { id: groupId },
        relations: ["users"],
      });

      group.users = [];
      await group.save();

      await Groups.delete({ id: groupId });
    } catch (error) {
      console.error(error);
      throw new InternalException(`Erro ao deletar grupo: ${error.message}`);
    }
  }

  static async getUsersInGroup(groupId: string): Promise<string[]> {
    try {
      const group = await Groups.findOneOrFail({
        where: { id: groupId },
        relations: ["users"],
      });

      const userNames = group.users.map((user) => user.name);

      return userNames;
    } catch (error) {
      console.error(error);
      throw new InternalException("Erro ao consultar usuários do grupo.");
    }
  }
}
