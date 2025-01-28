import {
  AuthRepositoryInMemory,
  UserRepositoryInMemory,
} from "@/backend/infra/in-memory-repositories";
import {
  EmailValidatorStub,
  EncrypterStub,
  TokenHandlerStub,
} from "@/backend/__mocks__";
import {
  EmailValidatorUseCase,
  EncrypterUseCase,
  LoginValidatorUseCase,
  TokenHandlerUseCase,
} from "@/backend/domain/use-cases";
import { LoginProps, UserProps } from "@/backend/domain/entities";
import { LoginService } from "@/backend/data/services";
import { LoginValidator } from "@/backend/data/validators";
import { UserRepository } from "@/backend/data/repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: LoginService;
  emailValidator: EmailValidatorUseCase;
  encrypter: EncrypterUseCase;
  tokenHandler: TokenHandlerUseCase;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const emailValidator = new EmailValidatorStub();
  const encrypter = new EncrypterStub();
  const userRepository = new UserRepositoryInMemory();
  const authRepository = new AuthRepositoryInMemory(userRepository);
  const validationErrors = new ValidationErrors();
  const loginValidator: LoginValidatorUseCase = new LoginValidator({
    authRepository,
    emailValidator,
    encrypter,
    validationErrors,
  });
  const tokenHandler = new TokenHandlerStub();
  const sut = new LoginService({
    loginValidator,
    tokenHandler,
  });

  return {
    sut,
    emailValidator,
    encrypter,
    tokenHandler,
    userRepository,
    validationErrors,
  };
};

describe("LoginService", () => {
  let sut: LoginService;
  let emailValidator: EmailValidatorUseCase;
  let encrypter: EncrypterUseCase;
  let tokenHandler: TokenHandlerUseCase;
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
    tokenHandler = sutInstance.tokenHandler;
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

  test("should return a valid jwt token", async () => {
    const hashedPassword = await encrypter.encrypt(createUserProps().password);
    await userRepository.create(createUserProps({ password: hashedPassword }));

    const token: string = await sut.login({
      email: createUserProps().email,
      password: createUserProps().password,
    } as LoginProps);

    expect(token).not.toBeNull();
    expect(tokenHandler.verify(token)).toBeTruthy();
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

  test("should throws if unregistered email is provided", async () => {
    const hashedPassword = await encrypter.encrypt(createUserProps().password);
    await userRepository.create(createUserProps({ password: hashedPassword }));

    await expect(
      sut.login({
        email: "invalid-email",
        password: createUserProps().password,
      } as LoginProps)
    ).rejects.toThrow(validationErrors.unauthorizedError());
  });

  test("should throws if wrong password is provided", async () => {
    const hashedPassword = await encrypter.encrypt(createUserProps().password);
    await userRepository.create(createUserProps({ password: hashedPassword }));

    jest
      .spyOn(encrypter, "verify")
      .mockReturnValue(new Promise((resolve) => resolve(false)));

    await expect(
      sut.login({
        email: createUserProps().email,
        password: "wrong-password",
      } as LoginProps)
    ).rejects.toThrow(validationErrors.unauthorizedError());
  });
});
