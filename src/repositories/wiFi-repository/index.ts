import { Prisma } from "@prisma/client";
import { prisma } from "../../config/database";

async function findById(id: number, select?: Prisma.UserSelect) {
  const params: Prisma.NetworkFindUniqueArgs = {
    where: {
      id,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.network.findUnique(params);
};

async function findByTitle(userId: number, title: string) {
  return prisma.network.findFirst({
    where: {
      userId,
      title,
    },
  });
};

async function listWiFi(userId: number) {
  return prisma.network.findMany({
    where: {
      userId,
    },
  });
};

async function createWiFi(data: Prisma.NetworkUncheckedCreateInput) {
  return prisma.network.create({
    data,
  });
};

async function removeWiFi(credentialId: number) {
  return prisma.network.delete({
    where: {
      id: credentialId,
    },
  });
};

const wiFiRepository = {
  findById,
  findByTitle,
  listWiFi,
  createWiFi,
  removeWiFi,
};

export default wiFiRepository;