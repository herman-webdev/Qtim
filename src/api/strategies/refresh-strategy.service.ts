import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ApiTokenService } from '../api-token.service';

@Injectable()
export class RefreshStrategyService extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor(private readonly apiTokenService: ApiTokenService) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const secretData = request?.cookies['refreshToken'];

          return secretData;
        },
      ]),
    });
  }

  async validate(
    req: Request,
    payload: { id: string; email: string },
  ): Promise<string> {
    if (!payload) throw new ForbiddenException('Invalid Token');

    const token = req?.cookies['refreshToken'];
    if (!token) throw new ForbiddenException('Invalid Token');

    const validated = await this.apiTokenService.validateRefreshToken(
      payload.id,
      token,
    );
    if (!validated) throw new ForbiddenException('Token has expired');

    return token;
  }
}
