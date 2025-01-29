import {
  Argon2EncrypterAdapter,
  DateFnsDateValidatorAdapter,
  LibPhoneNumberJsPhoneValidatorAdapter,
  PrismaUserRepositoryAdapter,
  ValidatorJsEmailValidatorAdapter,
} from "@/backend/infra/adapters";
import { CreateUserService } from "@/backend/data/services";
import { UserCreationPropsValidator } from "@/backend/data/validators";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeCreateUserService = (): CreateUserService => {
  const dateValidator = new DateFnsDateValidatorAdapter();
  const emailValidator = new ValidatorJsEmailValidatorAdapter();
  const encrypter = new Argon2EncrypterAdapter();
  const userRepository = new PrismaUserRepositoryAdapter();
  const phoneValidator = new LibPhoneNumberJsPhoneValidatorAdapter();
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
