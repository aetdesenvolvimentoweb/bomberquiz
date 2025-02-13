import { ErrorsValidation } from "@/backend/data/shared";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { IdValidatorStub } from "@/backend/__mocks__";
import { IdValidatorUseCase } from "@/backend/domain/use-cases";
import { UserIdValidator } from "@/backend/data/use-cases";
import { UserRepository } from "@/backend/data/repository";
import { UserRepositoryInMemory } from "@/backend/infra/repositories/in-memory";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: UserIdValidator;
  idValidator: IdValidatorUseCase;
  userRepository: UserRepository;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Testes do validador de ID de usuário
 */
describe("UserIdValidator", () => {
  let sut: UserIdValidator;
  let idValidator: IdValidatorUseCase;
  let userRepository: UserRepository;
  let errorsValidation: ErrorsValidationUseCase;

  /**
   * Cria uma instância do validador e suas dependências para os testes
   */
  const makeSut = (): SutTypes => {
    const idValidator = new IdValidatorStub();
    const userRepository = new UserRepositoryInMemory();
    const errorsValidation = new ErrorsValidation();

    const sut = new UserIdValidator({
      idValidator,
      userRepository,
      errorsValidation,
    });

    return {
      sut,
      idValidator,
      userRepository,
      errorsValidation,
    };
  };

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    idValidator = sutInstance.idValidator;
    userRepository = sutInstance.userRepository;
    errorsValidation = sutInstance.errorsValidation;
  });

  /**
   * Testa a validação bem-sucedida de ID
   */
  test("should validate user id", async () => {
    await userRepository.create({
      name: "any_name",
      email: "valid_email",
      phone: "any_phone",
      birthdate: new Date(),
      role: "cliente",
      password: "any_password",
    });

    const user = await userRepository.findByEmail("valid_email");

    await expect(sut.validateUserId(user!.id)).resolves.not.toThrow();
  });

  /**
   * Testa a validação de ID obrigatório
   */
  test("should throw if no id is provided", async () => {
    await expect(sut.validateUserId("")).rejects.toThrow(
      errorsValidation.missingParamError("id")
    );
  });

  /**
   * Testa a validação de formato de ID
   */
  test("should throw if invalid id is provided", async () => {
    jest.spyOn(idValidator, "isValid").mockReturnValue(false);

    await expect(sut.validateUserId("invalid-id")).rejects.toThrow(
      errorsValidation.invalidParamError("id")
    );
  });

  /**
   * Testa a validação de ID não registrado
   */
  test("should throw if unregistered id is provided", async () => {
    await expect(sut.validateUserId("valid-id")).rejects.toThrow(
      errorsValidation.unregisteredError("id")
    );
  });
});
