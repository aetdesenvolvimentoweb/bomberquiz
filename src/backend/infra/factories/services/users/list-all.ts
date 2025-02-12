import { PrismaUserRepositoryAdapter } from "@/backend/infra/adapters";
import { UserFindAllService } from "@/backend/data/services";

export const makeUserFindAllService = (): UserFindAllService => {
  const userRepository = new PrismaUserRepositoryAdapter();
  return new UserFindAllService({
    userRepository,
  });
};
