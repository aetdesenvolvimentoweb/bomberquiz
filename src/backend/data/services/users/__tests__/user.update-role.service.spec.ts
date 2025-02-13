import {
  IdValidatorUseCase,
  UserIdValidatorUseCase,
  UserUpdateRoleValidatorUseCase,
} from "@/backend/domain/use-cases";
import {
  UserIdValidator,
  UserUpdateRoleValidator,
} from "@/backend/data/use-cases";
import { UserProps, UserRole } from "@/backend/domain/entities";
import { ErrorsValidation } from "@/backend/data/shared";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { IdValidatorStub } from "@/backend/__mocks__";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/in-memory-repositories";
import { UserUpdateRoleService } from "@/backend/data/services";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: UserUpdateRoleService;
  idValidator: IdValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Testes do serviço de atualização de papel do usuário
 */
describe("UserUpdateRoleService", () => {
  let sut: UserUpdateRoleService;
  let idValidator: IdValidatorUseCase;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidationUseCase;

  /**
   * Cria uma instância do serviço e suas dependências para os testes
   */
  const makeSut = (): SutTypes => {
    const userRepository = new UserRepositoryInMemory();
    const errorsValidation = new ErrorsValidation();
    const idValidator = new IdValidatorStub();

    const userIdValidator: UserIdValidatorUseCase = new UserIdValidator({
      idValidator,
      userRepository,
      errorsValidation,
    });

    const updateRoleValidator: UserUpdateRoleValidatorUseCase =
      new UserUpdateRoleValidator({
        errorsValidation,
      });

    const sut = new UserUpdateRoleService({
      updateRoleValidator,
      userRepository,
      userIdValidator,
    });

    return {
      sut,
      idValidator,
      userRepository,
      errorsValidation,
    };
  };

  beforeEach(async () => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    idValidator = sutInstance.idValidator;
    userRepository = sutInstance.userRepository;
    errorsValidation = sutInstance.errorsValidation;
  });

  /**
   * Cria um objeto com as propriedades padrão de usuário para os testes
   */
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

  /**
   * Testa a atualização bem-sucedida de papel
   */
  test("should update a user role", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    const updateRoleData = {
      id: user!.id,
      role: "administrador" as UserRole,
    };

    await expect(sut.updateRole(updateRoleData)).resolves.not.toThrow();
  });

  /**
   * Testa a validação de ID obrigatório
   */
  test("should throw if no id is provided", async () => {
    await expect(
      sut.updateRole({
        id: "",
        role: "administrador" as UserRole,
      })
    ).rejects.toThrow(errorsValidation.missingParamError("id"));
  });

  /**
   * Testa a validação de formato de ID
   */
  test("should throw if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    await expect(
      sut.updateRole({
        id: "invalid-id",
        role: "administrador" as UserRole,
      })
    ).rejects.toThrow(errorsValidation.invalidParamError("id"));
  });

  /**
   * Testa a validação de ID não registrado
   */
  test("should throw if unregistered id is provided", async () => {
    await expect(
      sut.updateRole({
        id: "unregistered-id",
        role: "administrador" as UserRole,
      })
    ).rejects.toThrow(errorsValidation.unregisteredError("id"));
  });

  /**
   * Testa a validação de papel obrigatório
   */
  test("should throw if no role is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      sut.updateRole({
        id: user!.id,
        role: "" as UserRole,
      })
    ).rejects.toThrow(errorsValidation.missingParamError("função"));
  });

  /**
   * Testa a validação de papel inválido
   */
  test("should throw if invalid role is provided", async () => {
    await userRepository.create(createUserProps());
    const user = await userRepository.findByEmail(createUserProps().email);

    await expect(
      sut.updateRole({
        id: user!.id,
        role: "invalid-role" as UserRole,
      })
    ).rejects.toThrow(errorsValidation.invalidParamError("função"));
  });
});
