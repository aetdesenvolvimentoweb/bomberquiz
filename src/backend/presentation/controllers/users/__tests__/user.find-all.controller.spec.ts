import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import { UserMapped, UserProps } from "@/backend/domain/entities";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UserFindAllController } from "../user.find-all.controller";
import { UserFindAllService } from "@/backend/data/services";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";

/**
 * Interface que define os tipos necessários para os testes
 */
interface SutTypes {
  sut: UserFindAllController;
  httpResponsesHelper: HttpResponsesHelper;
  userRepository: UserRepository;
  userFindAllService: UserFindAllService;
}

/**
 * Cria uma instância do sistema em teste e suas dependências
 * @returns Objeto contendo o sistema em teste e suas dependências
 */
const makeSut = (): SutTypes => {
  const userRepository: UserRepository = new UserRepositoryInMemory();
  const userFindAllService: UserFindAllService = new UserFindAllService({
    userRepository,
  });
  const httpResponsesHelper = new HttpResponsesHelper();
  const sut = new UserFindAllController({
    userFindAllService,
    httpResponsesHelper,
  });

  return {
    sut,
    httpResponsesHelper,
    userRepository,
    userFindAllService,
  };
};

describe("UserFindAllController", () => {
  let sut: UserFindAllController;
  let httpResponsesHelper: HttpResponsesHelper;
  let userRepository: UserRepository;
  let userFindAllService: UserFindAllService;

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
    httpResponsesHelper = sutInstance.httpResponsesHelper;
    userRepository = sutInstance.userRepository;
    userFindAllService = sutInstance.userFindAllService;
  });

  /**
   * Testa o cenário de sucesso na listagem de usuários
   */
  test("should return 200 if users was listed", async () => {
    await userRepository.create(createUserProps());

    const httpRequest: HttpRequest = {
      body: {},
    };

    const httpResponse: HttpResponse<UserMapped[]> =
      await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse).toEqual(
      httpResponsesHelper.ok(httpResponse.body.data)
    );
    expect(httpResponse.body.data?.length).toBe(1);
    expect(httpResponse.body.data?.[0]).toHaveProperty("id");
    expect(httpResponse.body.data?.[0].name).toEqual(createUserProps().name);
    expect(httpResponse.body.data?.[0].email).toEqual(createUserProps().email);
    expect(httpResponse.body.data?.[0].phone).toEqual(createUserProps().phone);
    expect(httpResponse.body.data?.[0].birthdate).toEqual(expect.any(Date));
    expect(httpResponse.body.data?.[0].role).toEqual(createUserProps().role);
    expect(httpResponse.body.data?.[0]).not.toHaveProperty("password");
  });

  /**
   * Testa o cenário de erro interno do servidor
   */
  test("should return 500 when unknown error occurs", async () => {
    jest
      .spyOn(userFindAllService, "findAll")
      .mockRejectedValueOnce(new Error());

    const httpRequest: HttpRequest = { body: {} };
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body.error).toEqual(
      httpResponsesHelper.serverError().body.error
    );
  });
});
