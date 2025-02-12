import {
  AuthRepositoryInMemory,
  UserRepositoryInMemory,
} from "@/backend/infra/in-memory-repositories";
import { EmailValidatorStub, EncrypterStub } from "@/backend/__mocks__";
import {
  EmailValidatorUseCase,
  EncrypterUseCase,
} from "@/backend/domain/use-cases";
import { LoginProps, UserLogged } from "@/backend/domain/entities";
import { AuthLoginValidator } from "../auth.login.validator";
import { AuthRepository } from "@/backend/data/repository";
import { ErrorsValidation } from "@/backend/data/shared";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: AuthLoginValidator;
  emailValidator: EmailValidatorUseCase;
  encrypter: EncrypterUseCase;
  authRepository: AuthRepository;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Testes do validador de login
 */
describe("AuthLoginValidator", () => {
  let sut: AuthLoginValidator;
  let emailValidator: EmailValidatorUseCase;
  let encrypter: EncrypterUseCase;
  let authRepository: AuthRepository;
  let errorsValidation: ErrorsValidationUseCase;

  /**
   * Cria uma instância do validador e suas dependências para os testes
   */
  const makeSut = (): SutTypes => {
    const emailValidator = new EmailValidatorStub();
    const encrypter = new EncrypterStub();
    const userRepository = new UserRepositoryInMemory();
    const authRepository = new AuthRepositoryInMemory(userRepository);
    const errorsValidation = new ErrorsValidation();

    const sut = new AuthLoginValidator({
      authRepository,
      emailValidator,
      encrypter,
      errorsValidation,
    });

    return {
      sut,
      emailValidator,
      encrypter,
      authRepository,
      errorsValidation,
    };
  };

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    emailValidator = sutInstance.emailValidator;
    encrypter = sutInstance.encrypter;
    authRepository = sutInstance.authRepository;
    errorsValidation = sutInstance.errorsValidation;
  });

  /**
   * Cria um objeto com as propriedades de login para os testes
   */
  const createLoginProps = (
    overrides: Partial<LoginProps> = {}
  ): LoginProps => {
    return {
      email: "valid_email",
      password: "valid_password",
      ...overrides,
    };
  };

  /**
   * Testa a validação bem-sucedida de login
   */
  test("should validate login props", async () => {
    const loginProps = createLoginProps();
    const userLogged: UserLogged = {
      id: "valid_id",
      name: "valid_name",
      email: loginProps.email,
      role: "cliente",
      password: "hashed_password",
    };

    jest.spyOn(authRepository, "authorize").mockResolvedValue(userLogged);
    jest.spyOn(encrypter, "verify").mockResolvedValue(true);

    const result = await sut.validateLogin(loginProps);

    expect(result).toEqual({
      id: userLogged.id,
      name: userLogged.name,
      email: userLogged.email,
      role: userLogged.role,
    });
  });

  /**
   * Testa a validação de email obrigatório
   */
  test("should throw if no email is provided", async () => {
    const loginProps = createLoginProps({ email: "" });

    await expect(sut.validateLogin(loginProps)).rejects.toThrow(
      errorsValidation.missingParamError("email")
    );
  });

  /**
   * Testa a validação de formato de email
   */
  test("should throw if invalid email is provided", async () => {
    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);
    const loginProps = createLoginProps();

    await expect(sut.validateLogin(loginProps)).rejects.toThrow(
      errorsValidation.invalidParamError("email")
    );
  });

  /**
   * Testa a validação de senha obrigatória
   */
  test("should throw if no password is provided", async () => {
    const loginProps = createLoginProps({ password: "" });

    await expect(sut.validateLogin(loginProps)).rejects.toThrow(
      errorsValidation.missingParamError("senha")
    );
  });

  /**
   * Testa a validação de tamanho mínimo de senha
   */
  test("should throw if password with less than 8 characters is provided", async () => {
    const loginProps = createLoginProps({ password: "123" });

    await expect(sut.validateLogin(loginProps)).rejects.toThrow(
      errorsValidation.invalidParamError("senha")
    );
  });

  /**
   * Testa a validação de usuário não encontrado
   */
  test("should throw if user is not found", async () => {
    jest.spyOn(authRepository, "authorize").mockResolvedValue(null);
    const loginProps = createLoginProps();

    await expect(sut.validateLogin(loginProps)).rejects.toThrow(
      errorsValidation.unauthorizedError()
    );
  });

  /**
   * Testa a validação de senha incorreta
   */
  test("should throw if wrong password is provided", async () => {
    const loginProps = createLoginProps();
    const userLogged: UserLogged = {
      id: "valid_id",
      name: "valid_name",
      email: loginProps.email,
      role: "cliente",
      password: "hashed_password",
    };

    jest.spyOn(authRepository, "authorize").mockResolvedValue(userLogged);
    jest.spyOn(encrypter, "verify").mockResolvedValue(false);

    await expect(sut.validateLogin(loginProps)).rejects.toThrow(
      errorsValidation.unauthorizedError()
    );
  });
});
