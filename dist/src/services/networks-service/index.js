"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNetwork = void 0;
const cryptographyUtil_utils_1 = require("../../utils/cryptographyUtil-utils");
const duplicatedTitle_error_1 = require("../../errors/duplicatedTitle-error");
const notFound_error_1 = require("../../errors/notFound-error");
const networks_repository_1 = __importDefault(require("../../repositories/networks-repository"));
async function listNetwork(userId) {
    const networks = await networks_repository_1.default.listNetwork(userId);
    if (networks.length === 0) {
        throw (0, notFound_error_1.notFoundError)();
    }
    networks.map((network) => (network.password = cryptographyUtil_utils_1.cryptographyUtil.decrypt(network.password)));
    return networks;
}
;
async function showNetwork(userId, networkId) {
    const network = await networks_repository_1.default.findById(networkId);
    if (!network || network.userId !== userId) {
        throw (0, notFound_error_1.notFoundError)();
    }
    network.password = cryptographyUtil_utils_1.cryptographyUtil.decrypt(network.password);
    return network;
}
;
async function createNetwork({ userId, title, network, password }) {
    await validateTitle(userId, title);
    const hashedPassword = cryptographyUtil_utils_1.cryptographyUtil.encrypt(password);
    return networks_repository_1.default.create({
        userId,
        title,
        network,
        password: hashedPassword,
    });
}
exports.createNetwork = createNetwork;
;
async function deleteNetwork(userId, networkId) {
    const network = await networks_repository_1.default.findById(networkId);
    if (!network || network.userId !== userId) {
        throw (0, notFound_error_1.notFoundError)();
    }
    await networks_repository_1.default.remove(networkId);
}
;
async function validateTitle(userId, title) {
    const networkWithSameTitle = await networks_repository_1.default.findByTitle(userId, title);
    if (networkWithSameTitle) {
        throw (0, duplicatedTitle_error_1.DuplicatedTitleError)();
    }
}
;
const networkService = {
    listNetwork,
    showNetwork,
    createNetwork,
    deleteNetwork,
};
exports.default = networkService;
