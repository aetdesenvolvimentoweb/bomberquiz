import {
  DateValidatorStub,
  EmailValidatorStub,
  PhoneValidatorStub,
} from "@/backend/__mocks__";
import {
  UpdateProfilePropsValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { MongoDBIdValidator } from "@/backend/infra/adapters/mongo-db/id-validator";
import { PrismaUserRepositoryAdapter } from "@/backend/infra/adapters/prisma";
import { UpdateUserProfileService } from "@/backend/data/services";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeUpdateUserProfileService = (): UpdateUserProfileService => {
  const dateValidator = new DateValidatorStub();
  const emailValidator = new EmailValidatorStub();
  const phoneValidator = new PhoneValidatorStub();
  const userRepository = new PrismaUserRepositoryAdapter();
  const validationErrors = new ValidationErrors();
  const updateProfilePropsValidator = new UpdateProfilePropsValidator({
    dateValidator,
    emailValidator,
    phoneValidator,
    userRepository,
    validationErrors,
  });
  const idValidator = new MongoDBIdValidator();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  return new UpdateUserProfileService({
    updateProfilePropsValidator,
    userIdValidator,
    userRepository,
  });
};
