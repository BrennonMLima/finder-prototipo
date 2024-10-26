import { Entity, Column, ManyToOne } from "typeorm";
import { BaseModel } from "./base.model";
import { Groups } from "./group.model";

@Entity()
export class Events extends BaseModel {
  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ type: "timestamp" })
  date: Date;

  @Column({ type: "text" })
  description: string;

  @ManyToOne(() => Groups, (group) => group.events, { onDelete: "CASCADE" })
  group: Groups;
}
