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

  describe("formatação de mensagens", () => {
    it("deve capitalizar o nome do parâmetro", () => {
      // Arrange & Act
      const error = new InvalidParamError("idade");

      // Assert
      expect(error.message).toContain("Idade");
      expect(error.message).not.toContain("idade");
    });

    it("deve capitalizar a razão quando fornecida", () => {
      // Arrange & Act
      const error = new InvalidParamError("senha", "muito curta");

      // Assert
      expect(error.message).toContain("Muito curta");
      expect(error.message).not.toContain("muito curta");
    });

    it("deve retornar a mensagem sem a razão quando ela não for fornecida", () => {
      // Arrange
      const paramName = "senha";

      // Act
      const error = new InvalidParamError(paramName);

      // Assert
      expect(error.message).toBe(`Parâmetro inválido: Senha.`);
    });
  });

  describe("uso em validações", () => {
    it("deve ser lançado e capturado corretamente", () => {
      // Arrange
      const paramName = "idade";
      const reason = "deve ser um número";
      let caughtError: unknown = null;

      // Act
      try {
        throw new InvalidParamError(paramName, reason);
      } catch (error) {
        caughtError = error;
      }

      // Assert
      expect(caughtError).toBeInstanceOf(InvalidParamError);
      expect((caughtError as InvalidParamError).message).toContain(
        paramName.charAt(0).toUpperCase() + paramName.slice(1),
      );
      expect((caughtError as InvalidParamError).message).toContain(
        reason.charAt(0).toUpperCase() + reason.slice(1),
      );
    });

    it("deve funcionar em um cenário de validação", () => {
      // Arrange
      const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new InvalidParamError("email", "formato inválido");
        }
        return true;
      };

      // Act & Assert
      expect(() => validateEmail("email-invalido")).toThrow(InvalidParamError);
      expect(() => validateEmail("usuario@exemplo.com")).not.toThrow();
    });
  });

  describe("mensagens de erro", () => {
    it("deve gerar mensagens específicas para diferentes combinações de parâmetros e razões", () => {
      // Arrange & Act
      const error1 = new InvalidParamError("email");
      const error2 = new InvalidParamError("email", "formato inválido");
      const error3 = new InvalidParamError(
        "idade",
        "deve ser um número positivo",
      );

      // Assert
      expect(error1.message).toBe("Parâmetro inválido: Email.");
      expect(error2.message).toBe(
        "Parâmetro inválido: Email. Formato inválido.",
      );
      expect(error3.message).toBe(
        "Parâmetro inválido: Idade. Deve ser um número positivo.",
      );
    });
  });
});
