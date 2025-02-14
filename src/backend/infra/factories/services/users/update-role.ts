import { MongoDBIdValidator, db } from "@/backend/infra/adapters";
import {
  UserIdValidator,
  UserUpdateRoleValidator,
} from "@/backend/data/use-cases";
import { ErrorsValidation } from "@/backend/data/shared";
import { PrismaUserRepository } from "@/backend/infra/repositories";
import { UserUpdateRoleService } from "@/backend/data/services";

export const makeUserUpdateRoleService = (): UserUpdateRoleService => {
  const errorsValidation = new ErrorsValidation();
  const userUpdateRoleValidator = new UserUpdateRoleValidator({
    errorsValidation,
  });
  const idValidator = new MongoDBIdValidator();
  const userRepository = new PrismaUserRepository(db);
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    errorsValidation,
  });
  return new UserUpdateRoleService({
    userUpdateRoleValidator,
    userIdValidator,
    userRepository,
  });
};
