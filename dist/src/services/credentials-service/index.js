"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCredential = void 0;
const cryptographyUtil_utils_1 = require("../../utils/cryptographyUtil-utils");
const duplicatedTitle_error_1 = require("../../errors/duplicatedTitle-error");
const notFound_error_1 = require("../../errors/notFound-error");
const credentials_repository_1 = __importDefault(require("../../repositories/credentials-repository"));
async function listCredential(userId) {
    const credentials = await credentials_repository_1.default.listCredential(userId);
    if (credentials.length === 0) {
        throw (0, notFound_error_1.notFoundError)();
    }
    credentials.map((credential) => (credential.password = cryptographyUtil_utils_1.cryptographyUtil.decrypt(credential.password)));
    return credentials;
}
async function showCredential(userId, credentialId) {
    const credential = await credentials_repository_1.default.findById(credentialId);
    if (!credential || credential.userId !== userId) {
        throw (0, notFound_error_1.notFoundError)();
    }
    credential.password = cryptographyUtil_utils_1.cryptographyUtil.decrypt(credential.password);
    return credential;
}
async function createCredential({ userId, title, url, username, password, }) {
    await validateTitle(userId, title);
    const hashedPassword = cryptographyUtil_utils_1.cryptographyUtil.encrypt(password);
    return credentials_repository_1.default.create({
        userId,
        title,
        url,
        username,
        password: hashedPassword,
    });
}
exports.createCredential = createCredential;
async function deleteCredential(userId, credentialId) {
    const credential = await credentials_repository_1.default.findById(credentialId);
    if (!credential || credential.userId !== userId) {
        throw (0, notFound_error_1.notFoundError)();
    }
    await credentials_repository_1.default.remove(credentialId);
}
async function validateTitle(userId, title) {
    const credentialWithSameTitle = await credentials_repository_1.default.findByTitle(userId, title);
    if (credentialWithSameTitle) {
        throw (0, duplicatedTitle_error_1.DuplicatedTitleError)();
    }
}
const credentialService = {
    listCredential,
    showCredential,
    createCredential,
    deleteCredential,
};
exports.default = credentialService;
