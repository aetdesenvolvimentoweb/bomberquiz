import {
  DateFnsDateValidatorAdapter,
  LibPhoneNumberJsPhoneValidatorAdapter,
  MongoDBIdValidator,
  PrismaUserRepositoryAdapter,
  ValidatorJsEmailValidatorAdapter,
} from "@/backend/infra/adapters";
import {
  UpdateProfilePropsValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { UpdateUserProfileService } from "@/backend/data/services";
import { ValidationErrors } from "@/backend/data/helpers";

export const makeUpdateUserProfileService = (): UpdateUserProfileService => {
  const dateValidator = new DateFnsDateValidatorAdapter();
  const emailValidator = new ValidatorJsEmailValidatorAdapter();
  const phoneValidator = new LibPhoneNumberJsPhoneValidatorAdapter();
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
