import { Test, TestingModule } from '@nestjs/testing';
import { ApiNewsService } from '../../api-news.service';
import { NewsService } from '../../../news/news.service';
import { CreateNewsDto } from '../../NewsDto/create-news.dto';
import { UpdateNewsDto } from '../../NewsDto/update-news.dto';
import { DeleteNewsDto } from '../../NewsDto/delete.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { NewsDTO } from 'src/api/NewsDto/news.dto';
import { News } from 'src/database/entities/news.entity';

describe('ApiNewsService', () => {
  let apiNewsService: ApiNewsService;
  let newsService: NewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiNewsService,
        {
          provide: NewsService,
          useValue: {
            findAll: jest.fn(),
            createOne: jest.fn(),
            updateOne: jest.fn(),
            findOne: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    apiNewsService = module.get<ApiNewsService>(ApiNewsService);
    newsService = module.get<NewsService>(NewsService);
  });

  it('should be defined', () => {
    expect(apiNewsService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of NewsDTO', async () => {
      const expectedNews: NewsDTO[] = [
        {
          id: 'id',
          userId: 'id',
          title: 'Test News',
          description: 'Lorem Ipsum',
        },
      ];
      jest.spyOn(newsService, 'findAll').mockResolvedValue(expectedNews);

      const result = await apiNewsService.getAll();

      expect(result).toEqual(expectedNews);
      expect(newsService.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a news record and return the response', async () => {
      const userId = 'user123';
      const createNewsDto: CreateNewsDto = {
        title: 'Test News',
        description: 'Lorem Ipsum',
      };
      const expectedResponse: News = {
        id: 'news123',
        title: createNewsDto.title,
        description: createNewsDto.description,
        user: {
          id: userId,
          email: 'example@example.com',
          password: 'password123',
          news: [],
        },
      };

      jest.spyOn(newsService, 'createOne').mockResolvedValue(expectedResponse);

      const result = await apiNewsService.create(userId, createNewsDto);

      expect(result).toEqual(expectedResponse);
      expect(newsService.createOne).toHaveBeenCalledWith(userId, createNewsDto);
    });

    it('should throw BadRequestException when creation fails', async () => {
      const userId = 'user123';
      const createNewsDto: CreateNewsDto = {
        title: 'Test News',
        description: 'Lorem Ipsum',
      };

      jest.spyOn(newsService, 'createOne').mockResolvedValue(null);

      await expect(
        apiNewsService.create(userId, createNewsDto),
      ).rejects.toThrowError(BadRequestException);
      expect(newsService.createOne).toHaveBeenCalledWith(userId, createNewsDto);
    });
  });

  describe('update', () => {
    it('should update a news record and return the response', async () => {
      const userId = 'user123';
      const updateNewsDto: UpdateNewsDto = {
        id: 'news123',
        title: 'Updated News',
        description: 'New Content',
      };
      const expectedResponse: News = {
        id: 'news123',
        title: updateNewsDto.title,
        description: updateNewsDto.description,
        user: {
          id: userId,
          email: 'example@example.com',
          password: 'password123',
          news: [],
        },
      };

      jest.spyOn(newsService, 'updateOne').mockResolvedValue(expectedResponse);

      const result = await apiNewsService.update(userId, updateNewsDto);

      expect(result).toEqual(expectedResponse);
      expect(newsService.updateOne).toHaveBeenCalledWith(userId, updateNewsDto);
    });

    it('should throw BadRequestException when update fails', async () => {
      const userId = 'user123';
      const updateNewsDto: UpdateNewsDto = {
        id: 'news123',
        title: 'Updated News',
        description: 'New Content',
      };

      jest.spyOn(newsService, 'updateOne').mockResolvedValue(null);

      await expect(
        apiNewsService.update(userId, updateNewsDto),
      ).rejects.toThrowError(BadRequestException);
      expect(newsService.updateOne).toHaveBeenCalledWith(userId, updateNewsDto);
    });
  });

  describe('delete', () => {
    it('should delete a news record and return the response', async () => {
      const userId = 'user123';
      const deleteNewsDto: DeleteNewsDto = { id: 'news123' };
      const expectedResponse: News = {
        id: deleteNewsDto.id,
        title: '',
        description: '',
        user: null,
      };

      jest.spyOn(newsService, 'findOne').mockResolvedValue(expectedResponse);
      jest.spyOn(newsService, 'deleteOne').mockResolvedValue(expectedResponse);

      const result = await apiNewsService.delete(userId, deleteNewsDto);

      expect(result).toEqual(expectedResponse);
      expect(newsService.findOne).toHaveBeenCalledWith(
        userId,
        deleteNewsDto.id,
      );
      expect(newsService.deleteOne).toHaveBeenCalledWith(expectedResponse);
    });

    it('should throw NotFoundException when news not found', async () => {
      const userId = 'user123';
      const deleteNewsDto: DeleteNewsDto = { id: 'news123' };

      jest.spyOn(newsService, 'findOne').mockResolvedValue(null);

      await expect(
        apiNewsService.delete(userId, deleteNewsDto),
      ).rejects.toThrowError(NotFoundException);
      expect(newsService.findOne).toHaveBeenCalledWith(
        userId,
        deleteNewsDto.id,
      );
    });

    it('should throw BadRequestException when deletion fails', async () => {
      const userId = 'user123';
      const deleteNewsDto: DeleteNewsDto = { id: 'news123' };
      const expectedResponse: News = {
        id: deleteNewsDto.id,
        title: '',
        description: '',
        user: null,
      };

      jest.spyOn(newsService, 'findOne').mockResolvedValue(expectedResponse);
      jest.spyOn(newsService, 'deleteOne').mockResolvedValue(null);

      await expect(
        apiNewsService.delete(userId, deleteNewsDto),
      ).rejects.toThrowError(BadRequestException);
      expect(newsService.findOne).toHaveBeenCalledWith(
        userId,
        deleteNewsDto.id,
      );
      expect(newsService.deleteOne).toHaveBeenCalledWith(expectedResponse);
    });
  });
});
