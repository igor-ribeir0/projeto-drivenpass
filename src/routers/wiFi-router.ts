import { Router } from "express";
import { authToken } from "../middlewares/authentication-middleware";
import { validateBody } from "../middlewares/validation-middleware";
import { wiFiSchema } from "../schemas/wiFi-schemas";
import { wiFiList, showWiFi, wiFiStore, deleteWiFi } from "../controllers/wiFi-controller";

const wiFiRouter = Router();

wiFiRouter.all('/*', authToken);
wiFiRouter.get('/', wiFiList);
wiFiRouter.get('/:wiFiId', showWiFi);
wiFiRouter.post('/', validateBody(wiFiSchema), wiFiStore);
wiFiRouter.delete('/:wiFiId', deleteWiFi);

export default wiFiRouter;