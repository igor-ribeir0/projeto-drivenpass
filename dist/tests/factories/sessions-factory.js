"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = void 0;
const database_1 = require("../../src/config/database");
const users_factory_1 = require("./users-factory");
async function createSession(token) {
    const user = await (0, users_factory_1.createUser)();
    return database_1.prisma.session.create({
        data: {
            token: token,
            userId: user.id,
        },
    });
}
exports.createSession = createSession;
