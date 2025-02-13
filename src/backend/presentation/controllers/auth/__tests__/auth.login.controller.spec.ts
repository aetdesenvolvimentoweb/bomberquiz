import {
  AuthLoginPropsValidatorUseCase,
  EmailValidatorUseCase,
  EncrypterUseCase,
} from "@/backend/domain/use-cases";
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
import { AuthLoginController } from "@/backend/presentation/controllers";
import { AuthLoginService } from "@/backend/data/services";
import { AuthLoginValidator } from "@/backend/data/use-cases";
import { ErrorsValidation } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UserRepository } from "@/backend/data/repository";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: AuthLoginController;
  emailValidator: EmailValidatorUseCase;
  encrypter: EncrypterUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidation;
}

/**
 * Testes do controller de autenticação
 */
describe("AuthLoginController", () => {
  let sut: AuthLoginController;
  let emailValidator: EmailValidatorUseCase;
  let encrypter: EncrypterUseCase;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidation;

  /**
   * Cria uma instância do controller e suas dependências para os testes
   */
  const makeSut = (): SutTypes => {
    const userRepository = new UserRepositoryInMemory();
    const authRepository = new AuthRepositoryInMemory(userRepository);
    const emailValidator = new EmailValidatorStub();
    const encrypter = new EncrypterStub();
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

    const authLoginService = new AuthLoginService({
      authLoginValidator,
      authTokenHandler,
    });

    const sut = new AuthLoginController({
      httpResponsesHelper,
      authLoginService,
    });

    return {
      sut,
      emailValidator,
      encrypter,
      userRepository,
      errorsValidation,
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

  /**
   * Cria um objeto com as propriedades padrão de usuário para os testes
   */
  const createUserProps = (overrides: Partial<UserProps> = {}): UserProps => ({
    name: "any_name",
    email: "valid_email",
    phone: "any_phone",
    birthdate: new Date(),
    role: "cliente",
    password: "any_password",
    ...overrides,
  });

  /**
   * Testa o login bem-sucedido
   */
  test("should return 204 if user logged", async () => {
    await userRepository.create(createUserProps());

    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        email: createUserProps().email,
        password: createUserProps().password,
      },
    };

    const httpResponse: HttpResponse<UserLogged> =
      await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(204);
    expect(httpResponse.headers).toHaveProperty("tokenJwt");
  });

  /**
   * Testa a validação de email obrigatório
   */
  test("should return 400 on missing param email", async () => {
    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        password: createUserProps().password,
      } as LoginProps,
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("email").message
    );
  });

  /**
   * Testa a validação de formato de email
   */
  test("should return 400 on invalid email", async () => {
    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        email: "invalid_email",
        password: createUserProps().password,
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("email").message
    );
  });

  /**
   * Testa a validação de senha obrigatória
   */
  test("should return 400 on missing param password", async () => {
    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        email: createUserProps().email,
      } as LoginProps,
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("senha").message
    );
  });

  /**
   * Testa a validação de formato de senha
   */
  test("should return 400 on invalid password", async () => {
    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        email: createUserProps().email,
        password: "invalid",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("senha").message
    );
  });

  /**
   * Testa a validação de email não registrado
   */
  test("should return 401 on unregistered email", async () => {
    await userRepository.create(createUserProps());

    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        email: "unregistered_email",
        password: createUserProps().password,
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body.error).toBe(
      errorsValidation.unauthorizedError().message
    );
  });

  /**
   * Testa a validação de senha incorreta
   */
  test("should return 401 on wrong password", async () => {
    await userRepository.create(createUserProps());
    jest.spyOn(encrypter, "verify").mockResolvedValue(false);

    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        email: createUserProps().email,
        password: "wrong_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body.error).toBe(
      errorsValidation.unauthorizedError().message
    );
  });

  /**
   * Testa o tratamento de erro inesperado
   */
  test("should return 500 on unexpected error", async () => {
    await userRepository.create(createUserProps());
    jest.spyOn(userRepository, "findByEmail").mockRejectedValue(new Error());

    const httpRequest: HttpRequest<LoginProps> = {
      body: {
        email: createUserProps().email,
        password: createUserProps().password,
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe("Erro inesperado no servidor.");
  });
});
