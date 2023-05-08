import joi from 'joi';
import { CreateUserParams } from "../services/users-service";

export const createUserSchema = joi.object<CreateUserParams>({
  email: joi.string().email().required(),
  password: joi.string().min(10).required(),
});