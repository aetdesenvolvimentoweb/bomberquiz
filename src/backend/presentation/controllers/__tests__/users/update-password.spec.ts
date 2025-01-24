import { EncrypterStub, IdValidatorStub } from "@/backend/data/__mocks__";
import {
  EncrypterUseCase,
  IdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import {
  UpdatePasswordPropsValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { UpdateUserPasswordProps, UserProps } from "@/backend/domain/entities";
import { HttpResponses } from "@/backend/presentation/helpers";
import { UpdateUserPasswordController } from "@/backend/presentation/controllers";
import { UpdateUserPasswordService } from "@/backend/data/services";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: UpdateUserPasswordController;
  encrypter: EncrypterUseCase;
  idValidator: IdValidatorUseCase;
  httpResponses: HttpResponses;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const encrypter = new EncrypterStub();
  const idValidator: IdValidatorUseCase = new IdValidatorStub();
  const userRepository: UserRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  const updatePasswordPropsValidator = new UpdatePasswordPropsValidator({
    encrypter,
    userRepository,
    validationErrors,
  });
  const updateUserPasswordService: UpdateUserPasswordService =
    new UpdateUserPasswordService({
      updatePasswordPropsValidator,
      userIdValidator,
      userRepository,
    });
  const httpResponses = new HttpResponses();
  const sut = new UpdateUserPasswordController({
    updateUserPasswordService,
    httpResponses,
  });

  return {
    sut,
    encrypter,
    idValidator,
    httpResponses,
    userRepository,
    validationErrors,
  };
};

describe("UpdateUserPasswordController", () => {
  let sut: UpdateUserPasswordController;
  let encrypter: EncrypterUseCase;
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
    encrypter = sutInstance.encrypter;
    idValidator = sutInstance.idValidator;
    httpResponses = sutInstance.httpResponses;
    userRepository = sutInstance.userRepository;
    validationErrors = sutInstance.validationErrors;
  });

  test("should return 204 if user password was updated", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: {
        id: user!.id,
        oldPassword: "any_password",
        newPassword: "new_password",
      },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(204);
    expect(httpResponse).toEqual(httpResponses.noContent());
  });

  test("should return 400 if no id is provided", async () => {
    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      // @ts-expect-error teste
      body: { oldPassword: "any_password", newPassword: "new_password" },
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

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: {
        id: "invalid_id",
        oldPassword: "any_password",
        newPassword: "new_password",
      },
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

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: {
        id: "unregistered_id",
        oldPassword: "any_password",
        newPassword: "new_password",
      },
      dynamicParams: { id: "unregistered_id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body.error).toBe(
      validationErrors.unregisteredError("id").message
    );
  });

  test("should return 400 if no old password is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      // @ts-expect-error teste
      body: { id: user!.id, newPassword: "new_password" },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      validationErrors.missingParamError("senha atual").message
    );
  });

  test("should return 400 if invalid old password is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: {
        id: user!.id,
        oldPassword: "invalid",
        newPassword: "new_password",
      },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      validationErrors.invalidParamError("senha atual").message
    );
  });

  test("should return 401 if wrong old password is provided", async () => {
    jest
      .spyOn(encrypter, "verify")
      .mockReturnValue(new Promise((resolve) => resolve(false)));
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: {
        id: user!.id,
        oldPassword: "wrong_password",
        newPassword: "new_password",
      },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body.error).toEqual(
      validationErrors.wrongPasswordError("senha atual").message
    );
  });

  test("should return 400 if no new password is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      // @ts-expect-error teste
      body: { id: user!.id, oldPassword: "any_password" },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      validationErrors.missingParamError("nova senha").message
    );
  });

  test("should return 400 if invalid new password is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: {
        id: user!.id,
        oldPassword: "any_password",
        newPassword: "invalid",
      },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      validationErrors.invalidParamError("nova senha").message
    );
  });
});
