import express from 'express';
import 'express-async-errors';
import cors from "cors";
import { loadEnv } from "./config/envs";

loadEnv();

import userRouter from './routers/users-router';

const app = express();
app
  .use(cors())
  .use(express.json())
  .use('/users', userRouter)

export default app;