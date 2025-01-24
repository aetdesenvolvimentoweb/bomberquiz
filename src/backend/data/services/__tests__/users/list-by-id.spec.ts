import {
  IdValidatorUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { IdValidatorStub } from "@/backend/data/__mocks__";
import { ListUserByIdService } from "@/backend/data/services";
import { UserIdValidator } from "@/backend/data/validators";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: ListUserByIdService;
  idValidator: IdValidatorUseCase;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const idValidator = new IdValidatorStub();
  const userRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const userIdValidator: UserIdValidatorUseCase = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  const sut = new ListUserByIdService({
    userRepository,
    userIdValidator,
  });

  return {
    sut,
    idValidator,
    userRepository,
    validationErrors,
  };
};

describe("ListUserByIdService", () => {
  let sut: ListUserByIdService;
  let idValidator: IdValidatorUseCase;
  let userRepository: UserRepository;
  let validationErrors: ValidationErrors;
  const createUserProps: UserProps = {
    name: "any_name",
    email: "valid_email",
    phone: "any_phone",
    birthdate: new Date(),
    role: "cliente",
    password: "any_password",
  };

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    idValidator = sutInstance.idValidator;
    userRepository = sutInstance.userRepository;
    validationErrors = sutInstance.validationErrors;
  });

  test("should list a user by id", async () => {
    await userRepository.create(createUserProps);
    const user = await userRepository.listByEmail(createUserProps.email);

    await expect(sut.listById(user!.id)).resolves.not.toThrow();
  });

  test("should list a user by id with correct data", async () => {
    await userRepository.create(createUserProps);
    const user = await userRepository.listByEmail(createUserProps.email);

    const userListed = await sut.listById(user!.id);

    expect(userListed).not.toBeNull();
    expect(userListed?.id).toEqual(user!.id);
    expect(userListed?.name).toEqual(createUserProps.name);
    expect(userListed?.email).toEqual(createUserProps.email);
    expect(userListed?.phone).toEqual(createUserProps.phone);
    expect(userListed?.birthdate).toEqual(createUserProps.birthdate);
    expect(userListed?.role).toEqual(createUserProps.role);
    expect(userListed).not.toHaveProperty("password");
  });

  test("should throw if no id is provided", async () => {
    await expect(sut.listById("")).rejects.toThrow(
      validationErrors.missingParamError("id")
    );
  });

  test("should throw if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    await expect(sut.listById("invalid-id")).rejects.toThrow(
      validationErrors.invalidParamError("id")
    );
  });

  test("should throw if unregistered id is provided", async () => {
    await expect(sut.listById("valid-id")).rejects.toThrow(
      validationErrors.unregisteredError("id")
    );
  });
});
