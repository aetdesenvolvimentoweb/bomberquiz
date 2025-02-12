import {
  MongoDBIdValidator,
  PrismaUserRepositoryAdapter,
} from "@/backend/infra/adapters";
import { UserDeleteService } from "@/backend/data/services";
import { UserIdValidator } from "@/backend/data/use-cases";

export const makeUserDeleteService = (): UserDeleteService => {
  const idValidator = new MongoDBIdValidator();
  const userRepository = new PrismaUserRepositoryAdapter();
  const ErrorsValidation = new ErrorsValidation();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    ErrorsValidation,
  });
  return new UserDeleteService({
    userIdValidator,
    userRepository,
  });
};
