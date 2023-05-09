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
    return database_1.prisma.network.findUnique(params);
}
;
async function findByTitle(userId, title) {
    return database_1.prisma.network.findFirst({
        where: {
            userId,
            title,
        },
    });
}
;
async function listNetwork(userId) {
    return database_1.prisma.network.findMany({
        where: {
            userId,
        },
    });
}
;
async function create(data) {
    return database_1.prisma.network.create({
        data,
    });
}
;
async function remove(credentialId) {
    return database_1.prisma.network.delete({
        where: {
            id: credentialId,
        },
    });
}
;
const networkRepository = {
    findById,
    findByTitle,
    listNetwork,
    create,
    remove,
};
exports.default = networkRepository;
