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
const faker_1 = require("@faker-js/faker");
const http_status_1 = __importDefault(require("http-status"));
const supertest_1 = __importDefault(require("supertest"));
const users_factory_1 = require("../factories/users-factory");
const helpers_1 = require("../helpers");
const errors_1 = require("../../src/services/users-service/errors");
const database_1 = require("../../src/config/database");
const app_1 = __importStar(require("../../src/app"));
beforeAll(async () => {
    await (0, app_1.init)();
    await (0, helpers_1.cleanDb)();
});
const server = (0, supertest_1.default)(app_1.default);
describe('POST /users/sign-up', () => {
    it('should respond with status 400 when body is not given', async () => {
        const response = await server.post('/users/sign-up');
        expect(response.status).toBe(http_status_1.default.BAD_REQUEST);
    });
    it('should respond with status 400 when body is not valid', async () => {
        const invalidBody = { [faker_1.faker.lorem.word()]: faker_1.faker.lorem.word() };
        const response = await server.post('/users/sign-up').send(invalidBody);
        expect(response.status).toBe(http_status_1.default.BAD_REQUEST);
    });
    describe('when body is valid', () => {
        const generateValidBody = () => ({
            email: faker_1.faker.internet.email(),
            password: faker_1.faker.internet.password(10),
        });
        it('should respond with status 409 when there is an user with given email', async () => {
            const body = generateValidBody();
            await (0, users_factory_1.createUser)(body);
            const response = await server.post('/users/sign-up').send(body);
            expect(response.status).toBe(http_status_1.default.CONFLICT);
            expect(response.body).toEqual((0, errors_1.duplicatedEmailError)());
        });
        it('should respond with status 201 and create user when given email is unique', async () => {
            const body = generateValidBody();
            const response = await server.post('/users/sign-up').send(body);
            expect(response.status).toBe(http_status_1.default.CREATED);
        });
        it('should not return user password on body', async () => {
            const body = generateValidBody();
            const response = await server.post('/users/sign-up').send(body);
            expect(response.body).not.toHaveProperty('password');
        });
        it('should save user on db', async () => {
            const body = generateValidBody();
            await server.post('/users/sign-up').send(body);
            const user = await database_1.prisma.user.findUnique({
                where: { email: body.email },
            });
            expect(user);
        });
    });
});
describe('POST /users/sign-in', () => {
    it('should respond with status 400 when body is not given', async () => {
        const response = await server.post('/users/sign-in');
        expect(response.status).toBe(http_status_1.default.BAD_REQUEST);
    });
    it('should respond with status 400 when body is not valid', async () => {
        const invalidBody = { [faker_1.faker.lorem.word()]: faker_1.faker.lorem.word() };
        const response = await server.post('/users/sign-in').send(invalidBody);
        expect(response.status).toBe(http_status_1.default.BAD_REQUEST);
    });
    describe('when body is valid', () => {
        const generateValidBody = (passwordLength = 10) => ({
            email: faker_1.faker.internet.email(),
            password: faker_1.faker.internet.password(passwordLength),
        });
        it('should respond with status 400 if the password has less than 10 characters', async () => {
            const body = generateValidBody(6);
            const response = await server.post('/users/sign-in').send(body);
            expect(response.status).toBe(http_status_1.default.BAD_REQUEST);
        });
        it('should respond with status 401 if there is no user for given email', async () => {
            const body = generateValidBody();
            const response = await server.post('/users/sign-in').send(body);
            expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
        });
        it('should respond with status 401 if there is a user for given email but password is not correct', async () => {
            const body = generateValidBody();
            await (0, users_factory_1.createUser)(body);
            const response = await server.post('/users/sign-in').send({
                ...body,
                password: faker_1.faker.lorem.word(10),
            });
            expect(response.status).toBe(http_status_1.default.UNAUTHORIZED);
        });
        describe('when credentials are valid', () => {
            it('should respond with status 200', async () => {
                const body = generateValidBody();
                await (0, users_factory_1.createUser)(body);
                const response = await server.post('/users/sign-in').send(body);
                expect(response.status).toBe(http_status_1.default.OK);
            });
            it('should respond with user data', async () => {
                const body = generateValidBody();
                const user = await (0, users_factory_1.createUser)(body);
                const response = await server.post('/users/sign-in').send(body);
                expect(response.body.user).toEqual({
                    id: user.id,
                    email: user.email,
                });
            });
            it('should respond with session token', async () => {
                const body = generateValidBody();
                await (0, users_factory_1.createUser)(body);
                const response = await server.post('/user/sign-in').send(body);
                expect(response.body.token);
            });
        });
    });
});
