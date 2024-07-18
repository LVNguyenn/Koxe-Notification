import {
  Entity,
  Column,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
// import { Salon } from "./Salon";

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  salon_id!: string;

  @Column()
  date!: Date;

  @Column()
  description!: string;

  @Column({ default: 0 })
  status!: number;

  @Column()
  user_id!: string;

  @Column({
    type: "timestamptz",
    default: () => "timezone('Asia/Saigon', now())",
  })
  create_at!: Date;

  @ManyToOne(() => User, (user) => user.user_id)
  @JoinColumn({ name: "user_id" })
  user!: User;

  // @ManyToOne(() => Salon, (salon) => salon.salon_id)
  // @JoinColumn({ name: "salon_id" })
  // salon!: Salon;

  @Column({ default: "user" })
  from!: string;

  @Column()
  car_id!: string;

  @Column()
  notificationTime!: Date;

  @Column()
  notificationSent!: boolean;
}
