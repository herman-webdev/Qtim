import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  refreshToken: string;

  @Column({ type: 'timestamptz', nullable: false })
  expiresIn: Date;

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  constructor(item: Partial<Token>) {
    Object.assign(this, item);
  }
}
