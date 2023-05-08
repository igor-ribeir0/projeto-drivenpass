import { NextFunction, Response } from "express";
import httpStatus from 'http-status';
import credentialService, { CreateCredentialParams } from "../services/credentials-service";

export async function credentialsList(req: any, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const credentials = await credentialService.listCredential(userId);
    return res.status(httpStatus.OK).send(credentials);
  } catch (error) {
    next(error);
  }
};

export async function showCredentials(req: any, res: Response, next: NextFunction) {
  const { userId } = req;
  const { credentialId } = req.params;

  try {
    const credentials = await credentialService.showCredential(userId, parseInt(credentialId));
    return res.status(httpStatus.OK).send(credentials);
  } catch (error) {
    next(error);
  }
};

export async function credentialsStore(req: any, res: Response) {
  const { title, url, username, password } = req.body as CreateCredentialParams;
  const { userId } = req;

  try {
    const credential = await credentialService.createCredential({ userId, title, url, username, password });
    return res.status(httpStatus.CREATED).json({
      credentialId: credential.id,
    });
  } catch (error: any) {
    if (error.name === 'DuplicatedTitleError') {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

export async function deleteCredentials(req: any, res: Response, next: NextFunction) {
  const { userId } = req;
  const { credentialId } = req.params;

  try {
    await credentialService.deleteCredential(userId, parseInt(credentialId));
    return res.sendStatus(httpStatus.ACCEPTED);
  } catch (error) {
    next(error);
  }
};