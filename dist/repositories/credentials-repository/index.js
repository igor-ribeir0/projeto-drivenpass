"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../config/database");
function findById(id, select) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            where: {
                id,
            },
        };
        if (select) {
            params.select = select;
        }
        return database_1.prisma.credential.findUnique(params);
    });
}
function findByTitle(userId, title) {
    return __awaiter(this, void 0, void 0, function* () {
        return database_1.prisma.credential.findFirst({
            where: {
                userId,
                title,
            },
        });
    });
}
function listCredential(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return database_1.prisma.credential.findMany({
            where: {
                userId,
            },
        });
    });
}
function create(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return database_1.prisma.credential.create({
            data,
        });
    });
}
function destroy(credentialId) {
    return __awaiter(this, void 0, void 0, function* () {
        return database_1.prisma.credential.delete({
            where: {
                id: credentialId,
            },
        });
    });
}
const credentialRepository = {
    findById,
    findByTitle,
    listCredential,
    create,
    destroy,
};
exports.default = credentialRepository;
