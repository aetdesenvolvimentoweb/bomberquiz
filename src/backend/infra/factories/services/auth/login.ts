import {
  Argon2EncrypterAdapter,
  PrismaAuthRepositoryAdapter,
  PrismaUserRepositoryAdapter,
  ValidatorJsEmailValidatorAdapter,
} from "@/backend/infra/adapters";
import { JwtTokenHandlerAdapter } from "@/backend/infra/adapters/jsonwebtoken/auth.token-handler";
import { LoginService } from "@/backend/data/services";
import { LoginValidator } from "@/backend/data/validators";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeLoginService = (): LoginService => {
  const userRepository = new PrismaUserRepositoryAdapter();
  const authRepository = new PrismaAuthRepositoryAdapter(userRepository);
  const emailValidator = new ValidatorJsEmailValidatorAdapter();
  const encrypter = new Argon2EncrypterAdapter();
  const validationErrors = new ValidationErrors();
  const loginValidator = new LoginValidator({
    authRepository,
    emailValidator,
    encrypter,
    validationErrors,
  });
  const tokenHandler = new JwtTokenHandlerAdapter();
  return new LoginService({
    loginValidator,
    tokenHandler,
  });
};
