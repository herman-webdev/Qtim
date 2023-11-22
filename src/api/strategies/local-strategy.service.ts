import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ApiService } from '../api.service';

@Injectable()
export class LocalStrategyService extends PassportStrategy(Strategy, 'local') {
  constructor(private apiService: ApiService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string): Promise<boolean> {
    const user = await this.apiService.validateUser(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return user;
  }
}
