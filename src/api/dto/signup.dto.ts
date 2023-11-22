import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString({ message: 'Password must include only letters or numbers...' })
  @MinLength(8, { message: 'Password must be at least 8 characters...' })
  @MaxLength(255, {
    message: 'Password can not be more than 255 characters...',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must include: 1 Uppercase letter, more than 8 characters and one numeric character...',
  })
  password: string;
}
