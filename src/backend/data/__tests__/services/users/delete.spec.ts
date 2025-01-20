import { DeleteUserService } from "@/backend/data/services";
import { IdValidatorStub } from "@/backend/data/__mocks__";
import { UserIdValidator } from "@/backend/data/validators";
import { UserIdValidatorUseCase } from "@/backend/domain/use-cases";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: DeleteUserService;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const idValidator = new IdValidatorStub();
  const userRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const userValidator: UserIdValidatorUseCase = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  const sut = new DeleteUserService({
    userRepository,
    userValidator,
  });

  return {
    sut,
    userRepository,
    validationErrors,
  };
};

describe("DeleteUserService", () => {
  let sut: DeleteUserService;
  let userRepository: UserRepository;
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
    userRepository = sutInstance.userRepository;
  });

  test("should delete a user", async () => {
    await userRepository.create(createUserProps);
    const user = await userRepository.listByEmail(createUserProps.email);

    await expect(sut.delete(user!.id)).resolves.not.toThrow();
  });
});
