import joi from "joi";
import { CreateWiFiParams } from "../services/wiFi-service";

export const wiFiSchema = joi.object<CreateWiFiParams>({
  title: joi.string().required(),
  network: joi.string().required(),
  password: joi.string().required(),
});