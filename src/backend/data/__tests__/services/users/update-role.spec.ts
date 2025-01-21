import {
  UpdateRoleValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import {
  UpdateRoleValidatorUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import { IdValidatorStub } from "@/backend/data/__mocks__";
import { UpdateUserRoleService } from "@/backend/data/services";
import { UserProps } from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: UpdateUserRoleService;
  userRepository: UserRepository;
  validationErrors: ValidationErrors;
}

const makeSut = (): SutTypes => {
  const userRepository = new UserRepositoryInMemory();
  const validationErrors = new ValidationErrors();
  const idValidator = new IdValidatorStub();
  const userIdValidator: UserIdValidatorUseCase = new UserIdValidator({
    idValidator,
    userRepository,
    validationErrors,
  });
  const updateRoleValidator: UpdateRoleValidatorUseCase =
    new UpdateRoleValidator({
      validationErrors,
    });
  const sut = new UpdateUserRoleService({
    updateRoleValidator,
    userRepository,
    userIdValidator,
  });

  return {
    sut,
    userRepository,
    validationErrors,
  };
};

describe("UpdateUserRoleService", () => {
  let sut: UpdateUserRoleService;
  let userRepository: UserRepository;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let validationErrors: ValidationErrors;

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    userRepository = sutInstance.userRepository;
    validationErrors = sutInstance.validationErrors;
  });

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

  test("should update a user password", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.listByEmail(createUserProps().email);

    await expect(
      sut.updateRole({
        id: user!.id,
        role: "administrador",
      })
    ).resolves.not.toThrow();
  });
});
