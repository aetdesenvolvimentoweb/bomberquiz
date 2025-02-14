import {
  Argon2EncrypterAdapter,
  MongoDBIdValidator,
  db,
} from "@/backend/infra/adapters";
import {
  UserIdValidator,
  UserUpdatePasswordPropsValidator,
} from "@/backend/data/use-cases";
import { ErrorsValidation } from "@/backend/data/shared";
import { PrismaUserRepository } from "@/backend/infra/repositories";
import { UserUpdatePasswordService } from "@/backend/data/services";

export const makeUserUpdatePasswordService = (): UserUpdatePasswordService => {
  const encrypter = new Argon2EncrypterAdapter();
  const userRepository = new PrismaUserRepository(db);
  const errorsValidation = new ErrorsValidation();
  const userUpdatePasswordPropsValidator = new UserUpdatePasswordPropsValidator(
    {
      encrypter,
      userRepository,
      errorsValidation,
    }
  );
  const idValidator = new MongoDBIdValidator();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    errorsValidation,
  });
  return new UserUpdatePasswordService({
    encrypter,
    userRepository,
    userUpdatePasswordPropsValidator,
    userIdValidator,
  });
};
