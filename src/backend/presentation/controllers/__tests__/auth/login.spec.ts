import {
  AuthLoginPropsValidatorUseCase,
  EmailValidatorUseCase,
  EncrypterUseCase,
} from "@/backend/domain/use-cases";
import { AuthRepository, UserRepository } from "@/backend/data/repository";
import {
  AuthRepositoryInMemory,
  UserRepositoryInMemory,
} from "@/backend/infra/in-memory-repositories";
import {
  EmailValidatorStub,
  EncrypterStub,
  TokenHandlerStub,
} from "@/backend/__mocks__";
import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import { LoginProps, UserLogged, UserProps } from "@/backend/domain/entities";
import { AuthLoginService } from "@/backend/data/services";
import { AuthLoginValidator } from "@/backend/data/use-cases";
import { ErrorsValidation } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { LoginController } from "@/backend/presentation/controllers";

interface SutTypes {
  sut: LoginController;
  emailValidator: EmailValidatorUseCase;
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidation;
}

const makeSut = (): SutTypes => {
  const userRepository: UserRepository = new UserRepositoryInMemory();
  const authRepository: AuthRepository = new AuthRepositoryInMemory(
    userRepository
  );
  const emailValidator: EmailValidatorUseCase = new EmailValidatorStub();
  const encrypter: EncrypterUseCase = new EncrypterStub();
  const errorsValidation = new ErrorsValidation();
  const authLoginValidator: AuthLoginPropsValidatorUseCase =
    new AuthLoginValidator({
      authRepository,
      emailValidator,
      encrypter,
      errorsValidation,
    });
  const httpResponsesHelper = new HttpResponsesHelper();
  const authTokenHandler = new TokenHandlerStub();
  const authLoginService: AuthLoginService = new AuthLoginService({
    authLoginValidator,
    authTokenHandler,
  });
  const sut = new LoginController({
    httpResponsesHelper,
    authLoginService,
  });

  return { sut, emailValidator, encrypter, userRepository, errorsValidation };
};

describe("LoginController", () => {
  let sut: LoginController;
  let emailValidator: EmailValidatorUseCase;
  let encrypter: EncrypterUseCase;
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

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    emailValidator = sutInstance.emailValidator;
    encrypter = sutInstance.encrypter;
    userRepository = sutInstance.userRepository;
    errorsValidation = sutInstance.errorsValidation;
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
      errorsValidation.missingParamError("email").message
    );
  });

  test("should return 400 on invalid email", async () => {
    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        email: "invalid_email",
        password: createUserProps().password,
      } as LoginProps,
    };

    const httpResponse: HttpResponse<UserLogged> =
      await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("email").message
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
      errorsValidation.missingParamError("senha").message
    );
  });

  test("should return 400 on invalid password", async () => {
    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        email: createUserProps().email,
        password: "invalid",
      } as LoginProps,
    };

    const httpResponse: HttpResponse<UserLogged> =
      await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("senha").message
    );
  });

  test("should return 401 on unregistered email", async () => {
    await userRepository.create(createUserProps());

    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        email: "unregistered_email",
        password: createUserProps().password,
      } as LoginProps,
    };

    const httpResponse: HttpResponse<UserLogged> =
      await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body.error).toBe(
      errorsValidation.unauthorizedError().message
    );
  });

  test("should return 401 on wrong password", async () => {
    await userRepository.create(createUserProps());
    jest
      .spyOn(encrypter, "verify")
      .mockReturnValue(new Promise((resolve) => resolve(false)));

    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        email: createUserProps().email,
        password: "wrong_password",
      } as LoginProps,
    };

    const httpResponse: HttpResponse<UserLogged> =
      await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body.error).toBe(
      errorsValidation.unauthorizedError().message
    );
  });
});
