import { HttpStatus } from '@nestjs/common';
import { SignupDto } from '../src/api/AuthDto/signup.dto';
import * as request from 'supertest';
import { CreateNewsDto } from '../src/api/NewsDto/create-news.dto';
import { generateRandomEmail } from './helpers/randomString';
import { UpdateNewsDto } from 'src/api/NewsDto/update-news.dto';
import { DeleteNewsDto } from 'src/api/NewsDto/delete.dto';

describe('ApiNewsController (e2e)', () => {
  const authUrl = `http://localhost:5001/auth/`;
  const newsUrl = `http://localhost:5001/news/`;

  let tokens: { accessToken: string; refreshToken: string };
  let postId: string;

  const mockUser: SignupDto = {
    email: generateRandomEmail(),
    password: 'Password123!',
  };

  const mockPost: CreateNewsDto = {
    title: 'some-title',
    description: 'some-description',
  };

  const updatePost: UpdateNewsDto = {
    id: postId,
    title: 'some-new-title',
    description: 'some-new-description',
  };

  const deletePost: DeleteNewsDto = {
    id: postId,
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

  describe('create post (POST)', () => {
    it('it should create users post', () => {
      return request(newsUrl)
        .post('create')
        .set('Accept', 'application/json')
        .set('Cookie', [`accessToken=${tokens.accessToken}`])
        .send(mockPost)
        .expect((response: request.Response) => {
          const { id, title, description } = response.body;

          expect(id).toBeTruthy();
          expect(title).toBeTruthy();
          expect(description).toBeTruthy();

          postId = id;
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('get posts (GET)', () => {
    it('it should get all posts post', () => {
      return request(newsUrl)
        .get('get')
        .set('Accept', 'application/json')
        .expect(HttpStatus.OK);
    });
  });

  describe('update post (PUT)', () => {
    it('it should update users post', () => {
      return request(newsUrl)
        .put('update')
        .set('Accept', 'application/json')
        .set('Cookie', [`accessToken=${tokens.accessToken}`])
        .send(updatePost)
        .expect((response: request.Response) => {
          const { id } = response.body;

          expect(id).toBeTruthy();
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('delete post (DELETE)', () => {
    it('it should delete users post', () => {
      return request(newsUrl)
        .delete('delete')
        .set('Accept', 'application/json')
        .set('Cookie', [`accessToken=${tokens.accessToken}`])
        .send(deletePost)
        .expect(HttpStatus.OK);
    });
  });
});
