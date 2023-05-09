"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWiFi = void 0;
const database_1 = require("../../src/config/database");
const faker_1 = require("@faker-js/faker");
const users_factory_1 = require("./users-factory");
const cryptographyUtil_utils_1 = require("../../src/utils/cryptographyUtil-utils");
async function createWiFi(user) {
    const creatingUser = user || (await (0, users_factory_1.createUser)());
    const password = cryptographyUtil_utils_1.cryptographyUtil.encrypt(faker_1.faker.internet.password(10));
    return database_1.prisma.network.create({
        data: {
            title: faker_1.faker.lorem.sentence(),
            network: faker_1.faker.lorem.sentence(),
            password: password,
            userId: creatingUser.id,
        },
    });
}
exports.createWiFi = createWiFi;
;
