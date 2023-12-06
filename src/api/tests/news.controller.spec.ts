import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { ApiNewsController } from '../news.controller';
import { ApiNewsService } from '../api-news.service';
import { JwtStrategyService } from '../strategies/jwt-strategy.service';
import { uuidv4 } from './helpers/uuid.test';
import { CreateNewsDto } from '../NewsDto/create-news.dto';
import { UpdateNewsDto } from '../NewsDto/update-news.dto';
import { NewsDTO } from '../NewsDto/news.dto';
import { DeleteNewsDto } from '../NewsDto/delete.dto';

describe('NewsController', () => {
  let controller: ApiNewsController;
  let mockApiNewsService: jest.Mocked<ApiNewsService>;
  let mockResponse: jest.Mocked<Response>;

  beforeEach(async () => {
    mockApiNewsService = {
      create: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<ApiNewsService>;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as jest.Mocked<Response>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiNewsController],
      providers: [
        { provide: ApiNewsService, useValue: mockApiNewsService },
        {
          provide: JwtStrategyService,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    }).compile();

    controller = module.get<ApiNewsController>(ApiNewsController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create: post should be created', async () => {
    const mockRequest = {
      user: { id: uuidv4() },
    } as unknown as Request;

    const createNewsDto: CreateNewsDto = {
      title: 'some-title',
      description: 'some-description',
    };

    const expectedApiResponse = {
      id: uuidv4(),
      title: 'some-title',
      description: 'some-description',
    };

    mockApiNewsService.create.mockResolvedValue(expectedApiResponse);

    await controller.create(mockRequest, createNewsDto, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expectedApiResponse.id,
        title: expectedApiResponse.title,
        description: expectedApiResponse.description,
      }),
    );
  });

  it('update: post should be updated', async () => {
    const mockRequest = {
      user: { id: uuidv4() },
    } as unknown as Request;

    const updateNewsDto: UpdateNewsDto = {
      id: uuidv4(),
      title: 'some-title',
      description: 'some-description',
    };

    const expectedApiResponse = {
      id: updateNewsDto.id,
      title: updateNewsDto.title,
      description: updateNewsDto.description,
    };

    mockApiNewsService.update.mockResolvedValue(expectedApiResponse);

    await controller.update(mockRequest, updateNewsDto, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expectedApiResponse.id,
        title: expectedApiResponse.title,
        description: expectedApiResponse.description,
      }),
    );
  });

  it('get: get all news', async () => {
    const expectedApiResponse: NewsDTO[] = [];

    mockApiNewsService.getAll();

    await controller.get(mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining(expectedApiResponse),
    );
  });

  it('delete: post should be deleted', async () => {
    const mockRequest = {
      user: { id: uuidv4() },
    } as unknown as Request;

    const deleteNewsDto: DeleteNewsDto = {
      id: uuidv4(),
    };

    const expectedApiResponse = {
      id: deleteNewsDto.id,
    };

    mockApiNewsService.delete.mockResolvedValue(expectedApiResponse);

    await controller.delete(mockRequest, deleteNewsDto, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining(expectedApiResponse),
    );
  });
});
