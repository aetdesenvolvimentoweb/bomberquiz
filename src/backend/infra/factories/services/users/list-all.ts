import { ListAllUsersService } from "@/backend/data/services";
import { PrismaUserRepositoryAdapter } from "@/backend/infra/adapters/prisma";

export const makeListAllUsersService = (): ListAllUsersService => {
  const userRepository = new PrismaUserRepositoryAdapter();
  return new ListAllUsersService({
    userRepository,
  });
};
