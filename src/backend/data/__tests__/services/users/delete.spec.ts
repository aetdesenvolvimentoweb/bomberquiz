import {
  IdValidatorUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { DeleteUserService } from "@/backend/data/services";
import { IdValidatorStub } from "@/backend/data/__mocks__";
import { UserIdValidator } from "@/backend/data/validators";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: DeleteUserService;
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
  const sut = new DeleteUserService({
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

describe("DeleteUserService", () => {
  let sut: DeleteUserService;
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

  test("should delete a user", async () => {
    await userRepository.create(createUserProps);
    const user = await userRepository.listByEmail(createUserProps.email);

    await expect(sut.delete(user!.id)).resolves.not.toThrow();
  });

  test("should throw if no id is provided", async () => {
    await expect(sut.delete("")).rejects.toThrow(
      validationErrors.missingParamError("id")
    );
  });

  test("should throw if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    await expect(sut.delete("invalid-id")).rejects.toThrow(
      validationErrors.invalidParamError("id")
    );
  });

  test("should throw if unregistered id is provided", async () => {
    await expect(sut.delete("valid-id")).rejects.toThrow(
      validationErrors.unregisteredError("id")
    );
  });
});
