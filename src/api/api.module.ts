import { Module, forwardRef } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Token } from 'src/database/entities/token.entity';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/user/token.service';
import { ApiTokenService } from './api-token.service';
import { JwtStrategyService } from './strategies/jwt-strategy.service';
import { LocalStrategyService } from './strategies/local-strategy.service';
import { RefreshStrategyService } from './strategies/refresh-strategy.service';
import { NewsModule } from 'src/news/news.module';
import { News } from 'src/database/entities/news.entity';
import { ApiNewsController } from './news.controller';
import { ApiNewsService } from './api-news.service';
import { NewsService } from 'src/news/news.service';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env` }),
    TypeOrmModule.forFeature([User, Token, News]),
    forwardRef(() => UserModule),
    forwardRef(() => NewsModule),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.SECRET_KEY,
        signOptions: { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRATION}m` },
      }),
    }),
  ],
  controllers: [ApiController, ApiNewsController],
  providers: [
    ApiService,
    ApiNewsService,
    UserService,
    NewsService,
    ApiTokenService,
    TokenService,
    JwtStrategyService,
    LocalStrategyService,
    RefreshStrategyService,
  ],
  exports: [
    ApiService,
    ApiTokenService,
    TokenService,
    JwtStrategyService,
    LocalStrategyService,
    RefreshStrategyService,
  ],
})
export class ApiModule {}
