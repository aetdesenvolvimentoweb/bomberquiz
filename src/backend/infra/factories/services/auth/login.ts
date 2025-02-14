import {
  Argon2EncrypterAdapter,
  JwtTokenHandlerAdapter,
  ValidatorJsEmailValidatorAdapter,
  prismaClient,
} from "@/backend/infra/adapters";
import {
  PrismaAuthRepository,
  PrismaUserRepository,
} from "@/backend/infra/repositories";
import { AuthLoginService } from "@/backend/data/services";
import { AuthLoginValidator } from "@/backend/data/use-cases";
import { ErrorsValidation } from "@/backend/data/shared/errors";

export const makeAuthLoginService = (): AuthLoginService => {
  const userRepository = new PrismaUserRepository(prismaClient);
  const authRepository = new PrismaAuthRepository(userRepository);
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
