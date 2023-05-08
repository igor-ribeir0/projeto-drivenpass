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
exports.searchUser = exports.createUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const users_service_1 = __importDefault(require("../services/users-service"));
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            yield users_service_1.default.createUser({ email, password });
            return res.sendStatus(http_status_1.default.CREATED);
        }
        catch (error) {
            if (error.name === 'DuplicatedEmailError') {
                return res.status(http_status_1.default.CONFLICT).send(error);
            }
            return res.status(http_status_1.default.BAD_REQUEST).send(error);
        }
    });
}
exports.createUser = createUser;
;
function searchUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const searchResult = yield users_service_1.default.searchUser({ email, password });
            return res.status(http_status_1.default.OK).send(searchResult);
        }
        catch (error) {
            if (error.name === "InvalidEmailPasswordError") {
                return res.status(http_status_1.default.UNAUTHORIZED).send(error);
            }
            return res.status(http_status_1.default.BAD_REQUEST).send(error);
        }
    });
}
exports.searchUser = searchUser;
;
