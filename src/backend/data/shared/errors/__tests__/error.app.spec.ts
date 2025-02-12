import { ErrorApp } from "@/backend/data/shared/errors";

/**
 * Testes da classe de erro da aplicação
 */
describe("ErrorApp", () => {
  /**
   * Testa a criação de erro com código de status padrão
   */
  test("should create error with default status code", () => {
    const message = "any_error_message";
    const error = new ErrorApp(message);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrorApp);
    expect(error.name).toBe("ErrorApp");
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(400);
  });

  /**
   * Testa a criação de erro com código de status personalizado
   */
  test("should create error with custom status code", () => {
    const message = "any_error_message";
    const statusCode = 401;
    const error = new ErrorApp(message, statusCode);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ErrorApp);
    expect(error.name).toBe("ErrorApp");
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
  });

  /**
   * Testa a herança da classe Error
   */
  test("should extend Error class", () => {
    const error = new ErrorApp("any_message");
    const prototype = Object.getPrototypeOf(error);

    expect(prototype.constructor.name).toBe("ErrorApp");
    expect(Object.getPrototypeOf(prototype).constructor.name).toBe("Error");
  });
});
