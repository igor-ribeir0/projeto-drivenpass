import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { prisma } from "../../src/config/database";

export async function createUser(params: Partial<User> = {}): Promise<User> {
  const creatingPassword = params.password || faker.internet.password(6);
  const hashedPassword = await bcrypt.hash(creatingPassword, 10);

  return prisma.user.create({
    data: {
      email: params.email || faker.internet.email(),
      password: hashedPassword,
    },
  });
}