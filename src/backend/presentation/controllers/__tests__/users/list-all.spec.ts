import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import { UserMapped, UserProps } from "@/backend/domain/entities";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { ListAllUsersController } from "@/backend/presentation/controllers";
import { UserFindAllService } from "@/backend/data/services";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";

interface SutTypes {
  sut: ListAllUsersController;
  httpResponsesHelper: HttpResponsesHelper;
  userRepository: UserRepository;
}

const makeSut = (): SutTypes => {
  const userRepository: UserRepository = new UserRepositoryInMemory();
  const userFindAllService: UserFindAllService = new UserFindAllService({
    userRepository,
  });
  const httpResponsesHelper = new HttpResponsesHelper();
  const sut = new ListAllUsersController({
    userFindAllService,
    httpResponsesHelper,
  });

  return {
    sut,
    httpResponsesHelper,
    userRepository,
  };
};

describe("ListAllUsersController", () => {
  let sut: ListAllUsersController;
  let httpResponsesHelper: HttpResponsesHelper;
  let userRepository: UserRepository;

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
  });

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
});
