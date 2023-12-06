import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewsService } from './news.service';
import { News } from '../database/entities/news.entity';
import { CreateNewsDto } from '../api/NewsDto/create-news.dto';
import { UpdateNewsDto } from '../api/NewsDto/update-news.dto';
import { NewsDTO } from '../api/NewsDto/news.dto';

@Resolver(() => News)
export class NewsResolver {
  constructor(private newsService: NewsService) {}

  @Query(() => [NewsDTO])
  async findAllNews(): Promise<NewsDTO[]> {
    const allNews = await this.newsService.findAll();

    return allNews.map((news) => ({
      id: news.id,
      title: news.title,
      description: news.description,
      userId: news.userId,
    }));
  }

  @Query(() => News)
  async findOne(
    @Args('id', { type: () => String }) userId: string,
    id: string,
  ): Promise<News> {
    return await this.newsService.findOne(userId, id);
  }

  @Mutation(() => News)
  async createOne(
    @Args('createOne') userId: string,
    createNewsDto: CreateNewsDto,
  ) {
    return await this.newsService.createOne(userId, createNewsDto);
  }

  @Mutation(() => News)
  async updateOne(
    @Args('updateOne') userId: string,
    createNewsDto: UpdateNewsDto,
  ) {
    return await this.newsService.updateOne(userId, createNewsDto);
  }

  @Mutation(() => News)
  async deleteOne(oneRecord: News) {
    return await this.newsService.deleteOne(oneRecord);
  }
}
