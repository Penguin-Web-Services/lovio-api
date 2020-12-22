import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('registration and login', () => {
    it('/register', async () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          email: 'test@test.com',
          pw: 'asdfasdf',
        })
        .expect(201);
    });

    it('/login', async () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({
          email: 'test@test.com',
          pw: 'asdfasdf',
        })
        .expect(200);
    });

    it('user query', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .send({
          variables: {},
          query: '{user(id: 1){email}}',
        })
        .expect(200);
    });
  });
});
