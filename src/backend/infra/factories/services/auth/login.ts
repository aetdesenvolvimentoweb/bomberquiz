import {
  EmailValidatorStub,
  EncrypterStub,
  TokenHandlerStub,
} from "@/backend/data/__mocks__";
import {
  PrismaAuthRepositoryAdapter,
  PrismaUserRepositoryAdapter,
} from "@/backend/infra/adapters/prisma";
import { LoginService } from "@/backend/data/services";
import { LoginValidator } from "@/backend/data/validators";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeLoginService = (): LoginService => {
  const userRepository = new PrismaUserRepositoryAdapter();
  const authRepository = new PrismaAuthRepositoryAdapter(userRepository);
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
