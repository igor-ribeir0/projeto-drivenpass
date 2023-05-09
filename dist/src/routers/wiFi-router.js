"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_middleware_1 = require("../middlewares/authentication-middleware");
const validation_middleware_1 = require("../middlewares/validation-middleware");
const wiFi_schemas_1 = require("../schemas/wiFi-schemas");
const wiFi_controller_1 = require("../controllers/wiFi-controller");
const wiFiRouter = (0, express_1.Router)();
wiFiRouter.all('/*', authentication_middleware_1.authToken);
wiFiRouter.get('/', wiFi_controller_1.wiFiList);
wiFiRouter.get('/:wiFiId', wiFi_controller_1.showWiFi);
wiFiRouter.post('/', (0, validation_middleware_1.validateBody)(wiFi_schemas_1.wiFiSchema), wiFi_controller_1.wiFiStore);
wiFiRouter.delete('/:wiFiId', wiFi_controller_1.deleteWiFi);
exports.default = wiFiRouter;
