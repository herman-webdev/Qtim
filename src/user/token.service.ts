import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../database/entities/token.entity';
import { User } from '../database/entities/user.entity';
import { Repository, DeepPartial } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async findRefreshToken(userId: string, token: string): Promise<Token> {
    const userPartial: DeepPartial<User> = { id: userId };

    return await this.tokenRepository.findOne({
      where: { user: userPartial, refreshToken: token },
    });
  }

  async saveRefreshToken(
    userId: string,
    token: string,
    expiresIn: Date,
  ): Promise<Token> {
    const userPartial: DeepPartial<User> = { id: userId };

    return await this.tokenRepository.save({
      user: userPartial,
      refreshToken: token,
      expiresIn: expiresIn,
    });
  }

  async updateRefreshToken(
    userId: string,
    token: string,
    expiresIn: Date,
  ): Promise<Token> {
    const userPartial: DeepPartial<User> = { id: userId };
    await this.tokenRepository.delete({ user: userPartial });
    return await this.tokenRepository.save({
      user: userPartial,
      refreshToken: token,
      expiresIn: expiresIn,
    });
  }
}
