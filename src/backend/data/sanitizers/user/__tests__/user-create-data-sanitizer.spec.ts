/**
 * Testes unitários para a classe UserCreateDataSanitizer
 *
 * Este arquivo contém testes que verificam o comportamento da implementação
 * UserCreateDataSanitizer do contrato UserCreateDataSanitizerUseCase.
 *
 * @group Unit
 * @group Sanitizers
 * @group User
 */

import { UserCreateDataSanitizer } from "@/backend/data/sanitizers";
import { XssSanitizerUseCase } from "@/backend/domain/sanitizers/security";
import { UserCreateData } from "@/backend/domain/entities";

// Mock para o XssSanitizer
class MockXssSanitizer implements XssSanitizerUseCase {
  sanitize(text: string): string {
    // Simula a remoção de tags HTML
    return text.replace(/<[^>]*>/g, "");
  }
}

describe("UserCreateDataSanitizer", () => {
  let sanitizer: UserCreateDataSanitizer;
  let xssSanitizer: XssSanitizerUseCase;

  beforeEach(() => {
    xssSanitizer = new MockXssSanitizer();
    sanitizer = new UserCreateDataSanitizer(xssSanitizer);
  });

  describe("sanitize method", () => {
    it("deve retornar um objeto vazio quando o input for null ou undefined", () => {
      // Act
      const result1 = sanitizer.sanitize(null as unknown as UserCreateData);
      const result2 = sanitizer.sanitize(
        undefined as unknown as UserCreateData,
      );

      // Assert
      expect(result1).toEqual({});
      expect(result2).toEqual({});
    });

    it("deve sanitizar corretamente todos os campos de um objeto completo", () => {
      // Arrange
      const birthdate = new Date("1990-01-01");
      const inputData: UserCreateData = {
        name: "  John   Doe  ",
        email: " TEST@example.com ",
        phone: "(11) 98765-4321",
        password: "secure!password123",
        birthdate,
      };

      // Act
      const result = sanitizer.sanitize(inputData);

      // Assert
      expect(result).toEqual({
        name: "John Doe",
        email: "test@example.com",
        phone: "11987654321",
        password: "secure!password123",
        birthdate,
      });
    });

    it("deve preservar campos adicionais no objeto", () => {
      // Arrange
      const inputData = {
        name: "John Doe",
        email: "test@example.com",
        phone: "11987654321",
        password: "password123",
        birthdate: new Date("1990-01-01"),
        extraField: "should be preserved",
      } as UserCreateData & { extraField: string };

      // Act
      const result = sanitizer.sanitize(inputData) as typeof inputData;

      // Assert
      expect(result.extraField).toBe("should be preserved");
    });
  });

  describe("sanitizeEmail method", () => {
    it("deve normalizar emails corretamente", () => {
      // Arrange
      const testCases = [
        { input: "  TEST@EXAMPLE.COM  ", expected: "test@example.com" },
        { input: "user@domain.com", expected: "user@domain.com" },
        { input: "", expected: "" },
        { input: null as unknown as string, expected: "" },
        { input: undefined as unknown as string, expected: "" },
      ];

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        const inputData = { ...createMinimalUserData(), email: input };
        const result = sanitizer.sanitize(inputData);
        expect(result.email).toBe(expected);
      });
    });
  });

  describe("sanitizeName method", () => {
    it("deve normalizar nomes corretamente", () => {
      // Arrange
      const testCases = [
        { input: "  John   Doe  ", expected: "John Doe" },
        { input: "JohnDoe", expected: "JohnDoe" },
        { input: "", expected: "" },
        { input: null as unknown as string, expected: "" },
        { input: undefined as unknown as string, expected: "" },
      ];

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        const inputData = { ...createMinimalUserData(), name: input };
        const result = sanitizer.sanitize(inputData);
        expect(result.name).toBe(expected);
      });
    });

    it("deve remover tags HTML dos nomes", () => {
      // Arrange
      const inputData = {
        ...createMinimalUserData(),
        name: '<script>alert("XSS")</script>John<b>Doe</b>',
      };

      // Act
      const result = sanitizer.sanitize(inputData);

      // Assert
      expect(result.name).toBe('alert("XSS")JohnDoe');
      // Verifica se o xssSanitizer foi chamado
      expect(result.name).not.toContain("<script>");
      expect(result.name).not.toContain("<b>");
    });
  });

  describe("sanitizePhone method", () => {
    it("deve normalizar números de telefone corretamente", () => {
      // Arrange
      const testCases = [
        { input: "(11) 98765-4321", expected: "11987654321" },
        { input: "+55 11 98765-4321", expected: "+5511987654321" },
        { input: "11987654321", expected: "11987654321" },
        { input: "", expected: "" },
        { input: null as unknown as string, expected: "" },
        { input: undefined as unknown as string, expected: "" },
      ];

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        const inputData = { ...createMinimalUserData(), phone: input };
        const result = sanitizer.sanitize(inputData);
        expect(result.phone).toBe(expected);
      });
    });
  });

  describe("integração de campos", () => {
    it("deve manter a senha inalterada", () => {
      // Arrange
      const passwords = [
        "simple",
        "Complex!123",
        '<script>alert("XSS")</script>',
        "   password with spaces   ",
      ];

      // Act & Assert
      passwords.forEach((password) => {
        const inputData = { ...createMinimalUserData(), password };
        const result = sanitizer.sanitize(inputData);
        expect(result.password).toBe(password);
      });
    });

    it("deve manter o objeto birthdate inalterado", () => {
      // Arrange
      const birthdate = new Date("1990-01-01");
      const inputData = { ...createMinimalUserData(), birthdate };

      // Act
      const result = sanitizer.sanitize(inputData);

      // Assert
      expect(result.birthdate).toBe(birthdate); // Verifica se é a mesma referência
    });
  });
});

/**
 * Helper para criar um objeto UserCreateData mínimo para testes
 */
function createMinimalUserData(): UserCreateData {
  return {
    name: "John Doe",
    email: "john@example.com",
    phone: "11987654321",
    password: "password123",
    birthdate: new Date("1990-01-01"),
  };
}
