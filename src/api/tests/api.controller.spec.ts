import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from '../api.controller';
import { ApiService } from '../api.service';
import { Request, Response } from 'express';
import { uuidv4 } from './helpers/uuid.test';
import { LocalStrategyService } from '../strategies/local-strategy.service';
import { JwtStrategyService } from '../strategies/jwt-strategy.service';
import { RefreshStrategyService } from '../strategies/refresh-strategy.service';

describe('ApiController', () => {
  let controller: ApiController;
  let mockApiService: jest.Mocked<ApiService>;
  let mockResponse: jest.Mocked<Response>;

  beforeEach(async () => {
    mockApiService = {
      signup: jest.fn(),
      signin: jest.fn(),
      refresh: jest.fn(),
      validateRefreshFromRequest: jest.fn(),
      getUser: jest.fn(),
    } as unknown as jest.Mocked<ApiService>;

    mockResponse = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as jest.Mocked<Response>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        {
          provide: JwtStrategyService,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: LocalStrategyService,
          useValue: jest.fn().mockImplementation(() => true),
        },
        {
          provide: RefreshStrategyService,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    }).compile();

    controller = module.get<ApiController>(ApiController);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signup: user should be created', async () => {
    const signupDto = { email: 'duck@duck.com', password: 'Duckgo123!' };
    const expectedApiResponse = {
      id: uuidv4(),
      accessToken: 'some-access-token',
      refreshToken: 'some-refresh-token',
    };

    mockApiService.signup.mockResolvedValue(expectedApiResponse);

    await controller.signup(signupDto, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: expectedApiResponse.id }),
    );

    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'accessToken',
      expectedApiResponse.accessToken,
      { httpOnly: true },
    );

    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'refreshToken',
      expectedApiResponse.refreshToken,
      { httpOnly: true },
    );
  });

  it('signin: user should be logged in', async () => {
    const signinDto = { email: 'duck@duck.com', password: 'Duckgo123!' };
    const expectedApiResponse = {
      accessToken: 'some-access-token',
      refreshToken: 'some-refresh-token',
    };

    mockApiService.signin.mockResolvedValue(expectedApiResponse);

    await controller.signin(signinDto, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }),
    );
  });

  it('refresh: token should be updated', async () => {
    const mockRequest = {
      cookies: { refreshToken: 'old-refresh-token' },
    } as Request;

    const expectedTokens = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    mockApiService.validateRefreshFromRequest.mockResolvedValue(expectedTokens);

    await controller.refresh(mockRequest, mockResponse);

    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'accessToken',
      expectedTokens.accessToken,
      { httpOnly: true },
    );

    expect(mockResponse.cookie).toHaveBeenCalledWith(
      'refreshToken',
      expectedTokens.refreshToken,
      { httpOnly: true },
    );

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining(expectedTokens),
    );
  });

  it('user: user should be defined', async () => {
    const mockRequest = {
      user: { id: uuidv4() },
    };

    await controller.getUser(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining(mockRequest.user),
    );
  });
});
