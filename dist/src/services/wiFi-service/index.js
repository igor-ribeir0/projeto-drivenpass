"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWiFi = void 0;
const cryptographyUtil_utils_1 = require("../../utils/cryptographyUtil-utils");
const duplicatedTitle_error_1 = require("../../errors/duplicatedTitle-error");
const notFound_error_1 = require("../../errors/notFound-error");
const wiFi_repository_1 = __importDefault(require("../../repositories/wiFi-repository"));
async function listWiFi(userId) {
    const wiFi = await wiFi_repository_1.default.listWiFi(userId);
    if (wiFi.length === 0) {
        throw (0, notFound_error_1.notFoundError)();
    }
    wiFi.map((wf) => (wf.password = cryptographyUtil_utils_1.cryptographyUtil.decrypt(wf.password)));
    return wiFi;
}
;
async function showWiFi(userId, wiFiId) {
    const wiFi = await wiFi_repository_1.default.findById(wiFiId);
    if (!wiFi || wiFi.userId !== userId) {
        throw (0, notFound_error_1.notFoundError)();
    }
    wiFi.password = cryptographyUtil_utils_1.cryptographyUtil.decrypt(wiFi.password);
    return wiFi;
}
;
async function createWiFi({ userId, title, network, password }) {
    await validateTitle(userId, title);
    const hashedPassword = cryptographyUtil_utils_1.cryptographyUtil.encrypt(password);
    return wiFi_repository_1.default.createWiFi({
        userId,
        title,
        network,
        password: hashedPassword,
    });
}
exports.createWiFi = createWiFi;
;
async function deleteWiFi(userId, wiFiId) {
    const wiFi = await wiFi_repository_1.default.findById(wiFiId);
    if (!wiFi || wiFi.userId !== userId) {
        throw (0, notFound_error_1.notFoundError)();
    }
    await wiFi_repository_1.default.removeWiFi(wiFiId);
}
;
async function validateTitle(userId, title) {
    const wiFikWithSameTitle = await wiFi_repository_1.default.findByTitle(userId, title);
    if (wiFikWithSameTitle) {
        throw (0, duplicatedTitle_error_1.DuplicatedTitleError)();
    }
}
;
const wiFiService = {
    listWiFi,
    showWiFi,
    createWiFi,
    deleteWiFi,
};
exports.default = wiFiService;
