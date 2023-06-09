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
function close() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, database_1.disconnectDB)();
    });
}
exports.close = close;
;
exports.default = app;
