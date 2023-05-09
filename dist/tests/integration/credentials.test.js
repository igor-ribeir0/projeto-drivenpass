"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importStar(require("../../src/app"));
const faker_1 = require("@faker-js/faker");
const http_status_1 = __importDefault(require("http-status"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helpers_1 = require("../helpers");
const users_factory_1 = require("../factories/users-factory");
const credentials_factory_1 = require("../factories/credentials-factory");
const cryptographyUtil_utils_1 = require("../../src/utils/cryptographyUtil-utils");
beforeAll(async () => {
    await (0, app_1.init)();
    await (0, helpers_1.cleanDb)();
});
const server = (0, supertest_1.default)(app_1.default);
describe('GET /credentials', () => {
    it('should respond with status 401 if no token', async () => {
        const response = await server.get('/credentials');
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if token is not valid', async () => {
        const token = faker_1.faker.lorem.word();
        const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for token', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, "top_secret");
        const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    describe('when token is valid', () => {
        it('should respond with status 404 when user dont have credentials', async () => {
            const user = await (0, users_factory_1.createUser)();
            const token = await (0, helpers_1.generateToken)(user);
            const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.NOT_FOUND);
        });
        it('should respond with status 200 and the credentials list', async () => {
            const user = await (0, users_factory_1.createUser)();
            const token = await (0, helpers_1.generateToken)(user);
            const firstCredential = await (0, credentials_factory_1.createCredential)(user);
            const secondCredential = await (0, credentials_factory_1.createCredential)(user);
            const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.OK);
            expect(response.body).toEqual([
                {
                    ...firstCredential,
                    password: cryptographyUtil_utils_1.cryptographyUtil.decrypt(firstCredential.password),
                },
                {
                    ...secondCredential,
                    password: cryptographyUtil_utils_1.cryptographyUtil.decrypt(secondCredential.password),
                },
            ]);
        });
    });
});
describe('GET /credentials/:credentialId', () => {
    it('should respond with status 401 if no token', async () => {
        const response = await server.get('/credentials');
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if token is not valid', async () => {
        const token = faker_1.faker.lorem.word();
        const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for token', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, "top_secret");
        const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    describe('when token is valid', () => {
        it('should respond with status 404 when user dont have credentials', async () => {
            const user = await (0, users_factory_1.createUser)();
            const token = await (0, helpers_1.generateToken)(user);
            const response = await server.get('/credentials').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.NOT_FOUND);
        });
        it('should respond with status 404 when is not user credential', async () => {
            const firstUser = await (0, users_factory_1.createUser)();
            const token = await (0, helpers_1.generateToken)(firstUser);
            const secondUser = await (0, users_factory_1.createUser)();
            const credential = await (0, credentials_factory_1.createCredential)(secondUser);
            const response = await server.get(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.NOT_FOUND);
        });
        it('should respond with status 200 and the requested credential', async () => {
            const user = await (0, users_factory_1.createUser)();
            const token = await (0, helpers_1.generateToken)(user);
            const credential = await (0, credentials_factory_1.createCredential)(user);
            const response = await server.get(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.OK);
            expect(response.body).toEqual({
                ...credential,
                password: cryptographyUtil_utils_1.cryptographyUtil.decrypt(credential.password),
            });
        });
    });
});
describe('POST /credentials', () => {
    const generateBody = () => ({
        title: faker_1.faker.lorem.sentence(),
        url: faker_1.faker.internet.url(),
        username: faker_1.faker.internet.userName(),
        password: faker_1.faker.internet.password(),
    });
    it('should respond with status 401 if no token', async () => {
        const credential = generateBody();
        const response = await server.post('/credentials').send({ ...credential });
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if token is not valid', async () => {
        const credential = generateBody();
        const token = faker_1.faker.lorem.word();
        const response = await server.post('/credentials').send({ ...credential }).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session for token', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, "top_secret");
        const credential = generateBody();
        const response = await server.post('/credentials').send({ ...credential }).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 409 with credential with the same title.', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = await (0, helpers_1.generateToken)(user);
        const firstCredential = generateBody();
        const secondCredential = await (0, credentials_factory_1.createCredential)(user);
        firstCredential.title = secondCredential.title;
        const response = await server.post(`/credentials`).send({ ...firstCredential }).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.CONFLICT);
    });
    it('should respond with status 201 and credentialId with user sending the correct data', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = await (0, helpers_1.generateToken)(user);
        const credential = generateBody();
        const response = await server.post(`/credentials`).send({ ...credential }).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.CREATED);
        expect(response.body).toEqual({
            credentialId: expect.any(Number),
        });
    });
});
describe('DELETE /credentials/:credentialId', () => {
    it('should respond with status 401 if no token', async () => {
        const credential = await (0, credentials_factory_1.createCredential)();
        const response = await server.delete(`/credentials/${credential.id}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if token is not valid', async () => {
        const credential = await (0, credentials_factory_1.createCredential)();
        const token = faker_1.faker.lorem.word();
        const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if there is no session token', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, "top_secret");
        const credential = await (0, credentials_factory_1.createCredential)();
        const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 404 if nonexistent credential', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = await (0, helpers_1.generateToken)(user);
        const response = await server.delete(`/credentials/1`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.NOT_FOUND);
    });
    it('should respond with status 404 if the credential exists, but is not user credential', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = await (0, helpers_1.generateToken)(user);
        const credential = await (0, credentials_factory_1.createCredential)();
        const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.NOT_FOUND);
    });
    it('should respond with status 202 when the user sending the correct data', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = await (0, helpers_1.generateToken)(user);
        const credential = await (0, credentials_factory_1.createCredential)(user);
        const response = await server.delete(`/credentials/${credential.id}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.ACCEPTED);
    });
});
