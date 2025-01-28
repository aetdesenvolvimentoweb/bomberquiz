import {
  UpdateRoleValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { IdValidatorStub } from "@/backend/__mocks__";
import { PrismaUserRepositoryAdapter } from "@/backend/infra/adapters/prisma";
import { UpdateUserRoleService } from "@/backend/data/services";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeUpdateUserRoleService = (): UpdateUserRoleService => {
  const validationErrors = new ValidationErrors();
  const updateRoleValidator = new UpdateRoleValidator({
    validationErrors,
  });
  const idValidator = new IdValidatorStub();
  const userRepository = new PrismaUserRepositoryAdapter();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  return new UpdateUserRoleService({
    updateRoleValidator,
    userIdValidator,
    userRepository,
  });
};
