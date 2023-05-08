"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../config/database");
async function create(data) {
    return database_1.prisma.session.create({ data });
}
;
const sessionRepository = {
    create,
};
exports.default = sessionRepository;
