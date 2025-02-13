import {
  Argon2EncrypterAdapter,
  MongoDBIdValidator,
  PrismaUserRepository,
} from "@/backend/infra/adapters";
import {
  UpdatePasswordPropsValidator,
  UserIdValidator,
} from "@/backend/data/use-cases";
import { UserUpdatePasswordService } from "@/backend/data/services";

export const makeUserUpdatePasswordService = (): UserUpdatePasswordService => {
  const encrypter = new Argon2EncrypterAdapter();
  const userRepository = new PrismaUserRepository();
  const ErrorsValidation = new ErrorsValidation();
  const updatePasswordPropsValidator = new UpdatePasswordPropsValidator({
    encrypter,
    userRepository,
    ErrorsValidation,
  });
  const idValidator = new MongoDBIdValidator();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    ErrorsValidation,
  });
  return new UserUpdatePasswordService({
    encrypter,
    userRepository,
    updatePasswordPropsValidator,
    userIdValidator,
  });
};
