import { EncrypterStub, IdValidatorStub } from "@/backend/__mocks__";
import {
  EncrypterUseCase,
  IdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import { UpdateUserPasswordProps, UserProps } from "@/backend/domain/entities";
import {
  UserIdValidator,
  UserUpdatePasswordPropsValidator,
} from "@/backend/data/use-cases";
import { ErrorsValidation } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "@/backend/presentation/helpers";
import { UpdateUserPasswordController } from "@/backend/presentation/controllers";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { UserUpdatePasswordService } from "@/backend/data/services";

interface SutTypes {
  sut: UpdateUserPasswordController;
  encrypter: EncrypterUseCase;
  idValidator: IdValidatorUseCase;
  httpResponsesHelper: HttpResponsesHelper;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidation;
}

const makeSut = (): SutTypes => {
  const encrypter = new EncrypterStub();
  const idValidator: IdValidatorUseCase = new IdValidatorStub();
  const userRepository: UserRepository = new UserRepositoryInMemory();
  const errorsValidation = new ErrorsValidation();
  const userIdValidator = new UserIdValidator({
    idValidator,
    userRepository,
    errorsValidation,
  });
  const updatePasswordPropsValidator = new UserUpdatePasswordPropsValidator({
    encrypter,
    userRepository,
    errorsValidation,
  });
  const userUpdatePasswordService: UserUpdatePasswordService =
    new UserUpdatePasswordService({
      encrypter,
      updatePasswordPropsValidator,
      userIdValidator,
      userRepository,
    });
  const httpResponsesHelper = new HttpResponsesHelper();
  const sut = new UpdateUserPasswordController({
    userUpdatePasswordService,
    httpResponsesHelper,
  });

  return {
    sut,
    encrypter,
    idValidator,
    httpResponsesHelper,
    userRepository,
    errorsValidation,
  };
};

describe("UpdateUserPasswordController", () => {
  let sut: UpdateUserPasswordController;
  let encrypter: EncrypterUseCase;
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
    encrypter = sutInstance.encrypter;
    idValidator = sutInstance.idValidator;
    httpResponsesHelper = sutInstance.httpResponsesHelper;
    userRepository = sutInstance.userRepository;
    errorsValidation = sutInstance.errorsValidation;
  });

  test("should return 204 if user password was updated", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: {
        oldPassword: "any_password",
        newPassword: "new_password",
      } as UpdateUserPasswordProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(204);
    expect(httpResponse).toEqual(httpResponsesHelper.noContent());
  });

  test("should return 400 if no id is provided", async () => {
    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: {
        oldPassword: "any_password",
        newPassword: "new_password",
      } as UpdateUserPasswordProps,
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

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: {
        oldPassword: "any_password",
        newPassword: "new_password",
      } as UpdateUserPasswordProps,
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

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: {
        oldPassword: "any_password",
        newPassword: "new_password",
      } as UpdateUserPasswordProps,
      dynamicParams: { id: "unregistered_id" },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body.error).toBe(
      errorsValidation.unregisteredError("id").message
    );
  });

  test("should return 400 if no old password is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: { newPassword: "new_password" } as UpdateUserPasswordProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      errorsValidation.missingParamError("senha atual").message
    );
  });

  test("should return 400 if invalid old password is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: {
        oldPassword: "invalid",
        newPassword: "new_password",
      } as UpdateUserPasswordProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      errorsValidation.invalidParamError("senha atual").message
    );
  });

  test("should return 401 if wrong old password is provided", async () => {
    jest
      .spyOn(encrypter, "verify")
      .mockReturnValue(new Promise((resolve) => resolve(false)));
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: {
        oldPassword: "wrong_password",
        newPassword: "new_password",
      } as UpdateUserPasswordProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body.error).toEqual(
      errorsValidation.wrongPasswordError("senha atual").message
    );
  });

  test("should return 400 if no new password is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: { oldPassword: "any_password" } as UpdateUserPasswordProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      errorsValidation.missingParamError("nova senha").message
    );
  });

  test("should return 400 if invalid new password is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const httpRequest: HttpRequest<UpdateUserPasswordProps> = {
      body: {
        oldPassword: "any_password",
        newPassword: "invalid",
      } as UpdateUserPasswordProps,
      dynamicParams: { id: user!.id },
    };

    const httpResponse: HttpResponse = await sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body.error).toEqual(
      errorsValidation.invalidParamError("nova senha").message
    );
  });
});
