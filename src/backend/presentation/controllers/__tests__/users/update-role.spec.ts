import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import {
  UpdateRoleValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { HttpResponses } from "@/backend/presentation/helpers";
import { IdValidatorStub } from "@/backend/data/__mocks__";
import { IdValidatorUseCase } from "@/backend/domain/use-cases";
import { UpdateUserRoleController } from "@/backend/presentation/controllers";
import { UpdateUserRoleService } from "@/backend/data/services";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: UpdateUserRoleController;
  idValidator: IdValidatorUseCase;
  httpResponses: HttpResponses;
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
  const updateRoleValidator = new UpdateRoleValidator({
    validationErrors,
  });
  const updateUserRoleService: UpdateUserRoleService =
    new UpdateUserRoleService({
      updateRoleValidator,
      userIdValidator,
      userRepository,
    });
  const httpResponses = new HttpResponses();
  const sut = new UpdateUserRoleController({
    updateUserRoleService,
    httpResponses,
  });

  return {
    sut,
    idValidator,
    httpResponses,
    userRepository,
    validationErrors,
  };
};

describe("UpdateUserRoleController", () => {
  let sut: UpdateUserRoleController;
  let idValidator: IdValidatorUseCase;
  let httpResponses: HttpResponses;
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
    httpResponses = sutInstance.httpResponses;
    userRepository = sutInstance.userRepository;
    validationErrors = sutInstance.validationErrors;
  });

  test("should return 200 if user role was updated", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    const httpRequest: HttpRequest = {
      body: { role: "administrador" },
      dynamicParams: { id: user?.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(204);
    expect(httpResponse).toEqual(httpResponses.noContent());
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
});
