// news.entity.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity()
export class News {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ nullable: false })
  @Field({ nullable: false })
  title: string;

  @Column({ nullable: false })
  @Field({ nullable: false })
  description: string;

  @ManyToOne(() => User, (user) => user.news, { eager: true })
  @Field(() => User, { nullable: true })
  user: User;

  constructor(item: Partial<News>) {
    Object.assign(this, item);
  }
}
