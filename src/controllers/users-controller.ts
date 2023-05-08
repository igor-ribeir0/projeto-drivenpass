import { Request, Response } from 'express';
import httpStatus from 'http-status';
import userService from "../services/users-service";
import { SignInParams } from "../services/users-service";

export async function createUser(req: Request, res: Response) {
    const { email, password } = req.body;
  
    try {
      await userService.createUser({ email, password });

      return res.sendStatus(httpStatus.CREATED);
    } 
    catch (error: any) {
      if (error.name === 'DuplicatedEmailError') {
        return res.status(httpStatus.CONFLICT).send(error);
      }

      return res.status(httpStatus.BAD_REQUEST).send(error);
    }
};

export async function searchUser(req: Request, res: Response){
  const { email, password } = req.body as SignInParams;

  try{
    const searchResult = await userService.searchUser({ email, password });

    return res.status(httpStatus.OK).send(searchResult);
  }
  catch(error: any){
    if(error.name === "InvalidEmailPasswordError"){
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }

    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
};