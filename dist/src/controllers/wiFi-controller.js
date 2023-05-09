"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWiFi = exports.wiFiStore = exports.showWiFi = exports.wiFiList = void 0;
const http_status_1 = __importDefault(require("http-status"));
const wiFi_service_1 = __importDefault(require("../services/wiFi-service"));
async function wiFiList(req, res, next) {
    const { userId } = req;
    try {
        const wiFi = await wiFi_service_1.default.listWiFi(userId);
        return res.status(http_status_1.default.OK).send(wiFi);
    }
    catch (error) {
        next(error);
    }
}
exports.wiFiList = wiFiList;
;
async function showWiFi(req, res, next) {
    const { userId } = req;
    const { wiFiId } = req.params;
    try {
        const wiFi = await wiFi_service_1.default.showWiFi(userId, parseInt(wiFiId));
        return res.status(http_status_1.default.OK).send(wiFi);
    }
    catch (error) {
        next(error);
    }
}
exports.showWiFi = showWiFi;
;
async function wiFiStore(req, res) {
    const { title, network, password } = req.body;
    const { userId } = req;
    try {
        const response = await wiFi_service_1.default.createWiFi({ userId, title, network, password });
        return res.status(http_status_1.default.CREATED).json({
            wiFiId: response.id,
        });
    }
    catch (error) {
        if (error.name === 'DuplicatedTitleError') {
            return res.status(http_status_1.default.CONFLICT).send(error);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.wiFiStore = wiFiStore;
;
async function deleteWiFi(req, res, next) {
    const { userId } = req;
    const { wiFiId } = req.params;
    try {
        await wiFi_service_1.default.deleteWiFi(userId, parseInt(wiFiId));
        return res.sendStatus(http_status_1.default.ACCEPTED);
    }
    catch (error) {
        next(error);
    }
}
exports.deleteWiFi = deleteWiFi;
;
