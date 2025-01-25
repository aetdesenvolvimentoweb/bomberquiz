import { DeleteUserService } from "@/backend/data/services";
import { IdValidatorStub } from "@/backend/data/__mocks__";
import { UserIdValidator } from "@/backend/data/validators";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeDeleteUserService = (): DeleteUserService => {
  const idValidator = new IdValidatorStub();
  const userRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  return new DeleteUserService({
    userIdValidator,
    userRepository,
  });
};
