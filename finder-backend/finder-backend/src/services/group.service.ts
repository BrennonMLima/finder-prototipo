import { InternalException, NotFoundException } from "../exceptions/exceptions";
import { Groups } from "../models/group.model";
import { Users } from "../models/user.model";
import { Genres } from "../models/genre.model";
import { GenreServices } from "./genre.service";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { In } from "typeorm";
import { UserFilms } from "../models/userfilm.model";
import { Films } from "../models/film.model";

interface InviteCode {
  code: string;
  expiresAt: number;
}

const inviteCodes: Map<string, InviteCode> = new Map();

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
    genreIds: number[],
    loggedUser: Users
  ): Promise<Groups> {
    try {
      const genres = await Genres.findBy({
        id: In(genreIds),
      });
      console.log("Genres encontrados:", genres);
      if (genres.length !== genreIds.length) {
        throw new NotFoundException("Um ou mais gêneros são inválidos.");
      }

      const group = Groups.create({
        name: groupData.name,
        description: groupData.description,
        genres: genres,
      });

      group.users = [loggedUser];

      const newGroup = await Groups.save(group);
      return newGroup;
    } catch (error) {
      console.error(error);
      throw new InternalException("Erro ao criar grupo");
    }
  }

  static async getGroupGenres(groupId: string): Promise<Genres[]> {
    try {
      const group = await Groups.findOne({
        where: { id: groupId },
        relations: ["genres"],
      });

      if (!group) throw new NotFoundException("Grupo não encontrado.");

      return group.genres;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao buscar gêneros do grupo.");
    }
  }

  static async deleteGroup(groupId: string, userId: string): Promise<void> {
    try {
      const group = await Groups.findOne({
        where: { id: groupId },
        relations: ["users"],
      });

      if (!group) throw new NotFoundException("Grupo não encontrado.");

      group.users = group.users.filter((user) => user.id !== userId);

      await group.save();
    } catch (error) {
      console.error(error);
      throw new InternalException("Erro ao sair do grupo.");
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

  static async updateGroup(
    groupId: string,
    groupData: Partial<Groups>,
    genreIds: number[]
  ): Promise<Groups> {
    try {
      const group = await Groups.findOne({
        where: { id: groupId },
        relations: ["genres"],
      });

      if (!group) throw new NotFoundException("Grupo não encontrado.");

      if (genreIds && genreIds.length > 0) {
        const genres = await Genres.findBy({ id: In(genreIds) });
        if (genres.length !== genreIds.length) {
          throw new NotFoundException("Um ou mais gêneros são inválidos.");
        }
        group.genres = genres;
      }

      Object.assign(group, groupData);

      const updatedGroup = await Groups.save(group);
      return updatedGroup;
    } catch (error) {
      console.error(error);
      throw new InternalException("Erro ao atualizar o grupo.");
    }
  }

  private static generateAlphanumericCode(length = 6): string {
    return randomBytes(length)
      .toString("base64")
      .substring(0, length)
      .replace(/[+/=]/g, "");
  }

  static createInviteCode(groupId: string, expirationTimeInSeconds: number) {
    const inviteCode: InviteCode = {
      code: this.generateAlphanumericCode(),
      expiresAt: Date.now() + expirationTimeInSeconds * 1000,
    };
    inviteCodes.set(groupId, inviteCode);
    return inviteCode.code;
  }

  static validateIniviteCode(groupId: string, code: string): boolean {
    const inviteCode = inviteCodes.get(groupId);
    if (
      inviteCode &&
      inviteCode.code === code &&
      Date.now() < inviteCode.expiresAt
    ) {
      return true;
    }
    if (Date.now() > inviteCode.expiresAt) {
      inviteCodes.delete(groupId);
    }
    return false;
  }

  static getGroupIdByInviteCode(code: string): string | null {
    for (const [groupId, inviteCode] of inviteCodes.entries()) {
      if (inviteCode.code === code && Date.now() < inviteCode.expiresAt) {
        return groupId;
      }
    }
    return null;
  }

  static getValidIinviteVode(groupId: string): string | null {
    const inviteCode = inviteCodes.get(groupId);

    if(inviteCode && Date.now() < inviteCode.expiresAt){
      return inviteCode.code;
    }

    return null;
  }

  static async addUser(groupId: string, userId: string): Promise<void> {
    try {
      const group = await Groups.findOneOrFail({
        where: { id: groupId },
        relations: ["users"],
      });
      const user = await Users.findOneOrFail({ where: { id: userId } });

      if (!group.users) {
        group.users = [];
      }
      group.users.push(user);
      await group.save();
    } catch (error) {
      console.error(error);
      throw new InternalException("Erro ao adicionar usuario ao grupo");
    }
  }

  static async addUserWithInviteCode(
    groupId: string,
    userId: string,
    inviteCode: string
  ): Promise<void> {
    if (this.validateIniviteCode(groupId, inviteCode)) {
      await this.addUser(groupId, userId);
    } else {
      throw new NotFoundException("Codigo de convite inválido ou expirado.");
    }
  }

  static async generateFilmRanking(
    groupId: string
  ): Promise<{ film: Films; votes: number }[]> {
    try {
      const group = await Groups.findOne({
        where: { id: groupId },
        relations: ["genres", "users"],
      });

      if (!group) throw new NotFoundException("Grupo não encontrado.");

      const groupGenres = group.genres.map((genre) => genre.id);

      const userIds = group.users.map((user) => user.id);

      const userFilms = await UserFilms.find({
        where: { user: In(userIds), isVoted: true },
        relations: ["film", "film.genres"],
      });

      if (userFilms.length === 0) {
        throw new NotFoundException(
          "Nenhum filme votado pelos membros do grupo."
        );
      }

      const filteredFilms = userFilms.filter((userFilm) =>
        userFilm.film.genres.some((genre) => groupGenres.includes(genre.id))
      );

      const voteCounts: Map<string, { film: Films; votes: number }> = new Map();

      filteredFilms.forEach((userFilm) => {
        const filmId = userFilm.film.id;
        if (!voteCounts.has(filmId)) {
          voteCounts.set(filmId, { film: userFilm.film, votes: 0 });
        }
        const current = voteCounts.get(filmId)!;
        current.votes += 1;
      });

      const rankedFilms = Array.from(voteCounts.values())
        .sort((a, b) => b.votes - a.votes)
        .slice(0, 10);

      return rankedFilms;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao gerar o ranking de filmes.");
    }
  }
}
