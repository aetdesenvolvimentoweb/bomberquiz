import {
  AuthRepositoryInMemory,
  UserRepositoryInMemory,
} from "@/backend/infra/in-memory-repositories";
import {
  EmailValidatorStub,
  EncrypterStub,
  TokenHandlerStub,
} from "@/backend/data/__mocks__";
import { LoginService } from "@/backend/data/services";
import { LoginValidator } from "@/backend/data/validators";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeLoginService = (): LoginService => {
  const userRepository = new UserRepositoryInMemory();
  const authRepository = new AuthRepositoryInMemory(userRepository);
  const emailValidator = new EmailValidatorStub();
  const encrypter = new EncrypterStub();
  const validationErrors = new ValidationErrors();
  const loginValidator = new LoginValidator({
    authRepository,
    emailValidator,
    encrypter,
    validationErrors,
  });
  const tokenHandler = new TokenHandlerStub();
  return new LoginService({
    loginValidator,
    tokenHandler,
  });
};
