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
  UserIdValidatorUseCase,
  UserPhoneValidatorUseCase,
  UserUpdateProfilePropsValidatorUseCase,
} from "@/backend/domain/use-cases";
import {
  UserIdValidator,
  UserUpdateProfilePropsValidator,
} from "@/backend/data/use-cases";
import { UserProfileProps, UserProps } from "@/backend/domain/entities";
import { ErrorsValidation } from "@/backend/data/shared/errors";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/repositories/in-memory";
import { UserUpdateProfileService } from "@/backend/data/services";

interface SutTypes {
  sut: UserUpdateProfileService;
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  idValidator: IdValidatorUseCase;
  phoneValidator: UserPhoneValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidation;
}

const makeSut = (): SutTypes => {
  const dateValidator = new DateValidatorStub();
  const emailValidator = new EmailValidatorStub();
  const idValidator = new IdValidatorStub();
  const phoneValidator = new PhoneValidatorStub();
  const userRepository = new UserRepositoryInMemory();
  const errorsValidation = new ErrorsValidation();
  const userIdValidator: UserIdValidatorUseCase = new UserIdValidator({
    idValidator,
    userRepository,
    errorsValidation,
  });
  const updateProfilePropsValidator: UserUpdateProfilePropsValidatorUseCase =
    new UserUpdateProfilePropsValidator({
      dateValidator,
      emailValidator,
      phoneValidator,
      userRepository,
      errorsValidation,
    });
  const sut = new UserUpdateProfileService({
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
    errorsValidation,
  };
};

describe("UserUpdateProfileService", () => {
  let sut: UserUpdateProfileService;
  let dateValidator: DateValidatorUseCase;
  let emailValidator: EmailValidatorUseCase;
  let idValidator: IdValidatorUseCase;
  let phoneValidator: UserPhoneValidatorUseCase;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidation;

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    dateValidator = sutInstance.dateValidator;
    emailValidator = sutInstance.emailValidator;
    idValidator = sutInstance.idValidator;
    phoneValidator = sutInstance.phoneValidator;
    userRepository = sutInstance.userRepository;
    errorsValidation = sutInstance.errorsValidation;
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
    const user = await userRepository.findByEmail(createUserProps().email);

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
    ).rejects.toThrow(errorsValidation.missingParamError("id"));
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
    ).rejects.toThrow(errorsValidation.invalidParamError("id"));
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
    ).rejects.toThrow(errorsValidation.unregisteredError("id"));
  });

  test("should throws if no name is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      sut.updateProfile({
        id: user!.id,
        props: {
          email: "new_email",
          phone: "new_phone",
          birthdate: new Date(),
        } as UserProfileProps,
      })
    ).rejects.toThrow(errorsValidation.missingParamError("nome"));
  });

  test("should throws if no email is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      sut.updateProfile({
        id: user!.id,
        props: {
          name: "new_name",
          phone: "new_phone",
          birthdate: new Date(),
        } as UserProfileProps,
      })
    ).rejects.toThrow(errorsValidation.missingParamError("email"));
  });

  test("should throws if invalid email is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);
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
    ).rejects.toThrow(errorsValidation.invalidParamError("email"));
  });

  test("should throws if already registered email is provided", async () => {
    await userRepository.create(createUserProps());
    await userRepository.create(createUserProps({ email: "another_email" }));
    const user = await userRepository.findByEmail(createUserProps().email);

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
      errorsValidation.duplicatedKeyError({ entity: "usuário", key: "email" })
    );
  });

  test("should throws if no phone is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      sut.updateProfile({
        id: user!.id,
        props: {
          name: "new_name",
          email: "new_email",
          birthdate: new Date(),
        } as UserProfileProps,
      })
    ).rejects.toThrow(errorsValidation.missingParamError("telefone"));
  });

  test("should throws if invalid phone is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

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
    ).rejects.toThrow(errorsValidation.invalidParamError("telefone"));
  });

  test("should throws if no birthdate is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      sut.updateProfile({
        id: user!.id,
        props: {
          name: "new_name",
          email: "new_email",
          phone: "new_phone",
        } as UserProfileProps,
      })
    ).rejects.toThrow(errorsValidation.missingParamError("data de nascimento"));
  });

  test("should throws if invalid birthdate is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    jest.spyOn(dateValidator, "isAdult").mockReturnValue(false);

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
    ).rejects.toThrow(errorsValidation.invalidParamError("data de nascimento"));
  });
});
