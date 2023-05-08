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
exports.authenticateToken = void 0;
const database_1 = require("../config/database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const unauthorized_error_1 = require("../errors/unauthorized-error");
function authenticateToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.header('Authorization');
        if (!authHeader)
            return UnauthorizedUser(res);
        const token = authHeader.split(' ')[1];
        if (!token)
            return UnauthorizedUser(res);
        try {
            const { userId } = jsonwebtoken_1.default.verify(token, "top_secret");
            const session = yield database_1.prisma.session.findFirst({
                where: {
                    token,
                },
            });
            if (!session)
                return UnauthorizedUser(res);
            req.userId = userId;
            return next();
        }
        catch (err) {
            return UnauthorizedUser(res);
        }
    });
}
exports.authenticateToken = authenticateToken;
;
function UnauthorizedUser(res) {
    res.status(http_status_1.default.UNAUTHORIZED).send((0, unauthorized_error_1.unauthorizedError)());
}
;
