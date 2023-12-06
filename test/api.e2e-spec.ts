import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { generateRandomEmail } from './helpers/randomString';

describe('ApiController (e2e)', () => {
  const authUrl = `http://localhost:5001/auth/`;

  let tokens: { accessToken: string; refreshToken: string };

  const mockUser = {
    email: generateRandomEmail(),
    password: 'Password123!',
  };

  beforeAll(async () => {
    const signupResponse = await request(authUrl)
      .post('signup')
      .set('Accept', 'application/json')
      .send(mockUser)
      .expect(HttpStatus.OK);

    tokens = {
      accessToken: signupResponse.body.accessToken,
      refreshToken: signupResponse.body.refreshToken,
    };
  });

  describe('signin (POST)', () => {
    it('it should log in a user', () => {
      return request(authUrl)
        .post('signin')
        .set('Accept', 'application/json')
        .send(mockUser)
        .expect((response: request.Response) => {
          const { accessToken, refreshToken } = response.body;

          expect(accessToken).toBeTruthy();
          expect(refreshToken).toBeTruthy();

          tokens = { accessToken, refreshToken };
        });
    });
  });

  describe('refresh (GET)', () => {
    it('it should update refresh token', () => {
      return request(authUrl)
        .get('refresh')
        .set('Accept', 'application/json')
        .set('Cookie', [`refreshToken=${tokens.refreshToken}`])
        .expect((response: request.Response) => {
          const { accessToken, refreshToken } = response.body;

          expect(accessToken).toBeTruthy();
          expect(refreshToken).toBeTruthy();
        });
    });
  });

  describe('get (GET)', () => {
    it('it should get userId', () => {
      return request(authUrl)
        .get('user')
        .set('Accept', 'application/json')
        .set('Cookie', [`accessToken=${tokens.accessToken}`])
        .expect((response: request.Response) => {
          const { id } = response.body;

          expect(id).toBeTruthy();
        })
        .expect(HttpStatus.OK);
    });
  });
});
