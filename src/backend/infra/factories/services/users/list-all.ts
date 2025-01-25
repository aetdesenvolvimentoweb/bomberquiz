import { ListAllUsersService } from "@/backend/data/services";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";

export const makeListAllUsersService = (): ListAllUsersService => {
  const userRepository = new UserRepositoryInMemory();
  return new ListAllUsersService({
    userRepository,
  });
};
