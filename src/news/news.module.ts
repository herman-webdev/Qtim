import { Module, forwardRef } from '@nestjs/common';
import { NewsResolver } from './news.resolver';
import { NewsService } from './news.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../database/entities/news.entity';

@Module({
  imports: [TypeOrmModule.forFeature([News]), forwardRef(() => NewsModule)],
  providers: [NewsService, NewsResolver],
  exports: [NewsService],
})
export class NewsModule {}
