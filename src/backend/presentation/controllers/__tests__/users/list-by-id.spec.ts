import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import { UserMapped, UserProps } from "@/backend/domain/entities";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { IdValidatorStub } from "@/backend/__mocks__";
import { IdValidatorUseCase } from "@/backend/domain/use-cases";
import { ListUserByIdController } from "@/backend/presentation/controllers";
import { ListUserByIdService } from "@/backend/data/services";
import { UserIdValidator } from "@/backend/data/validators";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: ListUserByIdController;
  idValidator: IdValidatorUseCase;
  httpResponsesHelper: HttpResponsesHelper;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const idValidator: IdValidatorUseCase = new IdValidatorStub();
  const userRepository: UserRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  const listUserByIdService: ListUserByIdService = new ListUserByIdService({
    userIdValidator,
    userRepository,
  });
  const httpResponsesHelper = new HttpResponsesHelper();
  const sut = new ListUserByIdController({
    listUserByIdService,
    httpResponsesHelper,
  });

  return {
    sut,
    idValidator,
    httpResponsesHelper,
    userRepository,
    validationErrors,
  };
};

describe("ListUserByIdController", () => {
  let sut: ListUserByIdController;
  let idValidator: IdValidatorUseCase;
  let httpResponsesHelper: HttpResponsesHelper;
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
    idValidator = sutInstance.idValidator;
    httpResponsesHelper = sutInstance.httpResponsesHelper;
    userRepository = sutInstance.userRepository;
    validationErrors = sutInstance.validationErrors;
  });

  test("should return 200 if user was listed", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    const httpRequest: HttpRequest = {
      body: {},
      dynamicParams: { id: user?.id },
    };

    const httpResponse: HttpResponse<UserMapped | null> =
      await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse).toEqual(
      httpResponsesHelper.ok(httpResponse.body.data)
    );
    expect(httpResponse.body.data).toHaveProperty("id");
    expect(httpResponse.body.data?.name).toEqual(createUserProps().name);
    expect(httpResponse.body.data?.email).toEqual(createUserProps().email);
    expect(httpResponse.body.data?.phone).toEqual(createUserProps().phone);
    expect(httpResponse.body.data?.birthdate).toEqual(expect.any(Date));
    expect(httpResponse.body.data?.role).toEqual(createUserProps().role);
    expect(httpResponse.body.data).not.toHaveProperty("password");
  });

  test("should return 400 if no id is provided", async () => {
    const httpRequest: HttpRequest = {
      body: {},
      dynamicParams: {},
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.missingParamError("id").message
    );
  });

  test("should return 400 if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    const httpRequest: HttpRequest = {
      body: {},
      dynamicParams: { id: "invalid_id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.invalidParamError("id").message
    );
  });

  test("should return 404 if unregistered id is provided", async () => {
    await userRepository.create(createUserProps());

    const httpRequest: HttpRequest = {
      body: {},
      dynamicParams: { id: "unregistered_id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body.error).toBe(
      validationErrors.unregisteredError("id").message
    );
  });
});
