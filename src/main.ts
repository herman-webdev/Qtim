import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from './pipes/validation.pipe';
import { HttpExceptionFilter } from './exceptions/http.exception';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const port = process.env.PORT || 5000;
  const host = process.env.HOST || 'localhost';
  const baseUrl = `http://${host}:${port}`;

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  Logger.log(`🚀Application is running on: ${baseUrl}`);
}
bootstrap();
