import {
  UpdateRoleValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { IdValidatorStub } from "@/backend/data/__mocks__";
import { UpdateUserRoleService } from "@/backend/data/services";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeUpdateUserRoleService = (): UpdateUserRoleService => {
  const validationErrors = new ValidationErrors();
  const updateRoleValidator = new UpdateRoleValidator({
    validationErrors,
  });
  const idValidator = new IdValidatorStub();
  const userRepository = new UserRepositoryInMemory();
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
