import {
  IdValidatorUseCase,
  UpdateRoleValidatorUseCase,
  UserIdValidatorUseCase,
} from "@/backend/domain/use-cases";
import {
  UpdateRoleValidator,
  UserIdValidator,
} from "@/backend/data/validators";
import { UserProps, UserRole } from "@/backend/domain/entities";
import { IdValidatorStub } from "@/backend/__mocks__";
import { UpdateUserRoleService } from "@/backend/data/services";
import { UserRepository } from "@/backend/data/repositories";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { ValidationErrors } from "@/backend/data/helpers";

interface SutTypes {
  sut: UpdateUserRoleService;
  idValidator: IdValidatorUseCase;
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
    idValidator,
    userRepository,
    validationErrors,
  };
};

describe("UpdateUserRoleService", () => {
  let sut: UpdateUserRoleService;
  let idValidator: IdValidatorUseCase;
  let userRepository: UserRepository;
  let validationErrors: ValidationErrors;

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    idValidator = sutInstance.idValidator;
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
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      sut.updateRole({
        id: user!.id,
        role: "administrador",
      })
    ).resolves.not.toThrow();
  });

  test("should throws if no id is provided", async () => {
    await expect(
      // @ts-expect-error teste
      sut.updateRole({
        role: "administrador",
      })
    ).rejects.toThrow(validationErrors.missingParamError("id"));
  });

  test("should throws if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    await expect(
      sut.updateRole({
        id: "invalid-id",
        role: "administrador",
      })
    ).rejects.toThrow(validationErrors.invalidParamError("id"));
  });

  test("should throws if unregistered id is provided", async () => {
    await expect(
      sut.updateRole({
        id: "unregistered-id",
        role: "administrador",
      })
    ).rejects.toThrow(validationErrors.unregisteredError("id"));
  });

  test("should throws if no role is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      // @ts-expect-error teste
      sut.updateRole({
        id: user!.id,
      })
    ).rejects.toThrow(validationErrors.missingParamError("função"));
  });

  test("should throws if invalid role is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      sut.updateRole({
        id: user!.id,
        role: "invalid-role" as UserRole,
      })
    ).rejects.toThrow(validationErrors.invalidParamError("função"));
  });
});
