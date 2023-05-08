"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_utils_1 = require("../../utils/prisma-utils");
const errors_1 = require("./errors");
const users_repository_1 = __importDefault(require("../../repositories/users-repository"));
const session_repository_1 = __importDefault(require("../../repositories/session-repository"));
async function createUser({ email, password }) {
    await validateUniqueEmail(email);
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    await users_repository_1.default.create(email, hashedPassword);
}
exports.createUser = createUser;
;
async function searchUser(params) {
    const { email, password } = params;
    const user = await users_repository_1.default.findByEmail(email);
    if (!user)
        throw (0, errors_1.invalidEmailPasswordError)();
    const comparePassword = await bcrypt_1.default.compare(password, user.password);
    if (!comparePassword)
        throw (0, errors_1.invalidEmailPasswordError)();
    const token = await createSession(user.id);
    return {
        user: (0, prisma_utils_1.exclude)(user, 'password'),
        token,
    };
}
exports.searchUser = searchUser;
;
async function validateUniqueEmail(email) {
    const userWithSameEmail = await users_repository_1.default.findByEmail(email);
    if (userWithSameEmail) {
        throw (0, errors_1.duplicatedEmailError)();
    }
}
;
async function createSession(userId) {
    const token = jsonwebtoken_1.default.sign({ userId }, "top_secret");
    await session_repository_1.default.create({
        token,
        userId,
    });
    return token;
}
;
const userService = {
    createUser,
    searchUser
};
exports.default = userService;
