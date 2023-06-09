"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const faker_1 = require("@faker-js/faker");
const database_1 = require("../../src/config/database");
async function createUser(params = {}) {
    const creatingPassword = params.password || faker_1.faker.internet.password(6);
    const hashedPassword = await bcrypt_1.default.hash(creatingPassword, 10);
    return database_1.prisma.user.create({
        data: {
            email: params.email || faker_1.faker.internet.email(),
            password: hashedPassword,
        },
    });
}
exports.createUser = createUser;
