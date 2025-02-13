import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import {
  UserIdValidator,
  UserUpdateRoleValidator,
} from "@/backend/data/use-cases";
import { UserProps, UserRole } from "@/backend/domain/entities";
import { ErrorsValidation } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { IdValidatorStub } from "@/backend/__mocks__";
import { IdValidatorUseCase } from "@/backend/domain/use-cases";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { UserUpdateRoleController } from "@/backend/presentation/controllers";
import { UserUpdateRoleService } from "@/backend/data/services";

/**
 * Interface que define os tipos necessários para os testes
 */
interface SutTypes {
  sut: UserUpdateRoleController;
  idValidator: IdValidatorUseCase;
  httpResponsesHelper: HttpResponsesHelper;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidation;
  userUpdateRoleService: UserUpdateRoleService;
}

/**
 * Cria uma instância do sistema em teste e suas dependências
 * @returns Objeto contendo o sistema em teste e suas dependências
 */
const makeSut = (): SutTypes => {
  const idValidator: IdValidatorUseCase = new IdValidatorStub();
  const userRepository: UserRepository = new UserRepositoryInMemory();
  const errorsValidation = new ErrorsValidation();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    errorsValidation,
  });
  const updateRoleValidator = new UserUpdateRoleValidator({
    errorsValidation,
  });
  const userUpdateRoleService = new UserUpdateRoleService({
    updateRoleValidator,
    userIdValidator,
    userRepository,
  });
  const httpResponsesHelper = new HttpResponsesHelper();
  const sut = new UserUpdateRoleController({
    userUpdateRoleService,
    httpResponsesHelper,
  });

  return {
    sut,
    idValidator,
    httpResponsesHelper,
    userRepository,
    errorsValidation,
    userUpdateRoleService,
  };
};

describe("UserUpdateRoleController", () => {
  let sut: UserUpdateRoleController;
  let idValidator: IdValidatorUseCase;
  let httpResponsesHelper: HttpResponsesHelper;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidation;
  let userUpdateRoleService: UserUpdateRoleService;

  /**
   * Cria propriedades padrão para um usuário
   * @param overrides - Propriedades opcionais para sobrescrever os valores padrão
   * @returns Propriedades do usuário
   */
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
    idValidator = sutInstance.idValidator;
    httpResponsesHelper = sutInstance.httpResponsesHelper;
    userRepository = sutInstance.userRepository;
    errorsValidation = sutInstance.errorsValidation;
    userUpdateRoleService = sutInstance.userUpdateRoleService;
  });

  /**
   * Testa o cenário de sucesso na atualização do papel do usuário
   */
  test("should return 204 if user role was updated", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<{ role: UserRole }> = {
      body: { role: "administrador" },
      dynamicParams: { id: user?.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(204);
    expect(httpResponse).toEqual(httpResponsesHelper.noContent());
  });

  /**
   * Testa o cenário de erro quando nenhum ID é fornecido
   */
  test("should return 400 if no id is provided", async () => {
    const httpRequest: HttpRequest<{ role: UserRole }> = {
      body: { role: "administrador" },
      dynamicParams: {},
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.missingParamError("id").message
    );
  });

  /**
   * Testa o cenário de erro quando um ID inválido é fornecido
   */
  test("should return 400 if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest<{ role: UserRole }> = {
      body: { role: "administrador" },
      dynamicParams: { id: "invalid-id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      errorsValidation.invalidParamError("id").message
    );
  });

  /**
   * Testa o cenário de erro quando um ID não registrado é fornecido
   */
  test("should return 404 if unregistered id is provided", async () => {
    await userRepository.create(createUserProps());

    const httpRequest: HttpRequest<{ role: UserRole }> = {
      body: { role: "administrador" },
      dynamicParams: { id: "unregistered-id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body.error).toBe(
      errorsValidation.unregisteredError("id").message
    );
  });

  /**
   * Testa o cenário de erro quando nenhum papel é fornecido
   */
  test("should return 400 if no user role is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<{ role: UserRole }> = {
      // @ts-expect-error teste
      body: {},
      dynamicParams: { id: user?.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      errorsValidation.missingParamError("função").message
    );
  });

  /**
   * Testa o cenário de erro quando um papel inválido é fornecido
   */
  test("should return 400 if invalid user role is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<{ role: UserRole }> = {
      body: { role: "invalid-role" as UserRole },
      dynamicParams: { id: user?.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      errorsValidation.invalidParamError("função").message
    );
  });

  /**
   * Testa o cenário de erro interno do servidor
   */
  test("should return 500 when unknown error occurs", async () => {
    jest
      .spyOn(userUpdateRoleService, "updateRole")
      .mockRejectedValueOnce(new Error("server_error"));

    const httpRequest: HttpRequest<{ role: UserRole }> = {
      body: { role: "administrador" },
      dynamicParams: { id: "any_id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toEqual(
      httpResponsesHelper.serverError().body.error
    );
  });
});
