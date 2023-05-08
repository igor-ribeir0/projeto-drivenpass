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
function createUser({ email, password }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield validateUniqueEmail(email);
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield users_repository_1.default.create(email, hashedPassword);
    });
}
exports.createUser = createUser;
;
function searchUser(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = params;
        const user = yield users_repository_1.default.findByEmail(email);
        if (!user)
            throw (0, errors_1.invalidEmailPasswordError)();
        const comparePassword = yield bcrypt_1.default.compare(password, user.password);
        if (!comparePassword)
            throw (0, errors_1.invalidEmailPasswordError)();
        const token = yield createSession(user.id);
        return {
            user: (0, prisma_utils_1.exclude)(user, 'password'),
            token,
        };
    });
}
exports.searchUser = searchUser;
;
function validateUniqueEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const userWithSameEmail = yield users_repository_1.default.findByEmail(email);
        if (userWithSameEmail) {
            throw (0, errors_1.duplicatedEmailError)();
        }
    });
}
;
function createSession(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = jsonwebtoken_1.default.sign({ userId }, "top_secret");
        yield session_repository_1.default.create({
            token,
            userId,
        });
        return token;
    });
}
;
const userService = {
    createUser,
    searchUser
};
exports.default = userService;
