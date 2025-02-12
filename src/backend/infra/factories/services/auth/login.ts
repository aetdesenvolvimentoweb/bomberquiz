import {
  Argon2EncrypterAdapter,
  PrismaAuthRepositoryAdapter,
  PrismaUserRepositoryAdapter,
  ValidatorJsEmailValidatorAdapter,
} from "@/backend/infra/adapters";
import { AuthLoginService } from "@/backend/data/services";
import { AuthLoginValidator } from "@/backend/data/use-cases";
import { ErrorsValidation } from "@/backend/data/shared/errors";
import { JwtTokenHandlerAdapter } from "@/backend/infra/adapters/jsonwebtoken/auth.token-handler";

export const makeAuthLoginService = (): AuthLoginService => {
  const userRepository = new PrismaUserRepositoryAdapter();
  const authRepository = new PrismaAuthRepositoryAdapter(userRepository);
  const emailValidator = new ValidatorJsEmailValidatorAdapter();
  const encrypter = new Argon2EncrypterAdapter();
  const errorsValidation = new ErrorsValidation();
  const authLoginValidator = new AuthLoginValidator({
    authRepository,
    emailValidator,
    encrypter,
    errorsValidation,
  });
  const authTokenHandler = new JwtTokenHandlerAdapter();
  return new AuthLoginService({
    authLoginValidator,
    authTokenHandler,
  });
};
