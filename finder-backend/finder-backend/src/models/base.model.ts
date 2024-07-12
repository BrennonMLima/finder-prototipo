import {
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { v4 as uuidv4 } from "uuid";
  
  export abstract class BaseModel extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
  
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
  
    @BeforeInsert()
    @BeforeUpdate()
    updateTimestamps() {
      this.updatedAt = new Date();
    }
  
    @BeforeInsert()
    addId() {
      this.id = uuidv4();
    }
  }
  