"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../config/database");
async function findById(id, select) {
    const params = {
        where: {
            id,
        },
    };
    if (select) {
        params.select = select;
    }
    return database_1.prisma.credential.findUnique(params);
}
;
async function findByTitle(userId, title) {
    return database_1.prisma.credential.findFirst({
        where: {
            userId,
            title,
        },
    });
}
;
async function listCredential(userId) {
    return database_1.prisma.credential.findMany({
        where: {
            userId,
        },
    });
}
;
async function create(data) {
    return database_1.prisma.credential.create({
        data,
    });
}
;
async function remove(credentialId) {
    return database_1.prisma.credential.delete({
        where: {
            id: credentialId,
        },
    });
}
;
const credentialRepository = {
    findById,
    findByTitle,
    listCredential,
    create,
    remove,
};
exports.default = credentialRepository;
