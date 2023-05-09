"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middleware_1 = require("../middlewares/authentication-middleware");
const validation_middleware_1 = require("../middlewares/validation-middleware");
const networks_schemas_1 = require("../schemas/networks-schemas");
const networks_controller_1 = require("../controllers/networks-controller");
const networksRouter = (0, express_1.Router)();
networksRouter.all('/*', authentication_middleware_1.authToken);
networksRouter.get('/', networks_controller_1.networksList);
networksRouter.get('/:networkId', networks_controller_1.showNetworks);
networksRouter.post('/', (0, validation_middleware_1.validateBody)(networks_schemas_1.NetworkSchema), networks_controller_1.networksStore);
networksRouter.delete('/:networkId', networks_controller_1.deleteNetworks);
exports.default = networksRouter;