import {
  Argon2EncrypterAdapter,
  DateFnsDateValidatorAdapter,
  LibPhoneNumberJsPhoneValidatorAdapter,
  PrismaUserRepository,
  ValidatorJsEmailValidatorAdapter,
} from "@/backend/infra/adapters";
import { ErrorsValidation } from "@/backend/data/shared/errors";
import { UserCreateService } from "@/backend/data/services";
import { UserCreationPropsValidator } from "@/backend/data/use-cases";

export const makeUserCreateService = (): UserCreateService => {
  const dateValidator = new DateFnsDateValidatorAdapter();
  const emailValidator = new ValidatorJsEmailValidatorAdapter();
  const encrypter = new Argon2EncrypterAdapter();
  const userRepository = new PrismaUserRepository();
  const phoneValidator = new LibPhoneNumberJsPhoneValidatorAdapter();
  const errorsValidation = new ErrorsValidation();
  const userCreationPropsValidator = new UserCreationPropsValidator({
    dateValidator,
    emailValidator,
    phoneValidator,
    userRepository,
    errorsValidation,
  });
  return new UserCreateService({
    encrypter,
    userRepository,
    userCreationPropsValidator,
  });
};
