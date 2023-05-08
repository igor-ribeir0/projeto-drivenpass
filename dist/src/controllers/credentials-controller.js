"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCredentials = exports.credentialsStore = exports.showCredentials = exports.credentialsList = void 0;
const http_status_1 = __importDefault(require("http-status"));
const credentials_service_1 = __importDefault(require("../services/credentials-service"));
async function credentialsList(req, res, next) {
    const { userId } = req;
    try {
        const credentials = await credentials_service_1.default.listCredential(userId);
        return res.status(http_status_1.default.OK).send(credentials);
    }
    catch (error) {
        next(error);
    }
}
exports.credentialsList = credentialsList;
;
async function showCredentials(req, res, next) {
    const { userId } = req;
    const { credentialId } = req.params;
    try {
        const credentials = await credentials_service_1.default.showCredential(userId, parseInt(credentialId));
        return res.status(http_status_1.default.OK).send(credentials);
    }
    catch (error) {
        next(error);
    }
}
exports.showCredentials = showCredentials;
;
async function credentialsStore(req, res) {
    const { title, url, username, password } = req.body;
    const { userId } = req;
    try {
        const credential = await credentials_service_1.default.createCredential({ userId, title, url, username, password });
        return res.status(http_status_1.default.CREATED).json({
            credentialId: credential.id,
        });
    }
    catch (error) {
        if (error.name === 'DuplicatedTitleError') {
            return res.status(http_status_1.default.CONFLICT).send(error);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.credentialsStore = credentialsStore;
;
async function deleteCredentials(req, res, next) {
    const { userId } = req;
    const { credentialId } = req.params;
    try {
        await credentials_service_1.default.deleteCredential(userId, parseInt(credentialId));
        return res.sendStatus(http_status_1.default.ACCEPTED);
    }
    catch (error) {
        next(error);
    }
}
exports.deleteCredentials = deleteCredentials;
;
