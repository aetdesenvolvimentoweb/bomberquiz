import {
  BcryptEncrypterAdapter,
  PrismaUserRepositoryAdapter,
  ValidatorJsEmailValidatorAdapter,
} from "@/backend/infra/adapters";
import { DateValidatorStub, PhoneValidatorStub } from "@/backend/__mocks__";
import { CreateUserService } from "@/backend/data/services";
import { UserCreationPropsValidator } from "@/backend/data/validators";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeCreateUserService = (): CreateUserService => {
  const dateValidator = new DateValidatorStub();
  const emailValidator = new ValidatorJsEmailValidatorAdapter();
  const encrypter = new BcryptEncrypterAdapter();
  const userRepository = new PrismaUserRepositoryAdapter();
  const phoneValidator = new PhoneValidatorStub();
  const validationErrors = new ValidationErrors();
  const userCreationPropsValidator = new UserCreationPropsValidator({
    dateValidator,
    emailValidator,
    phoneValidator,
    userRepository,
    validationErrors,
  });
  return new CreateUserService({
    encrypter,
    userRepository,
    userCreationPropsValidator,
  });
};
