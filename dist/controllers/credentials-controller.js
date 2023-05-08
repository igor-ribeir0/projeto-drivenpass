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
exports.credentialsDestroy = exports.credentialsStore = exports.credentialsShow = exports.credentialsList = void 0;
const http_status_1 = __importDefault(require("http-status"));
const credentials_service_1 = __importDefault(require("../services/credentials-service"));
function credentialsList(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req;
        try {
            const credentials = yield credentials_service_1.default.listCredential(userId);
            return res.status(http_status_1.default.OK).send(credentials);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.credentialsList = credentialsList;
;
function credentialsShow(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req;
        const { credentialId } = req.params;
        try {
            const credentials = yield credentials_service_1.default.showCredential(userId, parseInt(credentialId));
            return res.status(http_status_1.default.OK).send(credentials);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.credentialsShow = credentialsShow;
;
function credentialsStore(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, url, username, password } = req.body;
        const { userId } = req;
        try {
            const credential = yield credentials_service_1.default.createCredential({ userId, title, url, username, password });
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
    });
}
exports.credentialsStore = credentialsStore;
;
function credentialsDestroy(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req;
        const { credentialId } = req.params;
        try {
            yield credentials_service_1.default.destroyCredential(userId, parseInt(credentialId));
            return res.sendStatus(http_status_1.default.ACCEPTED);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.credentialsDestroy = credentialsDestroy;
;
