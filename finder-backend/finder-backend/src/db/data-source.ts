import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "P@ssw0rd",
  database: "finder",
  entities: ["src/models/*.ts"],
  logging: true,
  synchronize: true,
});
