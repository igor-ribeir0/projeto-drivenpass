import app, { init } from "../../src/app";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import { cleanDb, generateToken } from "../helpers";
import { createUser } from "../factories/users-factory";
import { createCredential } from "../factories/credentials-factory";
import { cryptographyUtil } from "../../src/utils/cryptographyUtil-utils";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /credentials', () => {
  it('should respond with status 401 if no token', async () => {
    const response = await server.get('/credentials');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for token', async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, "top_secret");
    const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user dont have credentials', async () => {
      const user = await createUser();
      const token = await generateToken(user);
      const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and the credentials list', async () => {
      const user = await createUser();
      const token = await generateToken(user);

      const firstCredential = await createCredential(user);
      const secondCredential = await createCredential(user);

      const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual([
        {
          ...firstCredential,
          password: cryptographyUtil.decrypt(firstCredential.password),
        },
        {
          ...secondCredential,
          password: cryptographyUtil.decrypt(secondCredential.password),
        },
      ]);
    });
  });
});

describe('GET /credentials/:credentialId', () => {
  it('should respond with status 401 if no token', async () => {
    const response = await server.get('/credentials');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if token is not valid', async () => {
    const token = faker.lorem.word();
    const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for token', async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, "top_secret");
    const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user dont have credentials', async () => {
      const user = await createUser();
      const token = await generateToken(user);
      const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when is not user credential', async () => {
      const firstUser = await createUser();
      const token = await generateToken(firstUser);

      const secondUser = await createUser();

      const credential = await createCredential(secondUser);
      const response = await server.get(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and the requested credential', async () => {
      const user = await createUser();
      const token = await generateToken(user);

      const credential = await createCredential(user);

      const response = await server.get(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual({
        ...credential,
        password: cryptographyUtil.decrypt(credential.password),
      });
    });
  });
});

describe('POST /credentials', () => {
  const generateBody = () => ({
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
  });

  it('should respond with status 401 if no token', async () => {
    const credential = generateBody();
    const response = await server.post('/credentials').send({ ...credential });

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if token is not valid', async () => {
    const credential = generateBody();
    const token = faker.lorem.word();

    const response = await server.post('/credentials').send({ ...credential }).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for token', async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, "top_secret");
    const credential = generateBody();

    const response = await server.post('/credentials').send({ ...credential }).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 409 with credential with the same title.', async () => {
    const user = await createUser();
    const token = await generateToken(user);

    const firstCredential = generateBody();
    const secondCredential = await createCredential(user);

    firstCredential.title = secondCredential.title;

    const response = await server.post(`/credentials`).send({ ...firstCredential }).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CONFLICT);
  });

  it('should respond with status 201 and credentialId with user sending the correct data', async () => {
    const user = await createUser();
    const token = await generateToken(user);
    const credential = generateBody();

    const response = await server.post(`/credentials`).send({ ...credential }).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.CREATED);

    expect(response.body).toEqual({
      credentialId: expect.any(Number),
    });
  });
});

describe('DELETE /credentials/:credentialId', () => {
  it('should respond with status 401 if no token', async () => {
    const credential = await createCredential();
    const response = await server.delete(`/credentials/${credential.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if token is not valid', async () => {
    const credential = await createCredential();
    const token = faker.lorem.word();

    const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session token', async () => {
    const user = await createUser();
    const token = jwt.sign({ userId: user.id }, "top_secret");
    const credential = await createCredential();

    const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if nonexistent credential', async () => {
    const user = await createUser();
    const token = await generateToken(user);
    const response = await server.delete(`/credentials/1`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 404 if the credential exists, but is not user credential', async () => {
    const user = await createUser();
    const token = await generateToken(user);
    const credential = await createCredential();

    const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should respond with status 202 when the user sending the correct data', async () => {
    const user = await createUser();
    const token = await generateToken(user);
    const credential = await createCredential(user);

    const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.ACCEPTED);
  });
});