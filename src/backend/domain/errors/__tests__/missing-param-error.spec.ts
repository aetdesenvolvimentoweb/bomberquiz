/**
 * Testes unitários para a classe MissingParamError
 *
 * Este arquivo contém testes que verificam o comportamento da classe
 * MissingParamError, que é utilizada para indicar erros de validação
 * quando parâmetros obrigatórios não são fornecidos.
 *
 * @group Unit
 * @group Errors
 * @group Validation
 */

import { ApplicationError, MissingParamError } from "@/backend/domain/errors";
import { User } from "@/backend/domain/entities";

describe("MissingParamError", () => {
  describe("constructor", () => {
    it("deve criar uma instância com a mensagem formatada corretamente", () => {
      // Arrange
      const paramName = "email";

      // Act
      const error = new MissingParamError(paramName);

      // Assert
      expect(error.message).toBe(
        `Parâmetro obrigatório não informado: ${paramName}`,
      );
    });

    it("deve definir o statusCode como 400 (Bad Request)", () => {
      // Arrange & Act
      const error = new MissingParamError("nome");

      // Assert
      expect(error.statusCode).toBe(400);
    });

    it("deve ser uma instância de ApplicationError", () => {
      // Arrange & Act
      const error = new MissingParamError("senha");

      // Assert
      expect(error).toBeInstanceOf(ApplicationError);
    });

    it("deve definir o nome da propriedade como o nome da classe", () => {
      // Arrange & Act
      const error = new MissingParamError("telefone");

      // Assert
      expect(error.name).toBe("MissingParamError");
    });
  });

  describe("uso em validações", () => {
    it("deve ser lançado e capturado corretamente", () => {
      // Arrange
      const paramName = "idade";
      let caughtError: unknown = null;

      // Act
      try {
        throw new MissingParamError(paramName);
      } catch (error) {
        caughtError = error;
      }

      // Assert
      expect(caughtError).toBeInstanceOf(MissingParamError);
      expect((caughtError as MissingParamError).message).toContain(paramName);
    });

    it("deve funcionar em um cenário de validação", () => {
      // Arrange
      const validateUser = (user: User) => {
        if (!user.name) {
          throw new MissingParamError("nome");
        }
        return true;
      };

      // Act & Assert
      expect(() => validateUser({} as User)).toThrow(MissingParamError);
      expect(() => validateUser({ name: "João" } as User)).not.toThrow();
    });
  });

  describe("mensagens de erro", () => {
    it("deve gerar mensagens específicas para cada parâmetro", () => {
      // Arrange & Act
      const error1 = new MissingParamError("email");
      const error2 = new MissingParamError("senha");

      // Assert
      expect(error1.message).toBe("Parâmetro obrigatório não informado: email");
      expect(error2.message).toBe("Parâmetro obrigatório não informado: senha");
    });
  });
});
