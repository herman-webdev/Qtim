import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { generateRandomEmail } from './helpers/randomString';

describe('ApiNewsController (e2e)', () => {
  const authUrl = `http://localhost:5001/auth/`;
  const newsUrl = `http://localhost:5001/news/`;

  let tokens: { accessToken: string; refreshToken: string };
  let postId: string;

  const mockUser = {
    email: generateRandomEmail(),
    password: 'Password123!',
  };

  const mockPost = {
    title: 'some-title',
    description: 'some-description',
  };

  const updatePost = {
    id: postId,
    title: 'some-new-title',
    description: 'some-new-description',
  };

  const deletePost = {
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
