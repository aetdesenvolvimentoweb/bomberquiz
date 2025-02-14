import { PrismaUserRepository } from "@/backend/infra/repositories";
import { UserFindAllService } from "@/backend/data/services";
import { db } from "@/backend/infra/adapters";

export const makeUserFindAllService = (): UserFindAllService => {
  const userRepository = new PrismaUserRepository(db);
  return new UserFindAllService({
    userRepository,
  });
};
