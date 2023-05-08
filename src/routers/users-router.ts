import { Router } from "express";
import { createUserSchema } from "../schemas/users-schema";
import { validateBody } from "../middlewares/validation-middleware";
import { createUser, searchUser } from "../controllers/users-controller";

const userRouter = Router();

userRouter.post('/sign-up', validateBody(createUserSchema), createUser);
userRouter.post('/sign-in', validateBody(createUserSchema), searchUser);

export default userRouter;