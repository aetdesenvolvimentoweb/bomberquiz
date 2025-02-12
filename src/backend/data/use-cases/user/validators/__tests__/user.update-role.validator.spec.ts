import { ErrorsValidation } from "@/backend/data/shared";
import { ErrorsValidationUseCase } from "@/backend/domain/errors";
import { UserRole } from "@/backend/domain/entities";
import { UserUpdateRoleValidator } from "@/backend/data/use-cases";

/**
 * Define os tipos das dependências para os testes
 */
interface SutTypes {
  sut: UserUpdateRoleValidator;
  errorsValidation: ErrorsValidationUseCase;
}

/**
 * Testes do validador de atualização de papel
 */
describe("UserUpdateRoleValidator", () => {
  let sut: UserUpdateRoleValidator;
  let errorsValidation: ErrorsValidationUseCase;

  /**
   * Cria uma instância do validador e suas dependências para os testes
   */
  const makeSut = (): SutTypes => {
    const errorsValidation = new ErrorsValidation();
    const sut = new UserUpdateRoleValidator({
      errorsValidation,
    });

    return {
      sut,
      errorsValidation,
    };
  };

  beforeEach(() => {
    const sutInstance = makeSut();
    sut = sutInstance.sut;
    errorsValidation = sutInstance.errorsValidation;
  });

  /**
   * Testa a validação bem-sucedida de papel
   */
  test("should validate role update", async () => {
    await expect(
      sut.validateUpdateRole("administrador" as UserRole)
    ).resolves.not.toThrow();
  });

  /**
   * Testa a validação de papel obrigatório
   */
  test("should throw if no role is provided", async () => {
    await expect(sut.validateUpdateRole("" as UserRole)).rejects.toThrow(
      errorsValidation.missingParamError("função")
    );
  });

  /**
   * Testa a validação de papel inválido
   */
  test("should throw if invalid role is provided", async () => {
    await expect(
      sut.validateUpdateRole("invalid_role" as UserRole)
    ).rejects.toThrow(errorsValidation.invalidParamError("função"));
  });

  /**
   * Testa a validação de papel colaborador
   */
  test("should validate colaborador role", async () => {
    await expect(
      sut.validateUpdateRole("colaborador" as UserRole)
    ).resolves.not.toThrow();
  });

  /**
   * Testa a validação de papel cliente
   */
  test("should validate cliente role", async () => {
    await expect(
      sut.validateUpdateRole("cliente" as UserRole)
    ).resolves.not.toThrow();
  });
});
