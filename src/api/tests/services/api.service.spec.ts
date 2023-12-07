import { Test, TestingModule } from '@nestjs/testing';
import { ApiService } from '../../api.service';
import { UserService } from '../../../user/user.service';
import { ApiTokenService } from '../../api-token.service';
import { generateRandomEmail } from '../helpers/randomEmail';
import { uuidv4 } from '../helpers/uuid';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordHashHelper } from '../../helpers/hash.helper';

describe('ApiService', () => {
  let apiService: ApiService;
  let userService: jest.Mocked<UserService>;
  let apiTokenService: jest.Mocked<ApiTokenService>;
  const randomEmail = generateRandomEmail();
  const uuid = uuidv4();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiService,
        {
          provide: UserService,
          useValue: { findUserByEmail: jest.fn(), createUser: jest.fn() },
        },
        {
          provide: ApiTokenService,
          useValue: {
            signJwtToken: jest.fn(),
            createRefreshToken: jest.fn(),
            updateRefreshToken: jest.fn(),
            decodeRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    apiService = module.get<ApiService>(ApiService);
    userService = module.get<UserService>(
      UserService,
    ) as jest.Mocked<UserService>;
    apiTokenService = module.get<ApiTokenService>(
      ApiTokenService,
    ) as jest.Mocked<ApiTokenService>;
  });

  it('should be defined', () => {
    expect(apiService).toBeDefined();
  });

  describe('signup', () => {
    it('it should return registered userId and tokens', async () => {
      const signupDto = {
        email: randomEmail,
        password: 'password123',
      };

      userService.findUserByEmail.mockResolvedValue(null);

      const hashedPassword =
        await PasswordHashHelper.generateHash('password123');

      userService.createUser.mockResolvedValue({
        id: uuid,
        email: signupDto.email,
        password: hashedPassword,
        news: null,
      });
      apiTokenService.signJwtToken.mockReturnValue('accessToken');
      apiTokenService.createRefreshToken.mockResolvedValue('refreshToken');

      const result = await apiService.signup(signupDto);

      expect(result).toEqual({
        id: uuid,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
    });

    it('should throw ConflictException if the user already exists', async () => {
      const signupDto = {
        email: randomEmail,
        password: 'password123',
      };

      userService.findUserByEmail.mockResolvedValue({
        id: uuid,
        email: signupDto.email,
        password: null,
        news: null,
      });

      await expect(apiService.signup(signupDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException if createUser fails', async () => {
      const signupDto = {
        email: randomEmail,
        password: 'password123',
      };

      userService.findUserByEmail.mockResolvedValue(null);
      userService.createUser.mockResolvedValue(null);

      await expect(apiService.signup(signupDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('signin', () => {
    it('user should be logged in', async () => {
      const signinDto = {
        email: randomEmail,
        password: 'password123',
      };

      const hashedPassword = await PasswordHashHelper.generateHash(
        signinDto.password,
      );

      userService.findUserByEmail.mockResolvedValue({
        id: uuid,
        email: signinDto.email,
        password: hashedPassword,
        news: null,
      });
      apiTokenService.signJwtToken.mockReturnValue('accessToken');
      apiTokenService.updateRefreshToken.mockReturnValue(
        Promise.resolve('refreshToken'),
      );

      const result = await apiService.signin(signinDto);

      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
    });

    it('should throw UnauthorizedException if email or password is missing', async () => {
      const invalidSigninDto = {
        email: null,
        password: 'password123',
      };

      await expect(apiService.signin(invalidSigninDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const signinDto = {
        email: randomEmail,
        password: 'password123',
      };

      userService.findUserByEmail.mockResolvedValue(null);

      await expect(apiService.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const signinDto = {
        email: randomEmail,
        password: 'incorrectPassword',
      };

      const hashedPassword =
        await PasswordHashHelper.generateHash('correctPassword');

      userService.findUserByEmail.mockResolvedValue({
        id: uuid,
        email: signinDto.email,
        password: hashedPassword,
        news: [],
      });

      await expect(apiService.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw BadRequestException if token creation fails', async () => {
      const signinDto = {
        email: randomEmail,
        password: 'password123',
      };

      const hashedPassword =
        await PasswordHashHelper.generateHash('password123');

      userService.findUserByEmail.mockResolvedValue({
        id: uuid,
        email: signinDto.email,
        password: hashedPassword,
        news: [],
      });

      apiTokenService.signJwtToken.mockReturnValue('accessToken');
      apiTokenService.updateRefreshToken.mockResolvedValue(null);

      await expect(apiService.signin(signinDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('refresh token', () => {
    it('should validate and return new tokens', async () => {
      const mockRefreshToken = 'mockRefreshToken';
      const mockDecodedToken = {
        id: uuid,
        email: randomEmail,
      };

      apiTokenService.decodeRefreshToken.mockReturnValue(mockDecodedToken);
      apiTokenService.signJwtToken.mockReturnValue('newAccessToken');
      apiTokenService.updateRefreshToken.mockReturnValue(
        Promise.resolve('newRefreshToken'),
      );

      const result =
        await apiService.validateRefreshFromRequest(mockRefreshToken);

      expect(result).toEqual({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken',
      });

      expect(apiTokenService.decodeRefreshToken).toHaveBeenCalledWith(
        mockRefreshToken,
      );
      expect(apiTokenService.signJwtToken).toHaveBeenCalledWith(
        mockDecodedToken.id,
      );
      expect(apiTokenService.updateRefreshToken).toHaveBeenCalledWith(
        mockDecodedToken.id,
        mockDecodedToken.email,
      );
    });

    it('should throw UnauthorizedException if decoding refresh token fails', async () => {
      apiTokenService.decodeRefreshToken.mockReturnValue(null);

      await expect(
        apiService.validateRefreshFromRequest('invalidToken'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if updating refresh token fails', async () => {
      apiTokenService.decodeRefreshToken.mockReturnValue({
        id: 'userId',
        email: 'user@example.com',
      });
      apiTokenService.updateRefreshToken.mockResolvedValue(null);

      await expect(
        apiService.validateRefreshFromRequest('validToken'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validate user', () => {
    it('should return true if user exists', async () => {
      const mockEmail = 'user@example.com';

      userService.findUserByEmail.mockResolvedValue({
        id: 'userId',
        email: mockEmail,
        password: 'hashedPassword',
        news: [],
      });

      const result = await apiService.validateUser(mockEmail);

      expect(result).toBe(true);
      expect(userService.findUserByEmail).toHaveBeenCalledWith(mockEmail);
    });

    it('should return false if user does not exist', async () => {
      const mockEmail = 'nonexistent@example.com';

      userService.findUserByEmail.mockResolvedValue(null);

      const result = await apiService.validateUser(mockEmail);

      expect(result).toBe(false);
      expect(userService.findUserByEmail).toHaveBeenCalledWith(mockEmail);
    });

    it('should throw UnauthorizedException if finding user fails', async () => {
      const mockEmail = 'user@example.com';

      userService.findUserByEmail.mockRejectedValue(
        new UnauthorizedException('Unauthorized'),
      );

      await expect(apiService.validateUser(mockEmail)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userService.findUserByEmail).toHaveBeenCalledWith(mockEmail);
    });
  });
});
