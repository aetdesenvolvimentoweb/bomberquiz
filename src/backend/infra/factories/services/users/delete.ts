import { DeleteUserService } from "@/backend/data/services";
import { MongoDBIdValidator } from "@/backend/infra/adapters/mongo-db/id-validator";
import { PrismaUserRepositoryAdapter } from "@/backend/infra/adapters/prisma";
import { UserIdValidator } from "@/backend/data/validators";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeDeleteUserService = (): DeleteUserService => {
  const idValidator = new MongoDBIdValidator();
  const userRepository = new PrismaUserRepositoryAdapter();
  const validationErrors = new ValidationErrors();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  return new DeleteUserService({
    userIdValidator,
    userRepository,
  });
};
