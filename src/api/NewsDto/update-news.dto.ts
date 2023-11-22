import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateNewsDto {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: false })
  title: string;

  @Field({ nullable: false })
  description: string;
}
