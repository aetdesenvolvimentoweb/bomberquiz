import {
  DateValidatorStub,
  EmailValidatorStub,
  IdValidatorStub,
  PhoneValidatorStub,
} from "@/backend/data/__mocks__";
import {
  UpdateProfilePropsValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { UpdateUserProfileService } from "@/backend/data/services";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeUpdateUserProfileService = (): UpdateUserProfileService => {
  const dateValidator = new DateValidatorStub();
  const emailValidator = new EmailValidatorStub();
  const phoneValidator = new PhoneValidatorStub();
  const userRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const updateProfilePropsValidator = new UpdateProfilePropsValidator({
    dateValidator,
    emailValidator,
    phoneValidator,
    userRepository,
    validationErrors,
  });
  const idValidator = new IdValidatorStub();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  return new UpdateUserProfileService({
    updateProfilePropsValidator,
    userIdValidator,
    userRepository,
  });
};
