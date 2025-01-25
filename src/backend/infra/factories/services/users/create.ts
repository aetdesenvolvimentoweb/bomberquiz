import {
  DateValidatorStub,
  EmailValidatorStub,
  EncrypterStub,
  PhoneValidatorStub,
} from "@/backend/data/__mocks__";
import { CreateUserService } from "@/backend/data/services";
import { UserCreationPropsValidator } from "@/backend/data/validators";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeCreateUserService = (): CreateUserService => {
  const dateValidator = new DateValidatorStub();
  const emailValidator = new EmailValidatorStub();
  const encrypter = new EncrypterStub();
  const userRepository = new UserRepositoryInMemory();
  const phoneValidator = new PhoneValidatorStub();
  const validationErrors = new ValidationErrors();
  const userValidator = new UserCreationPropsValidator({
    dateValidator,
    emailValidator,
    phoneValidator,
    userRepository,
    validationErrors,
  });
  return new CreateUserService({
    encrypter,
    userRepository,
    userValidator,
  });
};
