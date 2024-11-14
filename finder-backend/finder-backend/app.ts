import * as express from "express";
import publicRouter from "./src/routes/public.router";
import groupRouter from "./src/routes/group.router";
import eventRouter from "./src/routes/event.router";
import userRouter from "./src/routes/user.router";
import filmRouter from "./src/routes/film.router";
import { AppDataSource } from "./src/db/data-source";
import exceptionsMiddleware from "./src/middleware/exceptions.middleware";
import * as cors from "cors";
import { seedGenres } from "./src/seeds/genre.seed"

async function initializeDatabase(){

  async function initializeDatabase() {
    await AppDataSource.initialize();
    console.log("Banco inicializado!");
  
    await seedGenres();
    console.log("Gêneros seed inseridos com sucesso");
  }
  
  initializeDatabase().catch((err) => {
    console.error("Erro durante a inicialização do banco: ", err);
  });
}
  
const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", userRouter);
app.use("/group", groupRouter);
app.use("/event", eventRouter);
app.use("/films", filmRouter);
app.use("", publicRouter);
app.use(exceptionsMiddleware);

app.listen(8000);
