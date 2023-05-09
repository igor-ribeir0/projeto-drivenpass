import { Network } from "@prisma/client";
import { cryptographyUtil } from "../../utils/cryptographyUtil-utils";
import { DuplicatedTitleError } from "../../errors/duplicatedTitle-error";
import { notFoundError } from "../../errors/notFound-error";
import wiFiRepository from "../../repositories/wiFi-repository";

async function listWiFi(userId: number) {
  const wiFi = await wiFiRepository.listWiFi(userId);

  if (wiFi.length === 0) {
    throw notFoundError();
  }

  wiFi.map((wf) => (wf.password = cryptographyUtil.decrypt(wf.password)));

  return wiFi;
};

async function showWiFi(userId: number, wiFiId: number) {
  const wiFi = await wiFiRepository.findById(wiFiId);

  if (!wiFi || wiFi.userId !== userId) {
    throw notFoundError();
  }

  wiFi.password = cryptographyUtil.decrypt(wiFi.password);

  return wiFi;
};

export async function createWiFi({ userId, title, network, password }: CreateWiFiParams): Promise<Network> {
  await validateTitle(userId, title);

  const hashedPassword = cryptographyUtil.encrypt(password);

  return wiFiRepository.createWiFi({
    userId,
    title,
    network,
    password: hashedPassword,
  });
};

async function deleteWiFi(userId: number, wiFiId: number) {
  const wiFi = await wiFiRepository.findById(wiFiId);

  if (!wiFi || wiFi.userId !== userId) {
    throw notFoundError();
  }

  await wiFiRepository.removeWiFi(wiFiId);
};

async function validateTitle(userId: number, title: string) {
  const wiFikWithSameTitle = await wiFiRepository.findByTitle(userId, title);
  if (wiFikWithSameTitle) {
    throw DuplicatedTitleError();
  }
};

export type CreateWiFiParams = Pick<Network, 'userId' | 'title' | 'network' | 'password'>;

const wiFiService = {
  listWiFi,
  showWiFi,
  createWiFi,
  deleteWiFi,
};

export default wiFiService;