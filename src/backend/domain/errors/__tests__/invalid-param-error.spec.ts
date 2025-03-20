/**
 * Testes unitários para a classe InvalidParamError
 *
 * Este arquivo contém testes que verificam o comportamento da classe
 * InvalidParamError, que é utilizada para indicar erros de validação
 * quando parâmetros fornecidos contêm valores inválidos.
 *
 * @group Unit
 * @group Errors
 * @group Validation
 */

import { ApplicationError, InvalidParamError } from "@/backend/domain/errors";

describe("InvalidParamError", () => {
  describe("constructor", () => {
    it("deve criar uma instância com a mensagem formatada corretamente sem razão", () => {
      // Arrange
      const paramName = "email";

      // Act
      const error = new InvalidParamError(paramName);

      // Assert
      expect(error.message).toBe(`Parâmetro inválido: Email.`);
    });

    it("deve criar uma instância com a mensagem formatada corretamente com razão", () => {
      // Arrange
      const paramName = "email";
      const reason = "formato inválido";

      // Act
      const error = new InvalidParamError(paramName, reason);

      // Assert
      expect(error.message).toBe(
        `Parâmetro inválido: Email. Formato inválido.`,
      );
    });

    it("deve definir o statusCode como 400 (Bad Request)", () => {
      // Arrange & Act
      const error = new InvalidParamError("nome");

      // Assert
      expect(error.statusCode).toBe(400);
    });

    it("deve ser uma instância de ApplicationError", () => {
      // Arrange & Act
      const error = new InvalidParamError("senha");

      // Assert
      expect(error).toBeInstanceOf(ApplicationError);
    });

    it("deve definir o nome da propriedade como o nome da classe", () => {
      // Arrange & Act
      const error = new InvalidParamError("telefone");

      // Assert
      expect(error.name).toBe("InvalidParamError");
    });
  });
});
