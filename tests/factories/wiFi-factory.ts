import { prisma } from "../../src/config/database";
import { Network, User } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { createUser } from "./users-factory";
import { cryptographyUtil } from "../../src/utils/cryptographyUtil-utils";

export async function createWiFi(user?: User): Promise<Network> {
  const creatingUser = user || (await createUser());

  const password = cryptographyUtil.encrypt(faker.internet.password(10));

  return prisma.network.create({
    data: {
      title: faker.lorem.sentence(),
      network: faker.lorem.sentence(),
      password: password,
      userId: creatingUser.id,
    },
  });
};