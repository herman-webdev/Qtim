import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteNewsDto {
  @Field({ nullable: false })
  id: string;
}
