import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import wiFiService, { CreateWiFiParams } from "../services/wiFi-service";

export async function wiFiList(req: any, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const wiFi = await wiFiService.listWiFi(userId);

    return res.status(httpStatus.OK).send(wiFi);
  } catch (error) {
    next(error);
  }
};

export async function showWiFi(req: any, res: Response, next: NextFunction) {
  const { userId } = req;
  const { wiFiId } = req.params;

  try {
    const wiFi = await wiFiService.showWiFi(userId, parseInt(wiFiId));

    return res.status(httpStatus.OK).send(wiFi);
  } catch (error) {
    next(error);
  }
};

export async function wiFiStore(req: any, res: Response) {
  const { title, network, password } = req.body as CreateWiFiParams;
  const { userId } = req;

  try {
    const response = await wiFiService.createWiFi({ userId, title, network, password });

    return res.status(httpStatus.CREATED).json({
      wiFiId: response.id,
    });
  } catch (error) {
    if (error.name === 'DuplicatedTitleError') {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

export async function deleteWiFi(req: any, res: Response, next: NextFunction) {
  const { userId } = req;
  const { wiFiId } = req.params;

  try {
    await wiFiService.deleteWiFi(userId, parseInt(wiFiId));

    return res.sendStatus(httpStatus.ACCEPTED);
  } catch (error) {
    next(error);
  }
};