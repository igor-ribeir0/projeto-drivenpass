import { NextFunction, Response } from "express";
import { prisma } from "../config/database";
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { unauthorizedError } from "../errors/unauthorized-error";

export async function authToken(req: any, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  if (!authHeader) return UnauthorizedUser(res);
  
  const token = authHeader.split(' ')[1];
  if (!token) return UnauthorizedUser(res);
  
  try {
    const { userId } = jwt.verify(token, "top_secret") as JWTPack;
  
    const session = await prisma.session.findFirst({
      where: {
        token,
      },
    });
    if (!session) return UnauthorizedUser(res);
  
    req.userId = userId;
  
    return next();
  } catch (err) {
    return UnauthorizedUser(res);
  }
};
  
function UnauthorizedUser(res: Response) {
    res.status(httpStatus.UNAUTHORIZED).send(unauthorizedError());
};
  
type JWTPack = {
  userId: number;
};