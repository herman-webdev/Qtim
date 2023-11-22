import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { Response, Request } from 'express';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('signup')
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.apiService.signup(signupDto);

    res.cookie('accessToken', user.accessToken, { httpOnly: true });
    res.cookie('refreshToken', user.refreshToken, { httpOnly: true });
    res.status(200).json(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  async signin(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.apiService.signin(signinDto);

    res.cookie('accessToken', user.accessToken, { httpOnly: true });
    res.cookie('refreshToken', user.refreshToken, { httpOnly: true });
    res.status(200).json(user);
  }

  @UseGuards(AuthGuard('refresh'))
  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const checkToken = await this.apiService.validateRefreshFromRequest(
      req.cookies['refreshToken'],
    );

    res.cookie('accessToken', checkToken.accessToken, { httpOnly: true });
    res.cookie('refreshToken', checkToken.refreshToken, { httpOnly: true });
    res.status(200).json(checkToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  async getUser(@Req() req: any, @Res() res: Response) {
    return res.status(200).json({ id: req.user.id });
  }
}
