import { IdValidatorStub } from "@/backend/data/__mocks__";
import { ListUserByIdService } from "@/backend/data/services";
import { UserIdValidator } from "@/backend/data/validators";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeListUserByIdService = (): ListUserByIdService => {
  const idValidator = new IdValidatorStub();
  const userRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  return new ListUserByIdService({
    userIdValidator,
    userRepository,
  });
};
