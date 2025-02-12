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
} from "@/backend/data/use-cases";
import { UserUpdateProfileService } from "@/backend/data/services";

export const makeUserUpdateProfileService = (): UserUpdateProfileService => {
  const dateValidator = new DateFnsDateValidatorAdapter();
  const emailValidator = new ValidatorJsEmailValidatorAdapter();
  const phoneValidator = new LibPhoneNumberJsPhoneValidatorAdapter();
  const userRepository = new PrismaUserRepositoryAdapter();
  const ErrorsValidation = new ErrorsValidation();
  const updateProfilePropsValidator = new UpdateProfilePropsValidator({
    dateValidator,
    emailValidator,
    phoneValidator,
    userRepository,
    ErrorsValidation,
  });
  const idValidator = new MongoDBIdValidator();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    ErrorsValidation,
  });
  return new UserUpdateProfileService({
    updateProfilePropsValidator,
    userIdValidator,
    userRepository,
  });
};
