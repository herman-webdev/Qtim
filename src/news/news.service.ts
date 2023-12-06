import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from '../database/entities/news.entity';
import { EntityManager, Repository, DeepPartial } from 'typeorm';
import { UpdateNewsDto } from '../api/NewsDto/update-news.dto';
import { CreateNewsDto } from '../api/NewsDto/create-news.dto';
import { NewsDTO } from '../api/NewsDto/news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private newsRepository: Repository<News>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAll(): Promise<NewsDTO[]> {
    const allNews = await this.newsRepository.find();
    return allNews.map((news) => ({
      id: news.id,
      title: news.title,
      description: news.description,
      userId: news.user.id,
    }));
  }

  async findOne(userId: string, id: string): Promise<News> {
    const userPartial: DeepPartial<News> = { id: userId };

    return await this.newsRepository.findOne({
      where: { id: id, user: userPartial },
    });
  }

  async createOne(userId: string, createNewsDto: CreateNewsDto): Promise<News> {
    const userPartial: DeepPartial<News> = { id: userId };

    const news = this.newsRepository.create({
      title: createNewsDto.title,
      description: createNewsDto.description,
      user: userPartial,
    });
    return await this.entityManager.save(news);
  }

  async updateOne(userId: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    const userPartial: DeepPartial<News> = { id: userId };

    return await this.newsRepository.save({
      id: updateNewsDto.id,
      title: updateNewsDto.title,
      description: updateNewsDto.description,
      user: userPartial,
    });
  }

  async deleteOne(oneRecord: News): Promise<News> {
    return await this.newsRepository.remove(oneRecord);
  }
}
