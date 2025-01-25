import { EncrypterStub, IdValidatorStub } from "@/backend/data/__mocks__";
import {
  UpdatePasswordPropsValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { UpdateUserPasswordService } from "@/backend/data/services";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeUpdateUserPasswordService = (): UpdateUserPasswordService => {
  const encrypter = new EncrypterStub();
  const userRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const updatePasswordPropsValidator = new UpdatePasswordPropsValidator({
    encrypter,
    userRepository,
    validationErrors,
  });
  const idValidator = new IdValidatorStub();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  return new UpdateUserPasswordService({
    userRepository,
    updatePasswordPropsValidator,
    userIdValidator,
  });
};
