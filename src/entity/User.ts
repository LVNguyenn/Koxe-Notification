import { Entity, Column, Unique, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  user_id!: string;

  @Column()
  fullname!: string;

  @Column()
  androidFcmToken!: string;
}
