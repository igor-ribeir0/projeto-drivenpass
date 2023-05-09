import { prisma } from "../../src/config/database";
import { faker } from "@faker-js/faker";
import { User, Credential} from "@prisma/client";
import { createUser } from "./users-factory";
import { cryptographyUtil } from "../../src/utils/cryptographyUtil-utils";

export async function createCredential(user?: User): Promise<Credential> {
  const incomingUser = user || (await createUser());

  const password = cryptographyUtil.encrypt(faker.internet.password(10));

  return prisma.credential.create({
    data: {
      title: faker.lorem.sentence(),
      url: faker.internet.url(),
      username: faker.internet.userName(),
      password: password,
      userId: incomingUser.id,
    },
  });
}