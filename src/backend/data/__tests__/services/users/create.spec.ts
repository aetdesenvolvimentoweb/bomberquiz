import {
  DateValidatorStub,
  EmailValidatorStub,
  PhoneValidatorStub,
} from "@/backend/data/__mocks__";
import {
  DateValidatorUseCase,
  EmailValidatorUseCase,
  PhoneValidatorUseCase,
} from "@/backend/domain/use-cases/validators";
import { UserProps, UserRole } from "@/backend/domain/entities";
import {
  duplicatedKeyError,
  invalidParamError,
  missingParamError,
} from "@/backend/data/helpers";
import { CreateUserService } from "@/backend/data/services/users";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { UserValidator } from "@/backend/data/validators/user";

interface SutTypes {
  sut: CreateUserService;
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  phoneValidator: PhoneValidatorUseCase;
  userRepository: UserRepository;
}

const makeSut = (): SutTypes => {
  const dateValidator = new DateValidatorStub();
  const emailValidator = new EmailValidatorStub();
  const phoneValidator = new PhoneValidatorStub();
  const userRepository: UserRepository = new UserRepositoryInMemory();
  const userValidator: UserValidator = new UserValidator({
    userRepository,
    dateValidator: dateValidator,
    emailValidator: emailValidator,
    phoneValidator: phoneValidator,
  });
  const sut = new CreateUserService({
    userRepository,
    userValidator,
  });

  return {
    sut,
    dateValidator,
    emailValidator,
    phoneValidator,
    userRepository,
  };
};

describe("CreateUserService", () => {
  let sut: CreateUserService;
  let dateValidator: DateValidatorUseCase;
  let emailValidator: EmailValidatorUseCase;
  let phoneValidator: PhoneValidatorUseCase;
  let userRepository: UserRepository;

  beforeEach(() => {
    const sutTypes = makeSut();
    sut = sutTypes.sut;
    dateValidator = sutTypes.dateValidator;
    emailValidator = sutTypes.emailValidator;
    phoneValidator = sutTypes.phoneValidator;
    userRepository = sutTypes.userRepository;
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

    await expect(sut.create(userProps)).resolves.not.toThrow();
  });

  test("should throw if no name is provided", async () => {
    const userProps = createUserProps({ name: undefined });

    await expect(sut.create(userProps)).rejects.toThrow(
      missingParamError("nome")
    );
  });

  test("should throw if no email is provided", async () => {
    const userProps = createUserProps({ email: undefined });

    await expect(sut.create(userProps)).rejects.toThrow(
      missingParamError("email")
    );
  });

  test("should throw if invalid email is provided", async () => {
    const userProps = createUserProps({ email: "invalid_email" });

    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);

    await expect(sut.create(userProps)).rejects.toThrow(
      invalidParamError("email")
    );
  });

  test("should throw if already registered email is provided", async () => {
    const userProps = createUserProps();

    await userRepository.create(userProps);

    await expect(sut.create(userProps)).rejects.toThrow(
      duplicatedKeyError({ entity: "usuário", key: "email" })
    );
  });

  test("should throw if no phone is provided", async () => {
    const userProps = createUserProps({ phone: undefined });

    await expect(sut.create(userProps)).rejects.toThrow(
      missingParamError("telefone")
    );
  });

  test("should throw if invalid phone is provided", async () => {
    const userProps = createUserProps({ phone: "invalid_phone" });

    jest.spyOn(phoneValidator, "isValid").mockReturnValue(false);

    await expect(sut.create(userProps)).rejects.toThrow(
      invalidParamError("telefone")
    );
  });

  test("should throw if no birthdate is provided", async () => {
    const userProps = createUserProps({ birthdate: undefined });

    await expect(sut.create(userProps)).rejects.toThrow(
      missingParamError("data de nascimento")
    );
  });

  test("should throw if invalid birthdate is provided", async () => {
    const userProps = createUserProps();

    jest.spyOn(dateValidator, "isValid").mockReturnValue(false);

    await expect(sut.create(userProps)).rejects.toThrow(
      invalidParamError("data de nascimento")
    );
  });

  test("should throw if no role is provided", async () => {
    const userProps = createUserProps({ role: undefined });

    await expect(sut.create(userProps)).rejects.toThrow(
      missingParamError("função")
    );
  });

  test("should throw if invalid role is provided", async () => {
    const userProps = createUserProps({ role: "invalid_role" as UserRole });

    await expect(sut.create(userProps)).rejects.toThrow(
      invalidParamError("função")
    );
  });

  test("should throw if no password is provided", async () => {
    const userProps = createUserProps({ password: undefined });

    await expect(sut.create(userProps)).rejects.toThrow(
      missingParamError("senha")
    );
  });

  test("should throw if password with less than 8 characters is provided", async () => {
    const userProps = createUserProps({ password: "invalid" });

    await expect(sut.create(userProps)).rejects.toThrow(
      invalidParamError("senha")
    );
  });
});
