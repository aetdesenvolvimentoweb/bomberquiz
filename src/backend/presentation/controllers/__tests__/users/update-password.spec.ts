/* eslint-disable @typescript-eslint/no-unused-vars */
import { EncrypterStub, IdValidatorStub } from "@/backend/data/__mocks__";
import { HttpRequest, HttpResponse } from "@/backend/presentation/protocols";
import {
  UpdatePasswordPropsValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { UpdateUserPasswordProps, UserProps } from "@/backend/domain/entities";
import { HttpResponses } from "@/backend/presentation/helpers";
import { IdValidatorUseCase } from "@/backend/domain/use-cases";
import { UpdateUserPasswordController } from "@/backend/presentation/controllers";
import { UpdateUserPasswordService } from "@/backend/data/services";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: UpdateUserPasswordController;
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
    idValidator,
    httpResponses,
    userRepository,
    validationErrors,
  };
};

describe("UpdateUserPasswordController", () => {
  let sut: UpdateUserPasswordController;
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
});