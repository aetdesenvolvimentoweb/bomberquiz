import {
  MongoDBIdValidator,
  PrismaUserRepositoryAdapter,
} from "@/backend/infra/adapters";
import { UpdateRoleValidator, UserIdValidator } from "@/backend/data/use-cases";
import { UserUpdateRoleService } from "@/backend/data/services";

export const makeUserUpdateRoleService = (): UserUpdateRoleService => {
  const ErrorsValidation = new ErrorsValidation();
  const updateRoleValidator = new UpdateRoleValidator({
    ErrorsValidation,
  });
  const idValidator = new MongoDBIdValidator();
  const userRepository = new PrismaUserRepositoryAdapter();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    ErrorsValidation,
  });
  return new UserUpdateRoleService({
    updateRoleValidator,
    userIdValidator,
    userRepository,
  });
};
