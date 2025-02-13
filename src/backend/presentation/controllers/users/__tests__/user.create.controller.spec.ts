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
  UserPhoneValidatorUseCase,
} from "@/backend/domain/use-cases";
import { UserProps, UserRole } from "@/backend/domain/entities";
import { ErrorsValidation } from "@/backend/data/shared/errors";
import { HttpRequest } from "@/backend/presentation/protocols";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UserCreateController } from "@/backend/presentation/controllers";
import { UserCreateService } from "@/backend/data/services";
import { UserCreationPropsValidator } from "@/backend/data/use-cases";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/repositories/in-memory";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: UserCreateController;
  dateValidator: DateValidatorUseCase;
  emailValidator: EmailValidatorUseCase;
  httpResponsesHelper: HttpResponsesHelper;
  phoneValidator: UserPhoneValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidation;
}

/**
 * Testes do controller de criação de usuário
 */
describe("UserCreateController", () => {
  let sut: UserCreateController;
  let dateValidator: DateValidatorUseCase;
  let emailValidator: EmailValidatorUseCase;
  let httpResponsesHelper: HttpResponsesHelper;
  let phoneValidator: UserPhoneValidatorUseCase;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidation;

  /**
   * Cria uma instância do controller e suas dependências para os testes
   */
  const makeSut = (): SutTypes => {
    const dateValidator = new DateValidatorStub();
    const emailValidator = new EmailValidatorStub();
    const encrypter: EncrypterUseCase = new EncrypterStub();
    const phoneValidator = new PhoneValidatorStub();
    const userRepository = new UserRepositoryInMemory();
    const errorsValidation = new ErrorsValidation();

    const userCreationPropsValidator = new UserCreationPropsValidator({
      dateValidator,
      emailValidator,
      phoneValidator,
      userRepository,
      errorsValidation,
    });

    const userCreateService = new UserCreateService({
      encrypter,
      userRepository,
      userCreationPropsValidator,
    });

    const httpResponsesHelper = new HttpResponsesHelper();
    const sut = new UserCreateController({
      userCreateService,
      httpResponsesHelper,
    });

    return {
      sut,
      dateValidator,
      emailValidator,
      httpResponsesHelper,
      phoneValidator,
      userRepository,
      errorsValidation,
    };
  };

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    dateValidator = sutInstance.dateValidator;
    emailValidator = sutInstance.emailValidator;
    httpResponsesHelper = sutInstance.httpResponsesHelper;
    phoneValidator = sutInstance.phoneValidator;
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
   * Testa a criação bem-sucedida de usuário
   */
  test("should return 201 if user was created", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps(),
    };

    await expect(sut.handle(httpRequest)).resolves.toEqual(
      httpResponsesHelper.created()
    );
  });

  /**
   * Testa a validação de nome obrigatório
   */
  test("should return 400 if no name is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ name: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("nome").message
    );
  });

  /**
   * Testa a validação de email obrigatório
   */
  test("should return 400 if no email is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ email: undefined }),
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
  test("should return 400 if invalid email is provided", async () => {
    jest.spyOn(emailValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ email: "invalid_email" }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("email").message
    );
  });

  /**
   * Testa a validação de email já registrado
   */
  test("should return 400 if already registered email is provided", async () => {
    await userRepository.create(createUserProps());

    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps(),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.duplicatedKeyError({ entity: "usuário", key: "email" })
        .message
    );
  });

  /**
   * Testa a validação de telefone obrigatório
   */
  test("should return 400 if no phone is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ phone: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("telefone").message
    );
  });

  /**
   * Testa a validação de formato de telefone
   */
  test("should return 400 if invalid phone is provided", async () => {
    jest.spyOn(phoneValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ phone: "invalid_phone" }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("telefone").message
    );
  });

  /**
   * Testa a validação de data de nascimento obrigatória
   */
  test("should return 400 if no birthdate is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ birthdate: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("data de nascimento").message
    );
  });

  /**
   * Testa a validação de data de nascimento inválida
   */
  test("should return 400 if invalid birthdate is provided", async () => {
    jest.spyOn(dateValidator, "isAdult").mockReturnValue(false);

    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ birthdate: new Date("invalid_birthdate") }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("data de nascimento").message
    );
  });

  /**
   * Testa a validação de papel obrigatório
   */
  test("should return 400 if no role is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ role: undefined }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("função").message
    );
  });

  /**
   * Testa a validação de papel inválido
   */
  test("should return 400 if invalid role is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ role: "invalid_role" as UserRole }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("função").message
    );
  });

  /**
   * Testa a validação de senha obrigatória
   */
  test("should return 400 if no password is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ password: undefined }),
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
  test("should return 400 if invalid password is provided", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps({ password: "invalid" }),
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("senha").message
    );
  });

  /**
   * Testa o tratamento de erro inesperado
   */
  test("should return 500 on unexpected error", async () => {
    const httpRequest: HttpRequest<UserProps> = {
      body: createUserProps(),
    };

    jest.spyOn(userRepository, "create").mockRejectedValue(new Error());

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe(
      httpResponsesHelper.serverError().body.error
    );
  });
});
