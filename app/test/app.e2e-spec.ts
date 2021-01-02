import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as faker from 'faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  afterAll(() => {
    app.close();
  });

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
    let email = faker.internet.email();
    let email2 = faker.internet.email();
    let token;
    let token2;
    let event;

    it('/register', async () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          email,
          pw: 'asdfasdf',
        })
        .expect(201);
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

    it('user can login with graphql', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          variables: {},
          query: `mutation{ login(email: "${email}", pw: "asdfasdf")}`,
        })
        .expect(200);

      token = res.body.data.login;

      const me = await request(app.getHttpServer())
        .post('/graphql')
        .set({ authorization: 'Bearer ' + token })
        .send({
          variables: {},
          query: `query{ me { email } }`,
        })
        .expect(200)
        .expect((res) => res.body.data.me.email === email);

      const bad = await request(app.getHttpServer())
        .post('/graphql')
        .set({ authorization: 'Bearer b' + token })
        .send({
          variables: {},
          query: `query{ me { email } }`,
        })
        .expect(200)
        .expect((res) => res.body.errors.length > 0);
    });

    it('/register 2', async () => {
      await request(app.getHttpServer())
        .post('/register')
        .send({
          email: email2,
          pw: 'asdfasdf',
        })
        .expect(201);

      const res = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          variables: {},
          query: `mutation{ login(email: "${email2}", pw: "asdfasdf")}`,
        })
        .expect(200)
        .expect((res) => !res.body.errors);

      token2 = res.body.data.login;
    });

    it('user can create an event', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set({ authorization: 'Bearer ' + token })
        .send({
          variables: {},
          query: `mutation{ createEvent(data:{name: "test", type: "Public", active:true, startAt: 1000000, endAt:1000000}) {
    id, name
  } }`,
        })
        .expect(200)
        .expect((res) => !res.body.errors);

      event = res.body.data.createEvent;
    });

    it('another user can join an event', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set({ authorization: 'Bearer ' + token })
        .send({
          variables: {},
          query: `mutation{ joinEvent(eventId: ${event.id}) {
    name
  } }`,
        })
        .expect(200)
        .expect((res) => !res.body.errors);
    });
  });
});
