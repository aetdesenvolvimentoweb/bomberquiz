import { IdValidatorStub } from "@/backend/data/__mocks__";
import { ListUserByIdService } from "@/backend/data/services";
import { PrismaUserRepositoryAdapter } from "@/backend/infra/adapters/prisma";
import { UserIdValidator } from "@/backend/data/validators";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeListUserByIdService = (): ListUserByIdService => {
  const idValidator = new IdValidatorStub();
  const userRepository = new PrismaUserRepositoryAdapter();
  const validationErrors = new ValidationErrors();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  return new ListUserByIdService({
    userIdValidator,
    userRepository,
  });
};
