import {
  DateValidatorStub,
  EmailValidatorStub,
  EncrypterStub,
  PhoneValidatorStub,
} from "@/backend/data/__mocks__";
import { CreateUserService } from "@/backend/data/services";
import { PrismaUserRepositoryAdapter } from "@/backend/infra/adapters/prisma";
import { UserCreationPropsValidator } from "@/backend/data/validators";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeCreateUserService = (): CreateUserService => {
  const dateValidator = new DateValidatorStub();
  const emailValidator = new EmailValidatorStub();
  const encrypter = new EncrypterStub();
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
