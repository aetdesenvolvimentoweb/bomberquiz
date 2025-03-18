/**
 * Testes unitários para a classe ServerError
 *
 * Este arquivo contém testes que verificam o comportamento da classe
 * ServerError, que é utilizada para encapsular erros inesperados do servidor
 * e fornecer uma resposta consistente ao cliente.
 *
 * @group Unit
 * @group Errors
 * @group Server
 */

import { ServerError } from "../server-error";
import { ApplicationError } from "../application-error";

describe("ServerError", () => {
  describe("constructor", () => {
    it("deve criar uma instância com a mensagem formatada corretamente", () => {
      // Arrange
      const originalError = new Error("conexão com o banco de dados falhou");

      // Act
      const error = new ServerError(originalError);

      // Assert
      expect(error.message).toBe(
        "Erro inesperado do servidor. Conexão com o banco de dados falhou",
      );
    });

    it("deve definir o statusCode como 500 (Internal Server Error)", () => {
      // Arrange
      const originalError = new Error("erro de teste");

      // Act
      const error = new ServerError(originalError);

      // Assert
      expect(error.statusCode).toBe(500);
    });

    it("deve ser uma instância de ApplicationError", () => {
      // Arrange
      const originalError = new Error("erro de teste");

      // Act
      const error = new ServerError(originalError);

      // Assert
      expect(error).toBeInstanceOf(ApplicationError);
    });

    it("deve definir o nome da propriedade como o nome da classe", () => {
      // Arrange
      const originalError = new Error("erro de teste");

      // Act
      const error = new ServerError(originalError);

      // Assert
      expect(error.name).toBe("ServerError");
    });

    it("deve preservar o stack trace do erro original", () => {
      // Arrange
      const originalError = new Error("erro original");
      const originalStack = originalError.stack;

      // Act
      const error = new ServerError(originalError);

      // Assert
      expect(error.stack).toBe(originalStack);
    });
  });

  describe("formatação de mensagens", () => {
    it("deve capitalizar a primeira letra da mensagem de erro original", () => {
      // Arrange & Act
      const error = new ServerError(new Error("mensagem em minúsculo"));

      // Assert
      expect(error.message).toContain("Mensagem em minúsculo");
      expect(error.message).not.toContain("mensagem em minúsculo");
    });

    it("deve manter a capitalização se a mensagem original já começar com maiúscula", () => {
      // Arrange & Act
      const error = new ServerError(new Error("Mensagem já capitalizada"));

      // Assert
      expect(error.message).toContain("Mensagem já capitalizada");
    });
  });

  describe("uso em tratamento de erros", () => {
    it("deve ser lançado e capturado corretamente", () => {
      // Arrange
      const originalError = new Error("erro original");
      let caughtError: unknown = null;

      // Act
      try {
        throw new ServerError(originalError);
      } catch (error) {
        caughtError = error;
      }

      // Assert
      expect(caughtError).toBeInstanceOf(ServerError);
      expect((caughtError as ServerError).message).toContain(
        "Erro inesperado do servidor",
      );
    });

    it("deve funcionar em um cenário de tratamento de exceções", () => {
      // Arrange
      const executeOperation = () => {
        throw new Error("operação falhou");
      };

      const safeExecute = () => {
        try {
          executeOperation();
        } catch (error) {
          if (error instanceof Error) {
            throw new ServerError(error);
          }
          throw new ServerError(new Error(String(error)));
        }
      };

      // Act & Assert
      expect(() => safeExecute()).toThrow(ServerError);
      expect(() => safeExecute()).toThrow(
        /Erro inesperado do servidor. Operação falhou/,
      );
    });
  });

  describe("integração com outros erros", () => {
    it("deve encapsular diferentes tipos de erros", () => {
      // Arrange & Act
      const error1 = new ServerError(new TypeError("tipo inválido"));
      const error2 = new ServerError(new RangeError("valor fora do intervalo"));

      // Assert
      expect(error1.message).toBe("Erro inesperado do servidor. Tipo inválido");
      expect(error2.message).toBe(
        "Erro inesperado do servidor. Valor fora do intervalo",
      );
    });
  });
});
