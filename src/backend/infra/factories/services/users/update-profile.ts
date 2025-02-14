import {
  DateFnsDateValidatorAdapter,
  LibPhoneNumberJsPhoneValidatorAdapter,
  MongoDBIdValidator,
  ValidatorJsEmailValidatorAdapter,
  prismaClient,
} from "@/backend/infra/adapters";
import {
  UserIdValidator,
  UserUpdateProfilePropsValidator,
} from "@/backend/data/use-cases";
import { ErrorsValidation } from "@/backend/data/shared";
import { PrismaUserRepository } from "@/backend/infra/repositories";
import { UserUpdateProfileService } from "@/backend/data/services";

export const makeUserUpdateProfileService = (): UserUpdateProfileService => {
  const dateValidator = new DateFnsDateValidatorAdapter();
  const emailValidator = new ValidatorJsEmailValidatorAdapter();
  const phoneValidator = new LibPhoneNumberJsPhoneValidatorAdapter();
  const userRepository = new PrismaUserRepository(prismaClient);
  const errorsValidation = new ErrorsValidation();
  const userUpdateProfilePropsValidator = new UserUpdateProfilePropsValidator({
    dateValidator,
    emailValidator,
    phoneValidator,
    userRepository,
    errorsValidation,
  });
  const idValidator = new MongoDBIdValidator();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    errorsValidation,
  });
  return new UserUpdateProfileService({
    userUpdateProfilePropsValidator,
    userIdValidator,
    userRepository,
  });
};
