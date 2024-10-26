import { InternalException, NotFoundException } from "../exceptions/exceptions";
import { Events } from "../models/event.model";
import { Groups } from "../models/group.model";

export class EventService {
  static async getAllEvents(): Promise<Events[]> {
    try {
      const events = await Events.find({ relations: ["group"] });
      if (events.length === 0)
        throw new NotFoundException("Eventos não encontrados.");

      return events;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao consultar eventos.");
    }
  }

  static async getEventById(eventId: string): Promise<Events> {
    try {
      const event = await Events.findOne({
        where: { id: eventId },
        relations: ["group"],
      });
      if (!event) throw new NotFoundException("Evento não encontrado.");

      return event;
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException("Erro ao consultar evento.");
    }
  }

  static async createEvent(
    eventData: Events,
    groupId: string
  ): Promise<Events> {
    try {
      const group = await Groups.findOneBy({ id: groupId });
      if (!group) throw new NotFoundException("Grupo não encontrado.");

      const event = Events.create({
        name: eventData.name,
        location: eventData.location,
        date: eventData.date,
        description: eventData.description,
        group: group,
      });

      const newEvent = await Events.save(event);
      return newEvent;
    } catch (error) {
      console.error(error);
      throw new InternalException("Erro ao criar evento.");
    }
  }

  static async updateEvent(
    eventId: string,
    eventData: Partial<Events>
  ): Promise<Events> {
    try {
      const event = await Events.findOneBy({ id: eventId });
      if (!event) throw new NotFoundException("Evento não encontrado.");

      Object.assign(event, eventData);
      const updatedEvent = await Events.save(event);

      return updatedEvent;
    } catch (error) {
      console.error(error);
      throw new InternalException("Erro ao atualizar evento.");
    }
  }

  static async deleteEvent(eventId: string): Promise<void> {
    try {
      const event = await Events.findOneOrFail({ where: { id: eventId } });

      await Events.delete({ id: eventId });
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalException(`Erro ao deletar evento: ${error.message}`);
    }
  }

  static async getEventsByGroup(groupId: string): Promise<Events[]> {
    try {
      const group = await Groups.findOneOrFail({
        where: { id: groupId },
        relations: ["events"],
      });

      return group.events;
    } catch (error) {
      console.error(error);
      throw new InternalException("Erro ao consultar eventos do grupo.");
    }
  }
}
