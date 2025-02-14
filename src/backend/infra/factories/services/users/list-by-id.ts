import { MongoDBIdValidator, db } from "@/backend/infra/adapters";
import { ErrorsValidation } from "@/backend/data/shared";
import { PrismaUserRepository } from "@/backend/infra/repositories";
import { UserFindByIdService } from "@/backend/data/services";
import { UserIdValidator } from "@/backend/data/use-cases";

export const makeUserFindByIdService = (): UserFindByIdService => {
  const idValidator = new MongoDBIdValidator();
  const userRepository = new PrismaUserRepository(db);
  const errorsValidation = new ErrorsValidation();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    errorsValidation,
  });
  return new UserFindByIdService({
    userIdValidator,
    userRepository,
  });
};
