import * as express from "express";
import publicRouter from "./src/routes/public.router";
import groupRouter from "./src/routes/group.router";
import userRouter from "./src/routes/user.router";
import { AppDataSource } from "./src/db/data-source";
import exceptionsMiddleware from "./src/middleware/exceptions.middleware";
import * as cors from "cors"


AppDataSource.initialize()
  .then(() => {
    console.log("Banco inicializado!");
  })
  .catch((err) => {
    console.error("Erro durante a inicialização do banco: ", err);
  });

const app = express();

app.use(cors())
app.use(express.json());
app.use("/user", userRouter);
app.use("/group", groupRouter);
app.use("", publicRouter);
app.use(exceptionsMiddleware);


app.listen(8000);