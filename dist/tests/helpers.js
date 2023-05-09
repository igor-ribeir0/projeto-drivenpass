"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.cleanDb = void 0;
const database_1 = require("../src/config/database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_factory_1 = require("./factories/users-factory");
const sessions_factory_1 = require("./factories/sessions-factory");
async function cleanDb() {
    await database_1.prisma.session.deleteMany({});
    await database_1.prisma.credential.deleteMany({});
    await database_1.prisma.network.deleteMany({});
    await database_1.prisma.user.deleteMany({});
}
exports.cleanDb = cleanDb;
async function generateToken(user) {
    const incomingUser = user || (await (0, users_factory_1.createUser)());
    const token = jsonwebtoken_1.default.sign({ userId: incomingUser.id }, "top_secret");
    await (0, sessions_factory_1.createSession)(token);
    return token;
}
exports.generateToken = generateToken;
;
