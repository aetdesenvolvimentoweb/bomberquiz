import { DeleteUserController } from "@/backend/presentation/controllers";
import { ErrorsValidation } from "@/backend/data/shared/errors";
import { HttpRequest } from "@/backend/presentation/protocols";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { IdValidatorStub } from "@/backend/__mocks__";
import { IdValidatorUseCase } from "@/backend/domain/use-cases";
import { UserDeleteService } from "@/backend/data/services";
import { UserIdValidator } from "@/backend/data/use-cases";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";

interface SutTypes {
  sut: DeleteUserController;
  idValidator: IdValidatorUseCase;
  httpResponsesHelper: HttpResponsesHelper;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidation;
}

const makeSut = (): SutTypes => {
  const idValidator: IdValidatorUseCase = new IdValidatorStub();
  const userRepository: UserRepository = new UserRepositoryInMemory();
  const errorsValidation = new ErrorsValidation();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    errorsValidation,
  });
  const userDeleteService: UserDeleteService = new UserDeleteService({
    userIdValidator,
    userRepository,
  });
  const httpResponsesHelper = new HttpResponsesHelper();
  const sut = new DeleteUserController({
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

describe("DeleteUserController", () => {
  let sut: DeleteUserController;
  let idValidator: IdValidatorUseCase;
  let httpResponsesHelper: HttpResponsesHelper;
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
    idValidator = sutInstance.idValidator;
    httpResponsesHelper = sutInstance.httpResponsesHelper;
    userRepository = sutInstance.userRepository;
    errorsValidation = sutInstance.errorsValidation;
  });

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
});
