"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.init = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const envs_1 = require("./config/envs");
const database_1 = require("./config/database");
(0, envs_1.loadEnv)();
const users_router_1 = __importDefault(require("./routers/users-router"));
const credentials_router_1 = __importDefault(require("./routers/credentials-router"));
const app = (0, express_1.default)();
app
    .use((0, cors_1.default)())
    .use(express_1.default.json())
    .use('/users', users_router_1.default)
    .use('/credentials', credentials_router_1.default);
function init() {
    (0, database_1.connectDb)();
    return Promise.resolve(app);
}
exports.init = init;
;
async function close() {
    await (0, database_1.disconnectDB)();
}
exports.close = close;
;
exports.default = app;
