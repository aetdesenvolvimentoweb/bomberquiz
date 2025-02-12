import { ErrorApp } from "@/backend/data/shared/errors";
import { ErrorsValidation } from "@/backend/data/shared/errors";

/**
 * Testes da classe de erros de validação
 */
describe("ErrorsValidation", () => {
  let sut: ErrorsValidation;

  /**
   * Cria uma instância da classe para os testes
   */
  beforeEach(() => {
    sut = new ErrorsValidation();
  });

  /**
   * Testes do método duplicatedKeyError
   */
  describe("duplicatedKeyError", () => {
    test("should return ErrorApp with correct message and status code", () => {
      const error = sut.duplicatedKeyError({ entity: "usuário", key: "email" });

      expect(error).toBeInstanceOf(ErrorApp);
      expect(error.message).toBe(
        "Já existe usuário registrada(o) com essa(e) email."
      );
      expect(error.statusCode).toBe(400);
    });
  });

  /**
   * Testes do método invalidParamError
   */
  describe("invalidParamError", () => {
    test("should return ErrorApp with correct message and status code", () => {
      const error = sut.invalidParamError("email");

      expect(error).toBeInstanceOf(ErrorApp);
      expect(error.message).toBe("Valor inválido para o campo: email.");
      expect(error.statusCode).toBe(400);
    });
  });

  /**
   * Testes do método missingParamError
   */
  describe("missingParamError", () => {
    test("should return ErrorApp with correct message and status code", () => {
      const error = sut.missingParamError("email");

      expect(error).toBeInstanceOf(ErrorApp);
      expect(error.message).toBe("Preencha o campo email.");
      expect(error.statusCode).toBe(400);
    });
  });

  /**
   * Testes do método unauthorizedError
   */
  describe("unauthorizedError", () => {
    test("should return ErrorApp with correct message and status code", () => {
      const error = sut.unauthorizedError();

      expect(error).toBeInstanceOf(ErrorApp);
      expect(error.message).toBe("Email ou senha incorreto(s).");
      expect(error.statusCode).toBe(401);
    });
  });

  /**
   * Testes do método unregisteredError
   */
  describe("unregisteredError", () => {
    test("should return ErrorApp with correct message and status code", () => {
      const error = sut.unregisteredError("id");

      expect(error).toBeInstanceOf(ErrorApp);
      expect(error.message).toBe("Nenhum registro encontrado para esse id.");
      expect(error.statusCode).toBe(404);
    });
  });

  /**
   * Testes do método wrongPasswordError
   */
  describe("wrongPasswordError", () => {
    test("should return ErrorApp with correct message and status code", () => {
      const error = sut.wrongPasswordError("senha atual");

      expect(error).toBeInstanceOf(ErrorApp);
      expect(error.message).toBe("senha atual incorreta.");
      expect(error.statusCode).toBe(401);
    });
  });
});
