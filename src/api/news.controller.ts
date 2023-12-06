import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiNewsService } from './api-news.service';
import { CreateNewsDto } from './NewsDto/create-news.dto';
import { UpdateNewsDto } from './NewsDto/update-news.dto';

@Controller('news')
export class ApiNewsController {
  constructor(private readonly apiNewsService: ApiNewsService) {}

  @Get('get')
  async get(@Res({ passthrough: true }) res: Response) {
    const allNews = await this.apiNewsService.getAll();
    res.status(200).json(allNews);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(
    @Req() req: any,
    @Body() creteNewsDto: CreateNewsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.apiNewsService.create(req.user.id, creteNewsDto);
    res.status(200).json(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update')
  async update(
    @Req() req: any,
    @Body() updateNewsDto: UpdateNewsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const record = await this.apiNewsService.update(req.user.id, updateNewsDto);
    res.status(200).json(record);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete')
  async delete(
    @Req() req: any,
    @Body() updateNewsDto: UpdateNewsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const record = await this.apiNewsService.delete(req.user.id, updateNewsDto);
    res.status(200).json(record);
  }
}
