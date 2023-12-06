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
import { DeleteNewsDto } from './NewsDto/delete.dto';

@Controller('news')
export class ApiNewsController {
  constructor(private readonly apiNewsService: ApiNewsService) {}

  @Get('get')
  async get(@Res({ passthrough: true }) res: Response) {
    const allNews = await this.apiNewsService.getAll();
    res.status(200).json(allNews);
  }

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Req() req: any,
    @Body() creteNewsDto: CreateNewsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.apiNewsService.create(req.user.id, creteNewsDto);
    res.status(200).json(user);
  }

  @Put('update')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Req() req: any,
    @Body() updateNewsDto: UpdateNewsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const record = await this.apiNewsService.update(req.user.id, updateNewsDto);
    res.status(200).json(record);
  }

  @Delete('delete')
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Req() req: any,
    @Body() deleteNewsDto: DeleteNewsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const record = await this.apiNewsService.delete(req.user.id, deleteNewsDto);
    res.status(200).json(record);
  }
}
