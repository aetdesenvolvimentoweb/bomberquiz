import {
  DateValidatorStub,
  EmailValidatorStub,
  EncrypterStub,
  PhoneValidatorStub,
} from "@/backend/__mocks__";
import {
  DateValidatorUseCase,
  EmailValidatorUseCase,
  EncrypterUseCase,
  PhoneValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserProps, UserRole } from "@/backend/domain/entities";
import { CreateUserService } from "@/backend/data/services";
import { UserCreationPropsValidator } from "@/backend/data/validators";
import { UserCretionPropsValidatorUseCase } from "@/backend/domain/use-cases";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: CreateUserService;
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  phoneValidator: PhoneValidatorUseCase;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const dateValidator = new DateValidatorStub();
  const encrypter: EncrypterUseCase = new EncrypterStub();
  const emailValidator = new EmailValidatorStub();
  const phoneValidator = new PhoneValidatorStub();
  const userRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const userCreationPropsValidator: UserCretionPropsValidatorUseCase =
    new UserCreationPropsValidator({
      userRepository,
      dateValidator,
      emailValidator,
      phoneValidator,
      validationErrors,
    });
  const sut = new CreateUserService({
    encrypter,
    userRepository,
    userCreationPropsValidator,
  });

  return {
    sut,
    dateValidator,
    emailValidator,
    phoneValidator,
    userRepository,
    validationErrors,
  };
};

describe("CreateUserService", () => {
  let sut: CreateUserService;
  let dateValidator: DateValidatorUseCase;
  let emailValidator: EmailValidatorUseCase;
  let phoneValidator: PhoneValidatorUseCase;
  let userRepository: UserRepository;
  let validationErrors: ValidationErrors;

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    dateValidator = sutInstance.dateValidator;
    emailValidator = sutInstance.emailValidator;
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

  test("should create a user", async () => {
    const userProps = createUserProps();
    const repositorySpy = jest.spyOn(userRepository, "create");

    await expect(sut.create(userProps)).resolves.not.toThrow();
    expect(repositorySpy).toHaveBeenCalledWith({
      ...userProps,
      password: "hashed_password",
    });
  });

  test("should throw if no name is provided", async () => {
    const userProps = createUserProps({ name: undefined });

    await expect(sut.create(userProps)).rejects.toThrow(
      validationErrors.missingParamError("nome")
    );
  });

  test("should throw if no email is provided", async () => {
    const userProps = createUserProps({ email: undefined });

    await expect(sut.create(userProps)).rejects.toThrow(
      validationErrors.missingParamError("email")
    );
  });

  test("should throw if invalid email is provided", async () => {
    const userProps = createUserProps({ email: "invalid_email" });

    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);

    await expect(sut.create(userProps)).rejects.toThrow(
      validationErrors.invalidParamError("email")
    );
  });

  test("should throw if already registered email is provided", async () => {
    const userProps = createUserProps();

    await userRepository.create(userProps);

    await expect(sut.create(userProps)).rejects.toThrow(
      validationErrors.duplicatedKeyError({ entity: "usuário", key: "email" })
    );
  });

  test("should throw if no phone is provided", async () => {
    const userProps = createUserProps({ phone: undefined });

    await expect(sut.create(userProps)).rejects.toThrow(
      validationErrors.missingParamError("telefone")
    );
  });

  test("should throw if invalid phone is provided", async () => {
    const userProps = createUserProps({ phone: "invalid_phone" });

    jest.spyOn(phoneValidator, "isValid").mockReturnValue(false);

    await expect(sut.create(userProps)).rejects.toThrow(
      validationErrors.invalidParamError("telefone")
    );
  });

  test("should throw if no birthdate is provided", async () => {
    const userProps = createUserProps({ birthdate: undefined });

    await expect(sut.create(userProps)).rejects.toThrow(
      validationErrors.missingParamError("data de nascimento")
    );
  });

  test("should throw if invalid birthdate is provided", async () => {
    const userProps = createUserProps();

    jest.spyOn(dateValidator, "isBirthdateValid").mockReturnValue(false);

    await expect(sut.create(userProps)).rejects.toThrow(
      validationErrors.invalidParamError("data de nascimento")
    );
  });

  test("should throw if no role is provided", async () => {
    const userProps = createUserProps({ role: undefined });

    await expect(sut.create(userProps)).rejects.toThrow(
      validationErrors.missingParamError("função")
    );
  });

  test("should throw if invalid role is provided", async () => {
    const userProps = createUserProps({ role: "invalid_role" as UserRole });

    await expect(sut.create(userProps)).rejects.toThrow(
      validationErrors.invalidParamError("função")
    );
  });

  test("should throw if no password is provided", async () => {
    const userProps = createUserProps({ password: undefined });

    await expect(sut.create(userProps)).rejects.toThrow(
      validationErrors.missingParamError("senha")
    );
  });

  test("should throw if password with less than 8 characters is provided", async () => {
    const userProps = createUserProps({ password: "invalid" });

    await expect(sut.create(userProps)).rejects.toThrow(
      validationErrors.invalidParamError("senha")
    );
  });
});
