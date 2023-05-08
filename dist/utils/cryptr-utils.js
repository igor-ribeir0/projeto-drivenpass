"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cryptrUtil = void 0;
const cryptr_1 = __importDefault(require("cryptr"));
const cryptr = new cryptr_1.default("top_secret");
function encrypt(password) {
    return cryptr.encrypt(password);
}
function decrypt(encryptedPassword) {
    return cryptr.decrypt(encryptedPassword);
}
exports.cryptrUtil = {
    encrypt,
    decrypt,
};
