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
exports.createCredential = void 0;
const cryptr_utils_1 = require("../../utils/cryptr-utils");
const duplicatedTitle_error_1 = require("../../errors/duplicatedTitle-error");
const notFound_error_1 = require("../../errors/notFound-error");
const credentials_repository_1 = __importDefault(require("../../repositories/credentials-repository"));
function listCredential(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentials = yield credentials_repository_1.default.listCredential(userId);
        if (credentials.length === 0) {
            throw (0, notFound_error_1.notFoundError)();
        }
        credentials.map((credential) => (credential.password = cryptr_utils_1.cryptrUtil.decrypt(credential.password)));
        return credentials;
    });
}
function showCredential(userId, credentialId) {
    return __awaiter(this, void 0, void 0, function* () {
        const credential = yield credentials_repository_1.default.findById(credentialId);
        if (!credential || credential.userId !== userId) {
            throw (0, notFound_error_1.notFoundError)();
        }
        credential.password = cryptr_utils_1.cryptrUtil.decrypt(credential.password);
        return credential;
    });
}
function createCredential({ userId, title, url, username, password, }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield validateUniqueTitleOrFail(userId, title);
        const hashedPassword = cryptr_utils_1.cryptrUtil.encrypt(password);
        return credentials_repository_1.default.create({
            userId,
            title,
            url,
            username,
            password: hashedPassword,
        });
    });
}
exports.createCredential = createCredential;
function destroyCredential(userId, credentialId) {
    return __awaiter(this, void 0, void 0, function* () {
        const credential = yield credentials_repository_1.default.findById(credentialId);
        if (!credential || credential.userId !== userId) {
            throw (0, notFound_error_1.notFoundError)();
        }
        yield credentials_repository_1.default.destroy(credentialId);
    });
}
function validateUniqueTitleOrFail(userId, title) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentialWithSameTitle = yield credentials_repository_1.default.findByTitle(userId, title);
        if (credentialWithSameTitle) {
            throw (0, duplicatedTitle_error_1.DuplicatedTitleError)();
        }
    });
}
const credentialService = {
    listCredential,
    showCredential,
    createCredential,
    destroyCredential,
};
exports.default = credentialService;
