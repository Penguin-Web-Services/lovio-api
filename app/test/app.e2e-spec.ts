import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as faker from 'faker';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let email = faker.internet.email();
  let email2 = faker.internet.email();
  let user2;
  let token;
  let token2;
  let event;

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

      const resme = await request(app.getHttpServer())
        .post('/graphql')
        .set({ authorization: 'Bearer ' + token2 })
        .send({
          variables: {},
          query: `query{ me { id, email } }`,
        })
        .expect(200)
        .expect((res) => !res.body.errors);

      user2 = resme.body.data.me;
    });
  });

  describe('event', () => {
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
        .set({ authorization: 'Bearer ' + token2 })
        .send({
          variables: {},
          query: `mutation{ joinEvent(eventId: ${event.id}) {
    name
  } }`,
        })
        .expect(200)
        .expect((res) => !res.body.errors);
    });

    it('user can see all their events', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set({ authorization: 'Bearer ' + token2 })
        .send({
          variables: {},
          query: `query{ eventsByCurrentUser {
    name,
    userId
  } }`,
        })
        .expect(200)
        .expect((res) =>
          res.body.data.eventsByCurrentUser.every((e) => e.userId === user2.id),
        );
    });

    it('user can send an event asset', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set({ authorization: 'Bearer ' + token2 })
        .send({
          variables: {},
          query: `mutation{ eventAddAsset(data: { eventId: ${event.id}, type: "Photo", url: "https://avatars1.githubusercontent.com/u/1021110?s=60&v=4" }) {
    id, userId, eventId
  } }`,
        })
        .expect(200)
        .expect((res) => res.body.data.eventAddAsset.userId === user2.id);
    });

    it('get events with all assets', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set({ authorization: 'Bearer ' + token2 })
        .send({
          variables: {},
          query: `query{ event(eventId: ${event.id}) {
          id,
          assets {
            id, eventId, userId, url
          }
        } }`,
        })
        .expect(200)
        .expect((res) => res.body.data.event.id === event.id)
        .expect((res) => {
          return res.body.data.event.assets.every((a) => a.url);
        });
    });

    it('sets event as active', async () => {
      const res = await request(app.getHttpServer())
        .post('/graphql')
        .set({ authorization: 'Bearer ' + token2 })
        .send({
          variables: {},
          query: `mutation{ setActiveEvent(eventId: ${event.id}) {
          id, active
        } }`,
        })
        .expect(200)
        .expect((res) => {
          return res.body.data.setActiveEvent.active;
        });
    });
  });
});
