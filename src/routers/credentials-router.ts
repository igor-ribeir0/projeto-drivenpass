import { Router } from "express";

import { authToken } from "../middlewares/authentication-middleware";
import { credentialsList, showCredentials, credentialsStore, deleteCredentials} from "../controllers/credentials-controller";
import { validateBody } from "../middlewares/validation-middleware";
import { CredentialSchema } from "../schemas/credentials-schemas";


const credentialsRouter = Router();

credentialsRouter.all('/*', authToken);
credentialsRouter.get('/', credentialsList);
credentialsRouter.get('/:credentialId', showCredentials);
credentialsRouter.post('/', validateBody(CredentialSchema), credentialsStore);
credentialsRouter.delete('/:credentialId', deleteCredentials);

export default credentialsRouter;