"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
import "reflect-metadata";
import "express-async-errors";
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
import { loadEnv } from "./config/envs";
(0, loadEnv)();

const app = (0, express_1.default)();
app
  .use((0, cors_1.default)())
  .use(express_1.default.json());

const _default = app;
export { _default as default };
