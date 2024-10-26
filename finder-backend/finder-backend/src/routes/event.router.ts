import * as express from "express";
import { Request, Response } from "express";
import { EventService } from "../services/event.service";
import protectedRoute from "../security/guard";
import { Events } from "../models/event.model";

const eventRouter = express.Router();

eventRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
  try {
    const events = await EventService.getAllEvents();
    return res.send({ events: events });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao consultar eventos." });
  }
});

eventRouter.get("/:id", protectedRoute, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const event = await EventService.getEventById(id);
    return res.send({ event: event });
  } catch (error) {
    return res.status(500).send({ message: "Erro ao consultar evento." });
  }
});

eventRouter.post("/", protectedRoute, async (req: Request, res: Response) => {
  const { name, location, date, description, groupId } = req.body;

  try {
    const eventData: Partial<Events> = { name, location, date, description };
    const event = await EventService.createEvent(eventData as Events, groupId);
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar evento." });
  }
});

eventRouter.put("/:id", protectedRoute, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, location, date, description } = req.body;

  try {
    const eventData: Partial<Events> = { name, location, date, description };
    const updatedEvent = await EventService.updateEvent(id, eventData);
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar evento." });
  }
});

eventRouter.delete(
  "/:id",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await EventService.deleteEvent(id);
      res.status(202).send({ message: "Evento excluído com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Erro ao excluir evento." });
    }
  }
);

eventRouter.get(
  "/group/:groupId",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { groupId } = req.params;

    try {
      const events = await EventService.getEventsByGroup(groupId);
      res.json(events);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao obter eventos do grupo." });
    }
  }
);

export default eventRouter;
