import joi from 'joi';
import { CreateCredentialParams } from "../services/credentials-service";

export const CredentialSchema = joi.object<CreateCredentialParams>({
  title: joi.string().required(),
  url: joi.string().required(),
  username: joi.string().required(),
  password: joi.string().required(),
});