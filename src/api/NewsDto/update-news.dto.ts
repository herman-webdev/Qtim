import { Field, InputType } from '@nestjs/graphql';
import { IsString, MaxLength, MinLength } from 'class-validator';

@InputType()
export class UpdateNewsDto {
  @Field({ nullable: false })
  id: string;

  @IsString({ message: 'Title must include only letters or numbers...' })
  @MaxLength(100, {
    message: 'Title can not be more than 100 characters...',
  })
  @MinLength(1, { message: 'Title must be at least 1 characters...' })
  @Field({ nullable: false })
  title: string;

  @IsString({ message: 'Description must include only letters or numbers...' })
  @MaxLength(4000, {
    message: 'Description can not be more than 4000 characters...',
  })
  @MinLength(1, { message: 'Description must be at least 1 characters...' })
  @Field({ nullable: false })
  description: string;
}
