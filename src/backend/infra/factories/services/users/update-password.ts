import {
  Argon2EncrypterAdapter,
  MongoDBIdValidator,
  PrismaUserRepositoryAdapter,
} from "@/backend/infra/adapters";
import {
  UpdatePasswordPropsValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { UpdateUserPasswordService } from "@/backend/data/services";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeUpdateUserPasswordService = (): UpdateUserPasswordService => {
  const encrypter = new Argon2EncrypterAdapter();
  const userRepository = new PrismaUserRepositoryAdapter();
  const validationErrors = new ValidationErrors();
  const updatePasswordPropsValidator = new UpdatePasswordPropsValidator({
    encrypter,
    userRepository,
    validationErrors,
  });
  const idValidator = new MongoDBIdValidator();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  return new UpdateUserPasswordService({
    encrypter,
    userRepository,
    updatePasswordPropsValidator,
    userIdValidator,
  });
};
