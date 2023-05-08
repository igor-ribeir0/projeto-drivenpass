import { Credential } from '@prisma/client';
import { cryptographyUtil } from "../../utils/cryptographyUtil-utils";
import { DuplicatedTitleError } from "../../errors/duplicatedTitle-error";
import { notFoundError } from "../../errors/notFound-error";
import credentialRepository from "../../repositories/credentials-repository";


async function listCredential(userId: number) {
  const credentials = await credentialRepository.listCredential(userId);
  if (credentials.length === 0) {
    throw notFoundError();
  }

  credentials.map((credential) => (credential.password = cryptographyUtil.decrypt(credential.password)));
  return credentials;
}

async function showCredential(userId: number, credentialId: number) {
  const credential = await credentialRepository.findById(credentialId);
  if (!credential || credential.userId !== userId) {
    throw notFoundError();
  }

  credential.password = cryptographyUtil.decrypt(credential.password);
  return credential;
}

export async function createCredential({
  userId,
  title,
  url,
  username,
  password,
}: CreateCredentialParams): Promise<Credential> {
  await validateTitle(userId, title);

  const hashedPassword = cryptographyUtil.encrypt(password);
  return credentialRepository.create({
    userId,
    title,
    url,
    username,
    password: hashedPassword,
  });
}

async function deleteCredential(userId: number, credentialId: number) {
  const credential = await credentialRepository.findById(credentialId);
  if (!credential || credential.userId !== userId) {
    throw notFoundError();
  }

  await credentialRepository.remove(credentialId);
}

async function validateTitle(userId: number, title: string) {
  const credentialWithSameTitle = await credentialRepository.findByTitle(userId, title);
  if (credentialWithSameTitle) {
    throw DuplicatedTitleError();
  }
}

export type CreateCredentialParams = Pick<Credential, 'userId' | 'title' | 'url' | 'username' | 'password'>;

const credentialService = {
  listCredential,
  showCredential,
  createCredential,
  deleteCredential,
};

export default credentialService;