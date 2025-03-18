/**
 * Testes unitários para a classe DuplicateResourceError
 *
 * Este arquivo contém testes que verificam o comportamento da classe
 * DuplicateResourceError, que é utilizada para indicar erros de conflito
 * quando se tenta criar recursos que já existem no sistema.
 *
 * @group Unit
 * @group Errors
 * @group Validation
 */

import {
  ApplicationError,
  DuplicateResourceError,
} from "@/backend/domain/errors";

describe("DuplicateResourceError", () => {
  describe("constructor", () => {
    it("deve criar uma instância com a mensagem formatada corretamente", () => {
      // Arrange
      const resource = "e-mail";

      // Act
      const error = new DuplicateResourceError(resource);

      // Assert
      expect(error.message).toBe(`E-mail já cadastrado no sistema`);
    });

    it("deve definir o statusCode como 409 (Conflict)", () => {
      // Arrange & Act
      const error = new DuplicateResourceError("usuário");

      // Assert
      expect(error.statusCode).toBe(409);
    });

    it("deve ser uma instância de ApplicationError", () => {
      // Arrange & Act
      const error = new DuplicateResourceError("produto");

      // Assert
      expect(error).toBeInstanceOf(ApplicationError);
    });

    it("deve definir o nome da propriedade como o nome da classe", () => {
      // Arrange & Act
      const error = new DuplicateResourceError("código");

      // Assert
      expect(error.name).toBe("DuplicateResourceError");
    });
  });

  describe("formatação de mensagens", () => {
    it("deve capitalizar o nome do recurso", () => {
      // Arrange & Act
      const error = new DuplicateResourceError("usuário");

      // Assert
      expect(error.message).toContain("Usuário");
      expect(error.message).not.toContain("usuário");
    });

    it("deve manter a capitalização correta para recursos compostos", () => {
      // Arrange & Act
      const error = new DuplicateResourceError("código do produto");

      // Assert
      expect(error.message).toBe("Código do produto já cadastrado no sistema");
    });
  });

  describe("uso em validações", () => {
    it("deve ser lançado e capturado corretamente", () => {
      // Arrange
      const resource = "e-mail";
      let caughtError: unknown = null;

      // Act
      try {
        throw new DuplicateResourceError(resource);
      } catch (error) {
        caughtError = error;
      }

      // Assert
      expect(caughtError).toBeInstanceOf(DuplicateResourceError);
      expect((caughtError as DuplicateResourceError).message).toContain(
        resource.charAt(0).toUpperCase() + resource.slice(1),
      );
    });

    it("deve funcionar em um cenário de validação de unicidade", () => {
      // Arrange
      const checkEmailUniqueness = (
        email: string,
        existingEmails: string[],
      ) => {
        if (existingEmails.includes(email)) {
          throw new DuplicateResourceError("e-mail");
        }
        return true;
      };

      const existingEmails = ["usuario@exemplo.com", "admin@exemplo.com"];

      // Act & Assert
      expect(() =>
        checkEmailUniqueness("usuario@exemplo.com", existingEmails),
      ).toThrow(DuplicateResourceError);
      expect(() =>
        checkEmailUniqueness("novo@exemplo.com", existingEmails),
      ).not.toThrow();
    });
  });

  describe("mensagens de erro", () => {
    it("deve gerar mensagens específicas para diferentes tipos de recursos", () => {
      // Arrange & Act
      const error1 = new DuplicateResourceError("e-mail");
      const error2 = new DuplicateResourceError("usuário");
      const error3 = new DuplicateResourceError("código do produto");

      // Assert
      expect(error1.message).toBe("E-mail já cadastrado no sistema");
      expect(error2.message).toBe("Usuário já cadastrado no sistema");
      expect(error3.message).toBe("Código do produto já cadastrado no sistema");
    });
  });
});
