/**
 * Testes unitários para a classe ApplicationError
 *
 * Este arquivo contém testes que verificam o comportamento da classe base
 * ApplicationError, que serve como fundação para o sistema de tratamento
 * de erros da aplicação.
 *
 * Os testes estão organizados em três grupos principais:
 * 1. Testes do construtor - verificam a inicialização correta da classe
 * 2. Testes de herança - verificam o comportamento quando estendida
 * 3. Testes de comportamento em try/catch - verificam o uso em blocos de exceção
 *
 * @group Unit
 * @group Errors
 */

import { ApplicationError } from "@/backend/domain/errors";

describe("ApplicationError", () => {
  describe("constructor", () => {
    it("deve criar uma instância com a mensagem e statusCode fornecidos", () => {
      // Arrange & Act
      const errorMessage = "Erro de teste";
      const statusCode = 403;
      const error = new ApplicationError(errorMessage, statusCode);

      // Assert
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApplicationError);
      expect(error.message).toBe(errorMessage);
      expect(error.statusCode).toBe(statusCode);
    });

    it("deve usar o statusCode padrão (400) quando não for fornecido", () => {
      // Arrange & Act
      const errorMessage = "Erro de teste";
      const error = new ApplicationError(errorMessage);

      // Assert
      expect(error.statusCode).toBe(400);
    });

    it("deve definir o nome da propriedade como o nome da classe", () => {
      // Arrange & Act
      const error = new ApplicationError("Erro de teste");

      // Assert
      expect(error.name).toBe("ApplicationError");
    });

    it("deve preservar o stack trace", () => {
      // Arrange & Act
      const error = new ApplicationError("Erro de teste");

      // Assert
      expect(error.stack).toBeDefined();
    });
  });

  describe("herança", () => {
    /**
     * Testa a capacidade de criar classes de erro específicas
     * estendendo a classe base ApplicationError
     */
    it("deve permitir que classes filhas definam seus próprios códigos de status", () => {
      // Arrange
      class NotFoundError extends ApplicationError {
        constructor(resource: string) {
          super(`${resource} não encontrado(a)`, 404);
        }
      }

      // Act
      const error = new NotFoundError("Usuário");

      // Assert
      expect(error).toBeInstanceOf(ApplicationError);
      expect(error.name).toBe("NotFoundError");
      expect(error.message).toBe("Usuário não encontrado(a)");
      expect(error.statusCode).toBe(404);
    });

    /**
     * Verifica se o nome da classe é preservado corretamente
     * nas classes que estendem ApplicationError
     */
    it("deve permitir que classes filhas mantenham o nome correto da classe", () => {
      // Arrange
      class ForbiddenError extends ApplicationError {
        constructor() {
          super("Acesso negado", 403);
        }
      }

      // Act
      const error = new ForbiddenError();

      // Assert
      expect(error.name).toBe("ForbiddenError");
    });
  });

  describe("comportamento em try/catch", () => {
    /**
     * Verifica se a exceção pode ser capturada normalmente
     * em blocos try/catch, como qualquer outro erro
     */
    it("deve ser capturado como um erro normal", () => {
      // Arrange
      const errorMessage = "Erro de teste";
      let caughtError: unknown = null;

      // Act
      try {
        throw new ApplicationError(errorMessage);
      } catch (error) {
        caughtError = error;
      }

      // Assert
      expect(caughtError).toBeInstanceOf(ApplicationError);
      expect((caughtError as ApplicationError).message).toBe(errorMessage);
    });
  });
});
