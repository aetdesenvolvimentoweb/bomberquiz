import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import {
  UpdateRoleValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { UserProps, UserRole } from "@/backend/domain/entities";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { IdValidatorStub } from "@/backend/__mocks__";
import { IdValidatorUseCase } from "@/backend/domain/use-cases";
import { UpdateUserRoleController } from "@/backend/presentation/controllers";
import { UpdateUserRoleService } from "@/backend/data/services";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: UpdateUserRoleController;
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
  const updateRoleValidator = new UpdateRoleValidator({
    validationErrors,
  });
  const updateUserRoleService: UpdateUserRoleService =
    new UpdateUserRoleService({
      updateRoleValidator,
      userIdValidator,
      userRepository,
    });
  const httpResponsesHelper = new HttpResponsesHelper();
  const sut = new UpdateUserRoleController({
    updateUserRoleService,
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

describe("UpdateUserRoleController", () => {
  let sut: UpdateUserRoleController;
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

  test("should return 400 if no id is provided", async () => {
    const httpRequest: HttpRequest<{ role: UserRole }> = {
      body: { role: "administrador" },
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

    const httpRequest: HttpRequest<{ role: UserRole }> = {
      body: { role: "administrador" },
      dynamicParams: { id: "invalid-id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toBe(
      validationErrors.invalidParamError("id").message
    );
  });

  test("should return 404 if unregistered id is provided", async () => {
    await userRepository.create(createUserProps());

    const httpRequest: HttpRequest<{ role: UserRole }> = {
      body: { role: "administrador" },
      dynamicParams: { id: "unregistered-id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body.error).toBe(
      validationErrors.unregisteredError("id").message
    );
  });

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
      validationErrors.missingParamError("função").message
    );
  });

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
      validationErrors.invalidParamError("função").message
    );
  });
});
