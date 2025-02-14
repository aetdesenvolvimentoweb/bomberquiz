import { PrismaUserRepository } from "@/backend/infra/repositories";
import { UserFindAllService } from "@/backend/data/services";
import { prismaClient } from "@/backend/infra/adapters";

export const makeUserFindAllService = (): UserFindAllService => {
  const userRepository = new PrismaUserRepository(prismaClient);
  return new UserFindAllService({
    userRepository,
  });
};
