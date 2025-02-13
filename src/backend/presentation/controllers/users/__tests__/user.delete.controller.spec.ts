import { ErrorsValidation } from "@/backend/data/shared/errors";
import { HttpRequest } from "@/backend/presentation/protocols";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { IdValidatorStub } from "@/backend/__mocks__";
import { IdValidatorUseCase } from "@/backend/domain/use-cases";
import { UserDeleteController } from "@/backend/presentation/controllers";
import { UserDeleteService } from "@/backend/data/services";
import { UserIdValidator } from "@/backend/data/use-cases";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: UserDeleteController;
  idValidator: IdValidatorUseCase;
  httpResponsesHelper: HttpResponsesHelper;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidation;
}

/**
 * Testes do controller de remoção de usuário
 */
describe("UserDeleteController", () => {
  let sut: UserDeleteController;
  let idValidator: IdValidatorUseCase;
  let httpResponsesHelper: HttpResponsesHelper;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidation;

  /**
   * Cria uma instância do controller e suas dependências para os testes
   */
  const makeSut = (): SutTypes => {
    const idValidator = new IdValidatorStub();
    const userRepository = new UserRepositoryInMemory();
    const errorsValidation = new ErrorsValidation();

    const userIdValidator = new UserIdValidator({
      idValidator,
      userRepository,
      errorsValidation,
    });

    const userDeleteService = new UserDeleteService({
      userIdValidator,
      userRepository,
    });

    const httpResponsesHelper = new HttpResponsesHelper();
    const sut = new UserDeleteController({
      userDeleteService,
      httpResponsesHelper,
    });

    return {
      sut,
      idValidator,
      httpResponsesHelper,
      userRepository,
      errorsValidation,
    };
  };

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    idValidator = sutInstance.idValidator;
    httpResponsesHelper = sutInstance.httpResponsesHelper;
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
   * Testa a remoção bem-sucedida de usuário
   */
  test("should return 204 if user was deleted", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest = {
      body: {},
      dynamicParams: { id: user?.id },
    };

    await expect(sut.handle(httpRequest)).resolves.toEqual(
      httpResponsesHelper.noContent()
    );
  });

  /**
   * Testa a validação de id obrigatório
   */
  test("should return 400 if no id is provided", async () => {
    const httpRequest: HttpRequest = {
      body: {},
      dynamicParams: {},
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("id").message
    );
  });

  /**
   * Testa a validação de formato de id
   */
  test("should return 400 if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest = {
      body: {},
      dynamicParams: { id: "invalid_id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("id").message
    );
  });

  /**
   * Testa a validação de id não registrado
   */
  test("should return 404 if unregistered id is provided", async () => {
    await userRepository.create(createUserProps());

    const httpRequest: HttpRequest = {
      body: {},
      dynamicParams: { id: "unregistered_id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body.error).toBe(
      errorsValidation.unregisteredError("id").message
    );
  });

  /**
   * Testa o tratamento de erro inesperado
   */
  test("should return 500 on unexpected error", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    jest.spyOn(userRepository, "delete").mockRejectedValue(new Error());

    const httpRequest: HttpRequest = {
      body: {},
      dynamicParams: { id: user?.id },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toBe(
      httpResponsesHelper.serverError().body.error
    );
  });
});
