"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authToken = void 0;
const database_1 = require("../config/database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const unauthorized_error_1 = require("../errors/unauthorized-error");
async function authToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader)
        return UnauthorizedUser(res);
    const token = authHeader.split(' ')[1];
    if (!token)
        return UnauthorizedUser(res);
    try {
        const { userId } = jsonwebtoken_1.default.verify(token, "top_secret");
        const session = await database_1.prisma.session.findFirst({
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
}
exports.authToken = authToken;
;
function UnauthorizedUser(res) {
    res.status(http_status_1.default.UNAUTHORIZED).send((0, unauthorized_error_1.unauthorizedError)());
}
;
