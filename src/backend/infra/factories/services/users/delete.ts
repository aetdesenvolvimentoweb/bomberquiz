import { DeleteUserService } from "@/backend/data/services";
import { IdValidatorStub } from "@/backend/__mocks__";
import { PrismaUserRepositoryAdapter } from "@/backend/infra/adapters/prisma";
import { UserIdValidator } from "@/backend/data/validators";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeDeleteUserService = (): DeleteUserService => {
  const idValidator = new IdValidatorStub();
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
