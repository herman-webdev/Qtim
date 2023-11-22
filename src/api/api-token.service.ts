import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/user/token.service';
import { CalculateDateHelper } from './helpers/date.helper';
import { CurrentUser } from './dto/current-user.dto';

@Injectable()
export class ApiTokenService {
  constructor(
    private readonly tokenService: TokenService,
    private jwtService: JwtService,
  ) {}

  signJwtToken(id: string): string {
    return this.jwtService.sign({ id });
  }

  decodeRefreshToken(token: string): { id: string; email: string } {
    const { id, email } = this.jwtService.decode(token);

    return { id: id, email: email };
  }

  async createRefreshToken(id: string, email: string): Promise<string> {
    const payload = {
      id: id,
      email: email,
    };
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${process.env.REFRESH_TOKEN_EXPIRATION}d`,
    });
    const expiresIn = CalculateDateHelper.getCalculatedDate();
    console.log(expiresIn);
    await this.tokenService.saveRefreshToken(
      payload.id,
      refreshToken,
      expiresIn,
    );

    return refreshToken;
  }

  async updateRefreshToken(id: string, email: string): Promise<string> {
    const payload = {
      id: id,
      email: email,
    };
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${process.env.REFRESH_TOKEN_EXPIRATION}d`,
    });
    const expiresIn = CalculateDateHelper.getCalculatedDate();
    await this.tokenService.updateRefreshToken(
      payload.id,
      refreshToken,
      expiresIn,
    );

    return refreshToken;
  }

  async validateRefreshToken(
    userId: string,
    token: string,
  ): Promise<CurrentUser | boolean> {
    const validation = this.jwtService.verify(token, {
      secret: process.env.SECRET_KEY,
    });
    if (!validation) return false;

    const data = await this.tokenService.findRefreshToken(userId, token);
    if (!data || data.expiresIn < new Date()) return false;

    const currentUser = new CurrentUser();
    currentUser.id = data.user.id;
    currentUser.email = data.user.email;

    return currentUser;
  }
}
