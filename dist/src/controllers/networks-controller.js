"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNetworks = exports.networksStore = exports.showNetworks = exports.networksList = void 0;
const http_status_1 = __importDefault(require("http-status"));
const networks_service_1 = __importDefault(require("../services/networks-service"));
async function networksList(req, res, next) {
    const { userId } = req;
    try {
        const networks = await networks_service_1.default.listNetwork(userId);
        return res.status(http_status_1.default.OK).send(networks);
    }
    catch (error) {
        next(error);
    }
}
exports.networksList = networksList;
;
async function showNetworks(req, res, next) {
    const { userId } = req;
    const { networkId } = req.params;
    try {
        const networks = await networks_service_1.default.showNetwork(userId, parseInt(networkId));
        return res.status(http_status_1.default.OK).send(networks);
    }
    catch (error) {
        next(error);
    }
}
exports.showNetworks = showNetworks;
;
async function networksStore(req, res) {
    const { title, network, password } = req.body;
    const { userId } = req;
    try {
        const response = await networks_service_1.default.createNetwork({ userId, title, network, password });
        return res.status(http_status_1.default.CREATED).json({
            networkId: response.id,
        });
    }
    catch (error) {
        if (error.name === 'DuplicatedTitleError') {
            return res.status(http_status_1.default.CONFLICT).send(error);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.networksStore = networksStore;
;
async function deleteNetworks(req, res, next) {
    const { userId } = req;
    const { networkId } = req.params;
    try {
        await networks_service_1.default.deleteNetwork(userId, parseInt(networkId));
        return res.sendStatus(http_status_1.default.ACCEPTED);
    }
    catch (error) {
        next(error);
    }
}
exports.deleteNetworks = deleteNetworks;
;
