import {
  DateValidatorStub,
  EmailValidatorStub,
  IdValidatorStub,
  PhoneValidatorStub,
} from "@/backend/data/__mocks__";
import {
  DateValidatorUseCase,
  EmailValidatorUseCase,
  IdValidatorUseCase,
  PhoneValidatorUseCase,
  UpdateProfilePropsValidatorUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import {
  UpdateProfilePropsValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { UserProfile, UserProps } from "@/backend/domain/entities";
import { UpdateUserProfileService } from "@/backend/data/services";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: UpdateUserProfileService;
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  idValidator: IdValidatorUseCase;
  phoneValidator: PhoneValidatorUseCase;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const dateValidator = new DateValidatorStub();
  const emailValidator = new EmailValidatorStub();
  const idValidator = new IdValidatorStub();
  const phoneValidator = new PhoneValidatorStub();
  const userRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const userIdValidator: UserIdValidatorUseCase = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  const updateProfilePropsValidator: UpdateProfilePropsValidatorUseCase =
    new UpdateProfilePropsValidator({
      dateValidator,
      emailValidator,
      phoneValidator,
      userRepository,
      validationErrors,
    });
  const sut = new UpdateUserProfileService({
    updateProfilePropsValidator,
    userRepository,
    userIdValidator,
  });

  return {
    sut,
    dateValidator,
    emailValidator,
    idValidator,
    phoneValidator,
    userRepository,
    validationErrors,
  };
};

describe("UpdateUserProfileService", () => {
  let sut: UpdateUserProfileService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let dateValidator: DateValidatorUseCase;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let emailValidator: EmailValidatorUseCase;
  let idValidator: IdValidatorUseCase;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let phoneValidator: PhoneValidatorUseCase;
  let userRepository: UserRepository;
  let validationErrors: ValidationErrors;

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    dateValidator = sutInstance.dateValidator;
    emailValidator = sutInstance.emailValidator;
    idValidator = sutInstance.idValidator;
    phoneValidator = sutInstance.phoneValidator;
    userRepository = sutInstance.userRepository;
    validationErrors = sutInstance.validationErrors;
  });

  const createUserProps = (overrides: Partial<UserProps> = {}): UserProps => {
    return {
      name: "any_name",
      email: "valid_email",
      phone: "any_phone",
      birthdate: new Date(),
      role: "cliente",
      password: "any_password",
      ...overrides,
    };
  };

  test("should update a user profile", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    await expect(
      sut.updateProfile({
        id: user!.id,
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfile)
    ).resolves.not.toThrow();
  });

  test("should throws if no id is provided", async () => {
    await expect(
      sut.updateProfile({
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfile)
    ).rejects.toThrow(validationErrors.missingParamError("id"));
  });

  test("should throws if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);
    await expect(
      sut.updateProfile({
        id: "invalid-id",
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfile)
    ).rejects.toThrow(validationErrors.invalidParamError("id"));
  });

  test("should throws if unregistered id is provided", async () => {
    await expect(
      sut.updateProfile({
        id: "unregistered-id",
        name: "new_name",
        email: "new_email",
        phone: "new_phone",
        birthdate: new Date(),
      } as UserProfile)
    ).rejects.toThrow(validationErrors.unregisteredError("id"));
  });
});
