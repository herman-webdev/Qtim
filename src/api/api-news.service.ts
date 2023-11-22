import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewsService } from 'src/news/news.service';
import { CreateNewsDto } from './NewsDto/create-news.dto';
import {
  ApiCreateNewsResponse,
  ApiDeleteNewsResponse,
  ApiUpdateNewsResponse,
} from 'src/utils/default.types';
import { NewsDTO } from './NewsDto/news.dto';
import { UpdateNewsDto } from './NewsDto/update-news.dto';
import { DeleteNewsDto } from './NewsDto/delete.dto';

@Injectable()
export class ApiNewsService {
  constructor(private readonly newsService: NewsService) {}

  async getAll(): Promise<NewsDTO[]> {
    return await this.newsService.findAll();
  }

  async create(
    userId: string,
    createNewsDto: CreateNewsDto,
  ): Promise<ApiCreateNewsResponse> {
    const record = await this.newsService.createOne(userId, createNewsDto);
    if (!record) throw new BadRequestException('Something went wrong');

    return record;
  }

  async update(
    userId: string,
    updateNewsDto: UpdateNewsDto,
  ): Promise<ApiUpdateNewsResponse> {
    const record = await this.newsService.updateOne(userId, updateNewsDto);
    if (!record) throw new BadRequestException('Something went wrong');

    return record;
  }

  async delete(
    userId: string,
    deleteNewsDto: DeleteNewsDto,
  ): Promise<ApiDeleteNewsResponse> {
    const record = await this.newsService.findOne(userId, deleteNewsDto.id);

    if (!record) throw new NotFoundException('Not Found');

    const deletedOne = await this.newsService.deleteOne(record);
    if (!deletedOne) throw new BadRequestException('Something went wrong');

    return deletedOne;
  }
}
