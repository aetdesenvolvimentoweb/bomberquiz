import { InMemoryUserRepository } from "@/backend/data/repositories";
import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateService } from "@/backend/data/services";
import {
  UserCreateDataValidator,
  UserUniqueEmailValidator,
} from "@/backend/data/validators";
import {
  DateFnsBirthdateValidatorAdapter,
  LibphonenumberPhoneValidator,
  PasswordValidatorAdapter,
  ValidatorEmailValidatorAdapter,
} from "@/backend/infra/adapters";
import { Argon2Hash, ConsoleLogger } from "@/backend/infra/providers";
import { DOMPurifyXssSanitizer } from "@/backend/infra/sanitizers";

export const makeUserCreateService = (): UserCreateService => {
  const hashProvider = new Argon2Hash();
  const loggerProvider = new ConsoleLogger();
  const xssSanitizer = new DOMPurifyXssSanitizer();
  const userCreateDataSanitizer = new UserCreateDataSanitizer(xssSanitizer);
  const userRepository = new InMemoryUserRepository();
  const userBirthdateValidator = new DateFnsBirthdateValidatorAdapter();
  const userEmailValidator = new ValidatorEmailValidatorAdapter();
  const userPasswordValidator = new PasswordValidatorAdapter();
  const userPhoneValidator = new LibphonenumberPhoneValidator();
  const userUniqueEmailValidator = new UserUniqueEmailValidator(userRepository);
  const userCreateDataValidator = new UserCreateDataValidator({
    userBirthdateValidator,
    userEmailValidator,
    userPasswordValidator,
    userPhoneValidator,
    userUniqueEmailValidator,
  });

  return new UserCreateService({
    hashProvider,
    loggerProvider,
    userCreateDataSanitizer,
    userRepository,
    userCreateDataValidator,
  });
};
