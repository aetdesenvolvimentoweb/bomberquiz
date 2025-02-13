import {
  AuthLoginPropsValidatorUseCase,
  AuthTokenHandlerUseCase,
  EmailValidatorUseCase,
  EncrypterUseCase,
} from "@/backend/domain/use-cases";
import {
  AuthRepositoryInMemory,
  UserRepositoryInMemory,
} from "@/backend/infra/repositories/in-memory";
import {
  EmailValidatorStub,
  EncrypterStub,
  TokenHandlerStub,
} from "@/backend/__mocks__";
import { LoginProps, UserProps } from "@/backend/domain/entities";
import { AuthLoginService } from "@/backend/data/services";
import { AuthLoginValidator } from "@/backend/data/use-cases";
import { ErrorsValidation } from "@/backend/data/shared/errors";
import { UserRepository } from "@/backend/data/repository";

interface SutTypes {
  sut: AuthLoginService;
  emailValidator: EmailValidatorUseCase;
  encrypter: EncrypterUseCase;
  authTokenHandler: AuthTokenHandlerUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidation;
}

const makeSut = (): SutTypes => {
  const emailValidator = new EmailValidatorStub();
  const encrypter = new EncrypterStub();
  const userRepository = new UserRepositoryInMemory();
  const authRepository = new AuthRepositoryInMemory(userRepository);
  const errorsValidation = new ErrorsValidation();
  const authLoginValidator: AuthLoginPropsValidatorUseCase =
    new AuthLoginValidator({
      authRepository,
      emailValidator,
      encrypter,
      errorsValidation,
    });
  const authTokenHandler = new TokenHandlerStub();
  const sut = new AuthLoginService({
    authLoginValidator,
    authTokenHandler,
  });

  return {
    sut,
    emailValidator,
    encrypter,
    authTokenHandler,
    userRepository,
    errorsValidation,
  };
};

describe("AuthLoginService", () => {
  let sut: AuthLoginService;
  let emailValidator: EmailValidatorUseCase;
  let encrypter: EncrypterUseCase;
  let authTokenHandler: AuthTokenHandlerUseCase;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidation;
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
    authTokenHandler = sutInstance.authTokenHandler;
    userRepository = sutInstance.userRepository;
    errorsValidation = sutInstance.errorsValidation;
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
    expect(authTokenHandler.verify(token)).toBeTruthy();
  });

  test("should throws if no email is provided", async () => {
    const hashedPassword = await encrypter.encrypt(createUserProps().password);
    await userRepository.create(createUserProps({ password: hashedPassword }));

    await expect(
      sut.login({ password: createUserProps().password } as LoginProps)
    ).rejects.toThrow(errorsValidation.missingParamError("email"));
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
    ).rejects.toThrow(errorsValidation.invalidParamError("email"));
  });

  test("should throws if no password is provided", async () => {
    const hashedPassword = await encrypter.encrypt(createUserProps().password);
    await userRepository.create(createUserProps({ password: hashedPassword }));

    await expect(
      sut.login({ email: createUserProps().email } as LoginProps)
    ).rejects.toThrow(errorsValidation.missingParamError("senha"));
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
    ).rejects.toThrow(errorsValidation.invalidParamError("senha"));
  });

  test("should throws if unregistered email is provided", async () => {
    const hashedPassword = await encrypter.encrypt(createUserProps().password);
    await userRepository.create(createUserProps({ password: hashedPassword }));

    await expect(
      sut.login({
        email: "invalid-email",
        password: createUserProps().password,
      } as LoginProps)
    ).rejects.toThrow(errorsValidation.unauthorizedError());
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
    ).rejects.toThrow(errorsValidation.unauthorizedError());
  });
});
