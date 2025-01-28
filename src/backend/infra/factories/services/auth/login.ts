import {
  BcryptEncrypterAdapter,
  PrismaAuthRepositoryAdapter,
  PrismaUserRepositoryAdapter,
  ValidatorJsEmailValidatorAdapter,
} from "@/backend/infra/adapters";
import { LoginService } from "@/backend/data/services";
import { LoginValidator } from "@/backend/data/validators";
import { TokenHandlerStub } from "@/backend/__mocks__";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeLoginService = (): LoginService => {
  const userRepository = new PrismaUserRepositoryAdapter();
  const authRepository = new PrismaAuthRepositoryAdapter(userRepository);
  const emailValidator = new ValidatorJsEmailValidatorAdapter();
  const encrypter = new BcryptEncrypterAdapter();
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
