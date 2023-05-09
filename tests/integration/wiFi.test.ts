
import app, { init } from "../../src/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { createUser } from "../factories/users-factory";
import { cleanDb, generateToken } from "../helpers";
import { createWiFi } from "../factories/wiFi-factory";
import { cryptographyUtil } from "../../src/utils/cryptographyUtil-utils";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /Wi-fi', () => {
  it('should respond with status 401 if no token', async () => {
    const response = await server.get('/wi-fi');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/wi-fi').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if dont have session for token', async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, "top_secret");

    const response = await server.get('/wi-fi').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user dont have Wi-fi', async () => {
      const user = await createUser();
      const token = await generateToken(user);
      const response = await server.get('/wi-fi').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and show the Wi-fi', async () => {
      const user = await createUser();
      const token = await generateToken(user);

      const firstWiFi = await createWiFi(user);
      const secondWiFi = await createWiFi(user);

      const response = await server.get('/wi-fi').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual([
        {
          ...firstWiFi,
          password: cryptographyUtil.decrypt(firstWiFi.password),
        },
        {
          ...secondWiFi,
          password: cryptographyUtil.decrypt(secondWiFi.password),
        },
      ]);
    });
  });
});

describe('GET /wi-fi/:wiFiId', () => {
  it('should respond with status 401 if no token', async () => {
    const response = await server.get('/wi-fi');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/wi-fi').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if dont have session for token', async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, "top_secret");
    const response = await server.get('/wi-fi').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user dont have Wi-fi', async () => {
      const user = await createUser();
      const token = await generateToken(user);
      const response = await server.get('/wi-fi').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when selected Wi-fi is not from user', async () => {
      const firstUser = await createUser();
      const token = await generateToken(firstUser);

      const secondUser = await createUser();

      const wiFi = await createWiFi(secondUser);
      const response = await server.get(`/networks/${wiFi.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and show the network', async () => {
      const user = await createUser();
      const token = await generateToken(user);

      const wiFi = await createWiFi(user);

      const response = await server.get(`/wi-fi/${wiFi.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual({
        ...wiFi,
        password: cryptographyUtil.decrypt(wiFi.password),
      });
    });
  });
});

describe('POST /wi-fi', () => {
  const generateBody = () => ({
    title: faker.lorem.sentence(),
    network: faker.lorem.sentence(),
    password: faker.internet.password(),
  });

  it('should respond with status 401 if no token', async () => {
    const wiFi = generateBody();
    const response = await server.post('/wi-fi').send({ ...wiFi });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if token is not valid', async () => {
    const token = faker.lorem.word();
    const wiFi = generateBody();

    const response = await server.post('/wi-fi').send({ ...wiFi }).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if dont have session for token', async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, "top_secret");
    const wiFi = generateBody();

    const response = await server.post('/wi-fi').send({ ...wiFi }).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 409 when two Wi-fi with the same title.', async () => {
    const user = await createUser();
    const token = await generateToken(user);
    const firstWiFi = generateBody();

    const secondWiFi = await createWiFi(user);

    firstWiFi.title = secondWiFi.title;

    const response = await server.post(`/wi-fi`).send({ ...firstWiFi }).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should respond with status 201 and wiFiId when the user send the right data.', async () => {
    const user = await createUser();
    const token = await generateToken(user);
    const wiFi = generateBody();

    const response = await server.post(`/wi-fi`).send({ ...wiFi }).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CREATED);

    expect(response.body).toEqual({
      wiFiId: expect.any(Number),
    });
  });
});

describe('DELETE /wi-fi/:wiFiId', () => {
  it('should respond with status 401 if no token', async () => {
    const wiFi = await createWiFi();
    const response = await server.delete(`/wi-fi/${wiFi.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if token is not valid', async () => {
    const token = faker.lorem.word();
    const wiFi = await createWiFi();

    const response = await server.delete(`/wi-fi/${wiFi.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if dont have session for token', async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, "top_secret");
    const wiFi = await createWiFi();

    const response = await server.delete(`/wi-fi/${wiFi.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if nonexists Wi-fi', async () => {
    const user = await createUser();
    const token = await generateToken(user);

    const response = await server.delete(`/wi-fi/1`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if exist Wi-fi exists, but is not from user', async () => {
    const user = await createUser();
    const token = await generateToken(user);
    const wiFi = await createWiFi();

    const response = await server.delete(`/wi-fi/${wiFi.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 202 when the user send the correct data.', async () => {
    const user = await createUser();
    const token = await generateToken(user);
    const wiFi = await createWiFi(user);

    const response = await server.delete(`/wi-fi/${wiFi.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.ACCEPTED);
  });
});