import { PrismaUserRepository } from "@/backend/infra/adapters";
import { UserFindAllService } from "@/backend/data/services";

export const makeUserFindAllService = (): UserFindAllService => {
  const userRepository = new PrismaUserRepository();
  return new UserFindAllService({
    userRepository,
  });
};
