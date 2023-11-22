import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { News } from './news.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true, nullable: false })
  @Field(() => String)
  email: string;

  @Column({ nullable: false })
  @Field(() => String)
  password: string;

  @OneToMany(() => News, (news) => news.user)
  @Field(() => [News], { nullable: true })
  news: News[];

  constructor(item: Partial<User>) {
    Object.assign(this, item);
  }
}
