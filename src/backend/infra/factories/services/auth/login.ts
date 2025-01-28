import { EmailValidatorStub, TokenHandlerStub } from "@/backend/__mocks__";
import {
  PrismaAuthRepositoryAdapter,
  PrismaUserRepositoryAdapter,
} from "@/backend/infra/adapters/prisma";
import { BcryptEncrypterAdapter } from "@/backend/infra/adapters/bcrypt/encrypter";
import { LoginService } from "@/backend/data/services";
import { LoginValidator } from "@/backend/data/validators";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeLoginService = (): LoginService => {
  const userRepository = new PrismaUserRepositoryAdapter();
  const authRepository = new PrismaAuthRepositoryAdapter(userRepository);
  const emailValidator = new EmailValidatorStub();
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
