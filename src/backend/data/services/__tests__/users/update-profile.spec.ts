import {
  DateValidatorStub,
  EmailValidatorStub,
  IdValidatorStub,
  PhoneValidatorStub,
} from "@/backend/__mocks__";
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
import { UserProfileProps, UserProps } from "@/backend/domain/entities";
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
  let dateValidator: DateValidatorUseCase;
  let emailValidator: EmailValidatorUseCase;
  let idValidator: IdValidatorUseCase;
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
        props: {
          name: "new_name",
          email: "new_email",
          phone: "new_phone",
          birthdate: new Date(),
        } as UserProfileProps,
      })
    ).resolves.not.toThrow();
  });

  test("should throws if no id is provided", async () => {
    await expect(
      // @ts-expect-error teste
      sut.updateProfile({
        props: {
          name: "new_name",
          email: "new_email",
          phone: "new_phone",
          birthdate: new Date(),
        } as UserProfileProps,
      })
    ).rejects.toThrow(validationErrors.missingParamError("id"));
  });

  test("should throws if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);
    await expect(
      sut.updateProfile({
        id: "invalid-id",
        props: {
          name: "new_name",
          email: "new_email",
          phone: "new_phone",
          birthdate: new Date(),
        } as UserProfileProps,
      })
    ).rejects.toThrow(validationErrors.invalidParamError("id"));
  });

  test("should throws if unregistered id is provided", async () => {
    await expect(
      sut.updateProfile({
        id: "unregistered-id",
        props: {
          name: "new_name",
          email: "new_email",
          phone: "new_phone",
          birthdate: new Date(),
        } as UserProfileProps,
      })
    ).rejects.toThrow(validationErrors.unregisteredError("id"));
  });

  test("should throws if no name is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    await expect(
      sut.updateProfile({
        id: user!.id,
        props: {
          email: "new_email",
          phone: "new_phone",
          birthdate: new Date(),
        } as UserProfileProps,
      })
    ).rejects.toThrow(validationErrors.missingParamError("nome"));
  });

  test("should throws if no email is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    await expect(
      sut.updateProfile({
        id: user!.id,
        props: {
          name: "new_name",
          phone: "new_phone",
          birthdate: new Date(),
        } as UserProfileProps,
      })
    ).rejects.toThrow(validationErrors.missingParamError("email"));
  });

  test("should throws if invalid email is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);
    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);

    await expect(
      sut.updateProfile({
        id: user!.id,
        props: {
          name: "new_name",
          email: "new_email",
          phone: "new_phone",
          birthdate: new Date(),
        } as UserProfileProps,
      })
    ).rejects.toThrow(validationErrors.invalidParamError("email"));
  });

  test("should throws if already registered email is provided", async () => {
    await userRepository.create(createUserProps());
    await userRepository.create(createUserProps({ email: "another_email" }));
    const user = await userRepository.listByEmail(createUserProps().email);

    await expect(
      sut.updateProfile({
        id: user!.id,
        props: {
          name: "new_name",
          // email already registered
          email: "another_email",
          phone: "new_phone",
          birthdate: new Date(),
        } as UserProfileProps,
      })
    ).rejects.toThrow(
      validationErrors.duplicatedKeyError({ entity: "usuário", key: "email" })
    );
  });

  test("should throws if no phone is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    await expect(
      sut.updateProfile({
        id: user!.id,
        props: {
          name: "new_name",
          email: "new_email",
          birthdate: new Date(),
        } as UserProfileProps,
      })
    ).rejects.toThrow(validationErrors.missingParamError("telefone"));
  });

  test("should throws if invalid phone is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    jest.spyOn(phoneValidator, "isValid").mockReturnValue(false);

    await expect(
      sut.updateProfile({
        id: user!.id,
        props: {
          name: "new_name",
          email: "new_email",
          phone: "invalid-phone",
          birthdate: new Date(),
        } as UserProfileProps,
      })
    ).rejects.toThrow(validationErrors.invalidParamError("telefone"));
  });

  test("should throws if no birthdate is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    await expect(
      sut.updateProfile({
        id: user!.id,
        props: {
          name: "new_name",
          email: "new_email",
          phone: "new_phone",
        } as UserProfileProps,
      })
    ).rejects.toThrow(validationErrors.missingParamError("data de nascimento"));
  });

  test("should throws if invalid birthdate is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    jest.spyOn(dateValidator, "isBirthdateValid").mockReturnValue(false);

    await expect(
      sut.updateProfile({
        id: user!.id,
        props: {
          name: "new_name",
          email: "new_email",
          phone: "new_phone",
          birthdate: new Date("invalid-date"),
        } as UserProfileProps,
      })
    ).rejects.toThrow(validationErrors.invalidParamError("data de nascimento"));
  });
});
