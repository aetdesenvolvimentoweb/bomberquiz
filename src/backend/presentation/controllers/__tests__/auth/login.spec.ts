import { AuthRepository, UserRepository } from "@/backend/data/repositories";
import {
  AuthRepositoryInMemory,
  UserRepositoryInMemory,
} from "@/backend/infra/in-memory-repositories";
import {
  EmailValidatorStub,
  EncrypterStub,
  TokenHandlerStub,
} from "@/backend/data/__mocks__";
import {
  EmailValidatorUseCase,
  EncrypterUseCase,
  LoginValidatorUseCase,
} from "@/backend/domain/use-cases";
import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import { LoginProps, UserLogged, UserProps } from "@/backend/domain/entities";
import { HttpResponses } from "@/backend/presentation/helpers";
import { LoginController } from "@/backend/presentation/controllers";
import { LoginService } from "@/backend/data/services";
import { LoginValidator } from "@/backend/data/validators";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: LoginController;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const userRepository: UserRepository = new UserRepositoryInMemory();
  const authRepository: AuthRepository = new AuthRepositoryInMemory(
    userRepository
  );
  const emailValidator: EmailValidatorUseCase = new EmailValidatorStub();
  const encrypter: EncrypterUseCase = new EncrypterStub();
  const validationErrors = new ValidationErrors();
  const loginValidator: LoginValidatorUseCase = new LoginValidator({
    authRepository,
    emailValidator,
    encrypter,
    validationErrors,
  });
  const httpResponses = new HttpResponses();
  const tokenHandler = new TokenHandlerStub();
  const loginService: LoginService = new LoginService({
    loginValidator,
    tokenHandler,
  });
  const sut = new LoginController({
    httpResponses,
    loginService,
  });

  return { sut, userRepository, validationErrors };
};

describe("LoginController", () => {
  let sut: LoginController;
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

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userRepository = sutInstance.userRepository;
    validationErrors = sutInstance.validationErrors;
  });

  test("should return 204 if user logged", async () => {
    await userRepository.create(createUserProps());

    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        email: createUserProps().email,
        password: createUserProps().password,
      } as LoginProps,
    };

    const httpResponse: HttpResponse<UserLogged> =
      await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(204);
  });

  test("should return 400 on missing param email", async () => {
    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        password: createUserProps().password,
      } as LoginProps,
    };

    const httpResponse: HttpResponse<UserLogged> =
      await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.missingParamError("email").message
    );
  });

  test("should return 400 on missing param password", async () => {
    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        email: createUserProps().email,
      } as LoginProps,
    };

    const httpResponse: HttpResponse<UserLogged> =
      await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.missingParamError("senha").message
    );
  });
});