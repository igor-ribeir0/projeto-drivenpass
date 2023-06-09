import { Session } from "@prisma/client";
import { prisma } from "../../src/config/database";
import { createUser } from "./users-factory";


export async function createSession(token: string): Promise<Session> {
  const user = await createUser();

  return prisma.session.create({
    data: {
      token: token,
      userId: user.id,
    },
  });
}