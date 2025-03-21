/**
 * Testes unitários para a classe PasswordValidatorAdapter
 *
 * Este arquivo contém testes que verificam o comportamento da implementação
 * PasswordValidatorAdapter do contrato UserPasswordValidatorUseCase.
 *
 * @group Unit
 * @group Adapters
 * @group Validators
 */

import { PasswordValidatorAdapter } from "@/backend/infra/adapters";
import { InvalidParamError, ServerError } from "@/backend/domain/errors";

describe("PasswordValidatorAdapter", () => {
  let validator: PasswordValidatorAdapter;

  beforeEach(() => {
    validator = new PasswordValidatorAdapter();
  });

  describe("validate method", () => {
    it("deve aceitar uma senha válida que atende a todos os critérios", () => {
      // Arrange
      const validPasswords = [
        "Abc123!@",
        "StrongP@ssw0rd",
        "C0mpl3x!P@ssword",
        "P@$$w0rd123",
      ];

      // Act & Assert
      validPasswords.forEach((password) => {
        expect(() => validator.validate(password)).not.toThrow();
      });
    });

    it("deve lançar InvalidParamError quando a senha é muito curta", () => {
      // Arrange
      const shortPassword = "Abc12!";
      const errorReason = "deve ter pelo menos 8 caracteres";

      // Act & Assert
      expect(() => validator.validate(shortPassword)).toThrow(
        InvalidParamError,
      );
      expect(() => validator.validate(shortPassword)).toThrow(
        new InvalidParamError("senha", errorReason),
      );
    });

    it("deve lançar InvalidParamError quando a senha não contém letra maiúscula", () => {
      // Arrange
      const noUppercasePassword = "abc123!@";
      const errorReason = "deve conter pelo menos uma letra maiúscula";

      // Act & Assert
      expect(() => validator.validate(noUppercasePassword)).toThrow(
        InvalidParamError,
      );
      expect(() => validator.validate(noUppercasePassword)).toThrow(
        new InvalidParamError("senha", errorReason),
      );
    });

    it("deve lançar InvalidParamError quando a senha não contém letra minúscula", () => {
      // Arrange
      const noLowercasePassword = "ABC123!@";
      const errorReason = "deve conter pelo menos uma letra minúscula";

      // Act & Assert
      expect(() => validator.validate(noLowercasePassword)).toThrow(
        InvalidParamError,
      );
      expect(() => validator.validate(noLowercasePassword)).toThrow(
        new InvalidParamError("senha", errorReason),
      );
    });

    it("deve lançar InvalidParamError quando a senha não contém números", () => {
      // Arrange
      const noDigitsPassword = "AbcDef!@";
      const errorReason = "deve conter pelo menos um número";

      // Act & Assert
      expect(() => validator.validate(noDigitsPassword)).toThrow(
        InvalidParamError,
      );
      expect(() => validator.validate(noDigitsPassword)).toThrow(
        new InvalidParamError("senha", errorReason),
      );
    });

    it("deve lançar InvalidParamError quando a senha não contém caracteres especiais", () => {
      // Arrange
      const noSymbolsPassword = "Abcdef123";
      const errorReason = "deve conter pelo menos um caractere especial";

      // Act & Assert
      expect(() => validator.validate(noSymbolsPassword)).toThrow(
        InvalidParamError,
      );
      expect(() => validator.validate(noSymbolsPassword)).toThrow(
        new InvalidParamError("senha", errorReason),
      );
    });

    it("deve lançar InvalidParamError quando a senha contém espaços", () => {
      // Arrange
      const passwordWithSpaces = "Abc 123!@";
      const errorReason = "não deve conter espaços";

      // Act & Assert
      expect(() => validator.validate(passwordWithSpaces)).toThrow(
        InvalidParamError,
      );
      expect(() => validator.validate(passwordWithSpaces)).toThrow(
        new InvalidParamError("senha", errorReason),
      );
    });

    it("deve lançar InvalidParamError quando a senha está na lista negra", () => {
      // Arrange
      const blacklistedPasswords = [
        "Password123",
        "Admin123!",
        "12345678",
        "Senha123!",
        "Abc123!@#",
      ];

      // Act & Assert
      blacklistedPasswords.forEach((password) => {
        expect(() => validator.validate(password)).toThrow(InvalidParamError);
      });
    });

    it("deve converter um erro genérico para ServerError", () => {
      // Arrange
      const genericError = new Error("erro genérico");

      // Mock do método schema.validate para lançar um erro genérico
      jest.spyOn(validator["schema"], "validate").mockImplementationOnce(() => {
        throw genericError;
      });

      // Act & Assert
      expect(() => validator.validate("ValidP@ss123")).toThrow(ServerError);
      try {
        validator.validate("ValidP@ss123");
      } catch (error) {
        expect(error).toBeInstanceOf(ServerError);
        // Verifica se a mensagem do ServerError contém a mensagem do erro original
        expect((error as ServerError).message).toContain("erro genérico");
      }
    });
  });

  describe("comportamento com diferentes tipos de senhas", () => {
    it("deve rejeitar senhas que atendem a alguns critérios mas não todos", () => {
      // Arrange
      const testCases = [
        {
          password: "abcdefgh",
          expectedError: "deve conter pelo menos uma letra maiúscula",
        },
        {
          password: "ABCDEFGH",
          expectedError: "deve conter pelo menos uma letra minúscula",
        },
        {
          password: "Abcdefgh",
          expectedError: "deve conter pelo menos um número",
        },
        {
          password: "Abcdef12",
          expectedError: "deve conter pelo menos um caractere especial",
        },
      ];

      // Act & Assert
      testCases.forEach(({ password, expectedError }) => {
        expect(() => validator.validate(password)).toThrow(InvalidParamError);
        expect(() => validator.validate(password)).toThrow(
          new InvalidParamError("senha", expectedError),
        );
      });
    });

    it("deve validar corretamente senhas com caracteres especiais variados", () => {
      // Arrange
      const validSpecialCharPasswords = [
        "P@ssw0rd!",
        "Secure#123",
        "C0mpl3x%Pass",
        "T3st&P@ssword",
        "N3w_P@ss!",
        "P@$$w0rd^",
      ];

      // Act & Assert
      validSpecialCharPasswords.forEach((password) => {
        expect(() => validator.validate(password)).not.toThrow();
      });
    });
  });
});
