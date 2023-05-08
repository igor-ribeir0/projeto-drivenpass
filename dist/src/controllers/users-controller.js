"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUser = exports.createUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const users_service_1 = __importDefault(require("../services/users-service"));
async function createUser(req, res) {
    const { email, password } = req.body;
    try {
        await users_service_1.default.createUser({ email, password });
        return res.sendStatus(http_status_1.default.CREATED);
    }
    catch (error) {
        if (error.name === 'DuplicatedEmailError') {
            return res.status(http_status_1.default.CONFLICT).send(error);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.createUser = createUser;
;
async function searchUser(req, res) {
    const { email, password } = req.body;
    try {
        const searchResult = await users_service_1.default.searchUser({ email, password });
        return res.status(http_status_1.default.OK).send(searchResult);
    }
    catch (error) {
        if (error.name === "InvalidEmailPasswordError") {
            return res.status(http_status_1.default.UNAUTHORIZED).send(error);
        }
        return res.status(http_status_1.default.BAD_REQUEST).send(error);
    }
}
exports.searchUser = searchUser;
;
