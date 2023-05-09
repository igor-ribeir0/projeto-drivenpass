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
const users_factory_1 = require("../factories/users-factory");
const helpers_1 = require("../helpers");
const wiFi_factory_1 = require("../factories/wiFi-factory");
const cryptographyUtil_utils_1 = require("../../src/utils/cryptographyUtil-utils");
beforeAll(async () => {
    await (0, app_1.init)();
    await (0, helpers_1.cleanDb)();
});
const server = (0, supertest_1.default)(app_1.default);
describe('GET /Wi-fi', () => {
    it('should respond with status 401 if no token', async () => {
        const response = await server.get('/wi-fi');
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if token is not valid', async () => {
        const token = faker_1.faker.lorem.word();
        const response = await server.get('/wi-fi').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if dont have session for token', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, "top_secret");
        const response = await server.get('/wi-fi').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    describe('when token is valid', () => {
        it('should respond with status 404 when user dont have Wi-fi', async () => {
            const user = await (0, users_factory_1.createUser)();
            const token = await (0, helpers_1.generateToken)(user);
            const response = await server.get('/wi-fi').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.NOT_FOUND);
        });
        it('should respond with status 200 and show the Wi-fi', async () => {
            const user = await (0, users_factory_1.createUser)();
            const token = await (0, helpers_1.generateToken)(user);
            const firstWiFi = await (0, wiFi_factory_1.createWiFi)(user);
            const secondWiFi = await (0, wiFi_factory_1.createWiFi)(user);
            const response = await server.get('/wi-fi').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.OK);
            expect(response.body).toEqual([
                {
                    ...firstWiFi,
                    password: cryptographyUtil_utils_1.cryptographyUtil.decrypt(firstWiFi.password),
                },
                {
                    ...secondWiFi,
                    password: cryptographyUtil_utils_1.cryptographyUtil.decrypt(secondWiFi.password),
                },
            ]);
        });
    });
});
describe('GET /wi-fi/:wiFiId', () => {
    it('should respond with status 401 if no token', async () => {
        const response = await server.get('/wi-fi');
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if token is not valid', async () => {
        const token = faker_1.faker.lorem.word();
        const response = await server.get('/networks').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if dont have session for token', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, "top_secret");
        const response = await server.get('/wi-fi').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    describe('when token is valid', () => {
        it('should respond with status 404 when user dont have Wi-fi', async () => {
            const user = await (0, users_factory_1.createUser)();
            const token = await (0, helpers_1.generateToken)(user);
            const response = await server.get('/wi-fi').set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.NOT_FOUND);
        });
        it('should respond with status 404 when selected Wi-fi is not from user', async () => {
            const firstUser = await (0, users_factory_1.createUser)();
            const token = await (0, helpers_1.generateToken)(firstUser);
            const secondUser = await (0, users_factory_1.createUser)();
            const wiFi = await (0, wiFi_factory_1.createWiFi)(secondUser);
            const response = await server.get(`/networks/${wiFi.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.NOT_FOUND);
        });
        it('should respond with status 200 and show the network', async () => {
            const user = await (0, users_factory_1.createUser)();
            const token = await (0, helpers_1.generateToken)(user);
            const wiFi = await (0, wiFi_factory_1.createWiFi)(user);
            const response = await server.get(`/networks/${wiFi.id}`).set('Authorization', `Bearer ${token}`);
            expect(response.status).toEqual(http_status_1.default.OK);
            expect(response.body).toEqual({
                ...wiFi,
                password: cryptographyUtil_utils_1.cryptographyUtil.decrypt(wiFi.password),
            });
        });
    });
});
describe('POST /wi-fi', () => {
    const generateBody = () => ({
        title: faker_1.faker.lorem.sentence(),
        network: faker_1.faker.lorem.sentence(),
        password: faker_1.faker.internet.password(),
    });
    it('should respond with status 401 if no token', async () => {
        const wiFi = generateBody();
        const response = await server.post('/wi-fi').send({ ...wiFi });
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if token is not valid', async () => {
        const token = faker_1.faker.lorem.word();
        const wiFi = generateBody();
        const response = await server.post('/wi-fi').send({ ...wiFi }).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if dont have session for token', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, "top_secret");
        const wiFi = generateBody();
        const response = await server.post('/wi-fi').send({ ...wiFi }).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 409 when two Wi-fi with the same title.', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = await (0, helpers_1.generateToken)(user);
        const firstWiFi = generateBody();
        const secondWiFi = await (0, wiFi_factory_1.createWiFi)(user);
        firstWiFi.title = secondWiFi.title;
        const response = await server.post(`/wi-fi`).send({ ...firstWiFi }).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.CONFLICT);
    });
    it('should respond with status 201 and networkId when the user send the right data.', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = await (0, helpers_1.generateToken)(user);
        const wiFi = generateBody();
        const response = await server.post(`/networks`).send({ ...wiFi }).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.CREATED);
        expect(response.body).toEqual({
            wiFiId: expect.any(Number),
        });
    });
});
describe('DELETE /wi-fi/:wiFiId', () => {
    it('should respond with status 401 if no token', async () => {
        const wiFi = await (0, wiFi_factory_1.createWiFi)();
        const response = await server.delete(`/wi-fi/${wiFi.id}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if token is not valid', async () => {
        const token = faker_1.faker.lorem.word();
        const wiFi = await (0, wiFi_factory_1.createWiFi)();
        const response = await server.delete(`/wi-fi/${wiFi.id}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 401 if dont have session for token', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, "top_secret");
        const wiFi = await (0, wiFi_factory_1.createWiFi)();
        const response = await server.delete(`/wi-fi/${wiFi.id}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
    });
    it('should respond with status 404 if nonexists Wi-fi', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = await (0, helpers_1.generateToken)(user);
        const response = await server.delete(`/wi-fi/1`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.NOT_FOUND);
    });
    it('should respond with status 404 if exist Wi-fi exists, but is not from user', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = await (0, helpers_1.generateToken)(user);
        const wiFi = await (0, wiFi_factory_1.createWiFi)();
        const response = await server.delete(`/wi-fi/${wiFi.id}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.NOT_FOUND);
    });
    it('should respond with status 202 when the user send the correct data.', async () => {
        const user = await (0, users_factory_1.createUser)();
        const token = await (0, helpers_1.generateToken)(user);
        const wiFi = await (0, wiFi_factory_1.createWiFi)(user);
        const response = await server.delete(`/networks/${wiFi.id}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(http_status_1.default.ACCEPTED);
    });
});
