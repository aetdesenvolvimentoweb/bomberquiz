import {
  AuthRepositoryInMemory,
  UserRepositoryInMemory,
} from "@/backend/infra/in-memory-repositories";
import { EmailValidatorStub, EncrypterStub } from "@/backend/data/__mocks__";
import {
  EmailValidatorUseCase,
  EncrypterUseCase,
  LoginValidatorUseCase,
} from "@/backend/domain/use-cases";
import { LoginProps, UserLogged, UserProps } from "@/backend/domain/entities";
import { LoginService } from "@/backend/data/services";
import { LoginValidator } from "@/backend/data/validators";
import { UserRepository } from "@/backend/data/repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: LoginService;
  emailValidator: EmailValidatorUseCase;
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const encrypter = new EncrypterStub();
  const emailValidator = new EmailValidatorStub();
  const userRepository = new UserRepositoryInMemory();
  const authRepository = new AuthRepositoryInMemory(userRepository);
  const validationErrors = new ValidationErrors();
  const loginValidator: LoginValidatorUseCase = new LoginValidator({
    authRepository,
    emailValidator,
    validationErrors,
  });
  const sut = new LoginService({
    authRepository,
    loginValidator,
  });

  return {
    sut,
    emailValidator,
    encrypter,
    userRepository,
    validationErrors,
  };
};

describe("LoginService", () => {
  let sut: LoginService;
  let emailValidator: EmailValidatorUseCase;
  let encrypter: EncrypterUseCase;
  let userRepository: UserRepository;
  let validationErrors: ValidationErrors;
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

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    emailValidator = sutInstance.emailValidator;
    encrypter = sutInstance.encrypter;
    userRepository = sutInstance.userRepository;
    validationErrors = sutInstance.validationErrors;
  });

  test("should login", async () => {
    const hashedPassword = await encrypter.encrypt(createUserProps().password);
    await userRepository.create(createUserProps({ password: hashedPassword }));

    await expect(
      sut.login({
        email: createUserProps().email,
        password: createUserProps().password,
      } as LoginProps)
    ).resolves.not.toThrow();
  });

  test("should return user logged", async () => {
    const hashedPassword = await encrypter.encrypt(createUserProps().password);
    await userRepository.create(createUserProps({ password: hashedPassword }));

    const userLogged: UserLogged | null = await sut.login({
      email: createUserProps().email,
      password: createUserProps().password,
    } as LoginProps);

    expect(userLogged).not.toBeNull();
    expect(userLogged).toHaveProperty("id");
    expect(userLogged?.email).toEqual(createUserProps().email);
    expect(userLogged?.name).toEqual(createUserProps().name);
    expect(userLogged?.role).toEqual(createUserProps().role);
    expect(userLogged).not.toHaveProperty("password");
  });

  test("should throws if no email is provided", async () => {
    const hashedPassword = await encrypter.encrypt(createUserProps().password);
    await userRepository.create(createUserProps({ password: hashedPassword }));

    await expect(
      sut.login({ password: createUserProps().password } as LoginProps)
    ).rejects.toThrow(validationErrors.missingParamError("email"));
  });

  test("should throws if invalid email is provided", async () => {
    const hashedPassword = await encrypter.encrypt(createUserProps().password);
    await userRepository.create(createUserProps({ password: hashedPassword }));

    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);

    await expect(
      sut.login({
        email: "invalid-email",
        password: createUserProps().password,
      } as LoginProps)
    ).rejects.toThrow(validationErrors.invalidParamError("email"));
  });

  test("should throws if no password is provided", async () => {
    const hashedPassword = await encrypter.encrypt(createUserProps().password);
    await userRepository.create(createUserProps({ password: hashedPassword }));

    await expect(
      sut.login({ email: createUserProps().email } as LoginProps)
    ).rejects.toThrow(validationErrors.missingParamError("senha"));
  });

  test("should throws if invalid password is provided", async () => {
    const hashedPassword = await encrypter.encrypt(createUserProps().password);
    await userRepository.create(createUserProps({ password: hashedPassword }));

    await expect(
      sut.login({
        email: createUserProps().email,
        // less than 8 characters = invalid password
        password: "invalid",
      } as LoginProps)
    ).rejects.toThrow(validationErrors.invalidParamError("senha"));
  });
});
