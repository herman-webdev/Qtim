import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/database/entities/token.entity';
import { User } from 'src/database/entities/user.entity';
import { UserService } from './user.service';
import { TokenService } from './token.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token])],
  providers: [UserService, TokenService],
  exports: [UserService],
})
export class UserModule {}
