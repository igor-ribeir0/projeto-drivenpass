"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCredential = void 0;
const database_1 = require("../../src/config/database");
const faker_1 = require("@faker-js/faker");
const users_factory_1 = require("./users-factory");
const cryptographyUtil_utils_1 = require("../../src/utils/cryptographyUtil-utils");
async function createCredential(user) {
    const incomingUser = user || (await (0, users_factory_1.createUser)());
    const password = cryptographyUtil_utils_1.cryptographyUtil.encrypt(faker_1.faker.internet.password(10));
    return database_1.prisma.credential.create({
        data: {
            title: faker_1.faker.lorem.sentence(),
            url: faker_1.faker.internet.url(),
            username: faker_1.faker.internet.userName(),
            password: password,
            userId: incomingUser.id,
        },
    });
}
exports.createCredential = createCredential;
