import { InternalException, NotFoundException } from "../exceptions/exceptions";
import { Groups } from "../models/group.model";
import { Users } from "../models/user.model";
import { Genres } from "../models/genre.model";
import { GenreServices } from "./genre.service";
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

interface InviteCode {
  code: string;
  expiresAt: number;
}

const inviteCodes: Map<string, InviteCode> = new Map()

export class GroupService {


  static async getUserGroups(userId: string): Promise<Groups[]> {
    try {
      const user = await Users.findOneOrFail({
        where: { id: userId },
        relations: ["groups"],
      });

      return user.groups;
    } catch (error) {
      console.error(error);
      throw new InternalException("Erro ao consultar grupos do usuário.");
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
    genreId: number,
    loggedUser: Users
  ): Promise<Groups> {
    try {
      const genre = await GenreServices.getGenreById(genreId);
      if(!genre){
        throw new NotFoundException("Gênero inválido");
      }
      //caso de errado apaga a linha 37, 41 a 44
      const group = Groups.create({
        name: groupData.name,
        description: groupData.description,
        genres: [genre], //aq tbm, volta pra genre: groupData.genre
      });

      group.users = [loggedUser];

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

  private static generateAlphanumericCode(length = 6): string {
    return randomBytes(length)
      .toString('base64')
      .substring(0, length)
      .replace(/[+/=]/g, '');
  }

  static createInviteCode(groupId: string, expirationTimeInSeconds: number){
    const inviteCode: InviteCode = {
      code: this.generateAlphanumericCode(),
      expiresAt: Date.now() + expirationTimeInSeconds * 1000,
    };
    inviteCodes.set(groupId, inviteCode);
    return inviteCode.code;
  }

  static validateIniviteCode(groupId: string, code: string): boolean {
    const inviteCode = inviteCodes.get(groupId);
    if(inviteCode && inviteCode.code === code && Date.now() < inviteCode.expiresAt){
      return true;
    }
    if(Date.now() > inviteCode.expiresAt){
      inviteCodes.delete(groupId);
    }
    return false;
  }
  
  static async addUser(groupId: string, userId:string): Promise<void>{
    try{
      const group = await Groups.findOneOrFail({
        where: { id: groupId},
        relations: ["users"]
      });
      const user = await Users.findOneOrFail({ where: {id: userId}});

      if(!group.users){
        group.users = [];
      }
      group.users.push(user);
      await group.save();
    } catch(error){
      console.error(error);
      throw new InternalException("Erro ao adicionar usuario ao grupo")
    }
  }

  static async addUserWithInviteCode(groupId: string, userId: string, inviteCode: string): Promise<void>{

       if(this.validateIniviteCode(groupId, inviteCode)){
          await this.addUser(groupId, userId);
        }
        else{
          throw new NotFoundException("Codigo de convite inválido ou expirado.");
        }
  }
}
