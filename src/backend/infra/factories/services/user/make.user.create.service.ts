import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { UserCreateService } from "@/backend/data/services";
import {
  UserCreateDataValidator,
  UserPasswordValidator,
  UserUniqueEmailValidator,
} from "@/backend/data/validators";
import {
  UserBirthdateValidatorUseCase,
  UserEmailValidatorUseCase,
  UserPhoneValidatorUseCase,
} from "@/backend/domain/validators";
import { ConsoleLoggerProvider } from "@/backend/infra/providers";
import { InMemoryUserRepository } from "@/backend/infra/repositories";

export const makeUserCreateService = (): UserCreateService => {
  const loggerProvider = new ConsoleLoggerProvider();
  const userCreateDataSanitizer = new UserCreateDataSanitizer();
  const userRepository = new InMemoryUserRepository();
  const userEmailValidator = jest.mocked<UserEmailValidatorUseCase>({
    validate: jest.fn().mockResolvedValue(true),
  });
  const userBirthdateValidator = jest.mocked<UserBirthdateValidatorUseCase>({
    validate: jest.fn().mockResolvedValue(true),
  });
  const userPhoneValidator = jest.mocked<UserPhoneValidatorUseCase>({
    validate: jest.fn().mockResolvedValue(true),
  });
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
