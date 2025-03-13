import {
  BasicXssSanitizer,
  UserCreateDataSanitizer,
} from "@/backend/data/sanitizers";
import { UserCreateService } from "@/backend/data/services";
import {
  UserCreateDataValidator,
  UserPasswordValidator,
  UserUniqueEmailValidator,
} from "@/backend/data/validators";
import {
  UserBirthdateValidatorAdapter,
  UserEmailValidatorAdapter,
  UserPhoneValidatorAdapter,
} from "@/backend/infra/adapters";
import { ConsoleLoggerProvider } from "@/backend/infra/providers";
import { InMemoryUserRepository } from "@/backend/infra/repositories";

export const makeUserCreateService = (): UserCreateService => {
  const loggerProvider = new ConsoleLoggerProvider();
  const basicXssSanitizer = new BasicXssSanitizer();
  const userCreateDataSanitizer = new UserCreateDataSanitizer(
    basicXssSanitizer,
  );
  const userRepository = new InMemoryUserRepository();
  const userEmailValidator = new UserEmailValidatorAdapter();
  const userBirthdateValidator = new UserBirthdateValidatorAdapter();
  const userPhoneValidator = new UserPhoneValidatorAdapter();
  const userPasswordValidator = new UserPasswordValidator();
  const userUniqueEmailValidator = new UserUniqueEmailValidator(userRepository);
  const userCreateDataValidator = new UserCreateDataValidator({
    userEmailValidator,
    userBirthdateValidator,
    userPasswordValidator,
    userPhoneValidator,
    userUniqueEmailValidator,
  });

  return new UserCreateService({
    loggerProvider,
    userCreateDataSanitizer,
    userCreateDataValidator,
    userRepository,
  });
};
