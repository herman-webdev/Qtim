import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { SignupDto } from './AuthDto/signup.dto';
import { ApiSignupResponse, ApiSigninResponse } from 'src/utils/default.types';
import { PasswordHashHelper } from './helpers/hash.helper';
import { ApiTokenService } from './api-token.service';
import { SigninDto } from './AuthDto/signin.dto';
import { PasswordHashCompareHelper } from './helpers/hash-compare.helper';

@Injectable()
export class ApiService {
  constructor(
    private readonly userService: UserService,
    private readonly apiTokenService: ApiTokenService,
  ) {}

  async signup(signupDto: SignupDto): Promise<ApiSignupResponse> {
    const candidate = await this.userService.findUserByEmail(signupDto.email);
    if (candidate) throw new ConflictException('This user already exists');

    const hash = await PasswordHashHelper.generateHash(signupDto.password);
    const user = await this.userService.createUser({
      email: signupDto.email,
      password: hash,
    });
    if (!user || !hash) throw new BadRequestException('Something went wrong');

    const accessToken = this.apiTokenService.signJwtToken(user.id);
    const refreshToken = await this.apiTokenService.createRefreshToken(
      user.id,
      user.email,
    );
    if (!accessToken || !refreshToken)
      throw new BadRequestException('Something went wrong');

    return {
      id: user.id,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async signin(signinDto: SigninDto): Promise<ApiSigninResponse> {
    if (!signinDto.email || !signinDto.password)
      throw new UnauthorizedException('Bad id or password');

    const user = await this.userService.findUserByEmail(signinDto.email);
    if (!user) throw new UnauthorizedException('Bad id or password');

    const checkPassword = await PasswordHashCompareHelper.makeCompare(
      signinDto.password,
      user.password,
    );
    if (!checkPassword) throw new UnauthorizedException('Bad id or password');

    const accessToken = this.apiTokenService.signJwtToken(user.id);
    const refreshToken = await this.apiTokenService.updateRefreshToken(
      user.id,
      user.email,
    );
    if (!accessToken || !refreshToken)
      throw new BadRequestException('Something went wrong');

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async validateRefreshFromRequest(token: string) {
    const decodedRefreshToken = this.apiTokenService.decodeRefreshToken(token);
    if (!decodedRefreshToken) throw new UnauthorizedException('Unauthorized');

    const accessToken = this.apiTokenService.signJwtToken(
      decodedRefreshToken.id,
    );
    const refreshToken = await this.apiTokenService.updateRefreshToken(
      decodedRefreshToken.id,
      decodedRefreshToken.email,
    );
    if (!accessToken || !refreshToken)
      throw new BadRequestException('Something went wrong');

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async validateUser(email: string): Promise<boolean> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) return false;

    return true;
  }
}
