import {
  MongoDBIdValidator,
  PrismaUserRepository,
} from "@/backend/infra/adapters";
import { UserFindByIdService } from "@/backend/data/services";
import { UserIdValidator } from "@/backend/data/use-cases";

export const makeUserFindByIdService = (): UserFindByIdService => {
  const idValidator = new MongoDBIdValidator();
  const userRepository = new PrismaUserRepository();
  const ErrorsValidation = new ErrorsValidation();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    ErrorsValidation,
  });
  return new UserFindByIdService({
    userIdValidator,
    userRepository,
  });
};
