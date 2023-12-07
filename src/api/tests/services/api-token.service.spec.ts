import { Test, TestingModule } from '@nestjs/testing';
import { ApiTokenService } from '../../api-token.service';
import { ApiService } from '../../api.service';
import { TokenService } from '../../../user/token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { uuidv4 } from '../helpers/uuid';
import { generateRandomEmail } from '../helpers/randomEmail';
import { CalculateDateHelper } from '../../helpers/date.helper';

describe('ApiTokenService', () => {
  let apiTokenService: ApiTokenService;
  let jwtService: jest.Mocked<JwtService>;
  const uuid = uuidv4();
  const randomEmail = generateRandomEmail();

  process.env.REFRESH_TOKEN_EXPIRATION = '3';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret-key' })],
      providers: [
        ApiTokenService,
        {
          provide: TokenService,
          useValue: {
            findRefreshToken: jest.fn(),
            saveRefreshToken: jest.fn(),
            updateRefreshToken: jest.fn(),
          },
        },
        {
          provide: ApiService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
            validateRefreshFromRequest: jest.fn(),
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    apiTokenService = module.get<ApiTokenService>(ApiTokenService);
    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;
  });

  it('should be defined', () => {
    expect(apiTokenService).toBeDefined();
  });

  describe('create JWT', () => {
    it('should sign a JWT token with the provided id', () => {
      const user = {
        id: uuid,
        email: randomEmail,
      };
      const expectedPayload = { id: user.id };
      const expectedToken = 'mockedJwtToken';

      jest.spyOn(jwtService, 'sign').mockReturnValue(expectedToken);
      const result = apiTokenService.signJwtToken(user.id);

      expect(result).toBe(expectedToken);
      expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload);
    });
  });

  describe('decode refresh', () => {
    it('should decode a refresh token and return id and email', async () => {
      const user = {
        id: uuid,
        email: randomEmail,
      };
      const refreshToken = await apiTokenService.createRefreshToken(
        user.id,
        user.email,
      );

      const expectedPayload = { id: user.id, email: user.email };
      jest.spyOn(jwtService, 'decode').mockReturnValue(expectedPayload);

      const result = apiTokenService.decodeRefreshToken(refreshToken);

      expect(result).toEqual(expectedPayload);
      expect(jwtService.decode).toHaveBeenCalledWith(refreshToken);
    });
  });

  describe('create refresh', () => {
    it('should create a refresh token', async () => {
      const user = {
        id: uuid,
        email: randomEmail,
      };

      jest
        .spyOn(CalculateDateHelper, 'getCalculatedDate')
        .mockReturnValue(new Date());

      const expectedToken = 'mockedRefreshToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(expectedToken);

      const result = await apiTokenService.createRefreshToken(
        user.id,
        user.email,
      );

      expect(result).toBe(expectedToken);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: user.id, email: user.email },
        { expiresIn: '3d' },
      );
    });
  });

  describe('update refresh', () => {
    it('should update a refresh token', async () => {
      const user = {
        id: uuid,
        email: randomEmail,
      };

      jest
        .spyOn(CalculateDateHelper, 'getCalculatedDate')
        .mockReturnValue(new Date());

      const expectedToken = 'mockedRefreshToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(expectedToken);

      const result = await apiTokenService.updateRefreshToken(
        user.id,
        user.email,
      );

      expect(result).toBe(expectedToken);
      expect(jwtService.sign).toHaveBeenCalledWith(
        { id: user.id, email: user.email },
        { expiresIn: '3d' },
      );
    });
  });
});
