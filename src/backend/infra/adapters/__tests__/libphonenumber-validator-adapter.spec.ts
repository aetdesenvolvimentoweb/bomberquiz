/**
 * Testes unitários para a classe LibphonenumberPhoneValidator
 *
 * Este arquivo contém testes que verificam o comportamento da implementação
 * LibphonenumberPhoneValidator do contrato UserPhoneValidatorUseCase.
 *
 * @group Unit
 * @group Adapters
 * @group Validators
 */

import { LibphonenumberPhoneValidator } from "@/backend/infra/adapters";
import { InvalidParamError, ServerError } from "@/backend/domain/errors";
import { parsePhoneNumber } from "libphonenumber-js/min";

// Mock da biblioteca libphonenumber-js
jest.mock("libphonenumber-js/min", () => ({
  parsePhoneNumber: jest.fn(),
}));

describe("LibphonenumberPhoneValidator", () => {
  let validator: LibphonenumberPhoneValidator;
  let mockIsValid: jest.Mock;

  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    jest.clearAllMocks();

    // Configura o mock para parsePhoneNumber
    mockIsValid = jest.fn();
    (parsePhoneNumber as jest.Mock).mockReturnValue({
      isValid: mockIsValid,
    });

    validator = new LibphonenumberPhoneValidator();
  });

  describe("validate method", () => {
    it("deve aceitar um número de telefone válido", () => {
      // Arrange
      const validPhone = "+5511999999999";
      mockIsValid.mockReturnValue(true);

      // Act & Assert
      expect(() => validator.validate(validPhone)).not.toThrow();
      expect(parsePhoneNumber).toHaveBeenCalledWith(validPhone, "BR");
      expect(mockIsValid).toHaveBeenCalled();
    });

    it("deve lançar InvalidParamError quando o número de telefone é inválido", () => {
      // Arrange
      const invalidPhone = "123456";
      mockIsValid.mockReturnValue(false);
      const errorReason = "formato inválido";

      // Act & Assert
      expect(() => validator.validate(invalidPhone)).toThrow(InvalidParamError);
      expect(() => validator.validate(invalidPhone)).toThrow(
        new InvalidParamError("telefone", errorReason),
      );
      expect(parsePhoneNumber).toHaveBeenCalledWith(invalidPhone, "BR");
      expect(mockIsValid).toHaveBeenCalled();
    });

    it("deve propagar corretamente um InvalidParamError existente", () => {
      // Arrange
      const invalidPhone = "+5511999999999";
      const existingError = new InvalidParamError(
        "telefone",
        "erro personalizado",
      );
      mockIsValid.mockImplementation(() => {
        throw existingError;
      });

      // Act & Assert
      expect(() => validator.validate(invalidPhone)).toThrow(InvalidParamError);
      expect(() => validator.validate(invalidPhone)).toThrow(existingError);
      expect(parsePhoneNumber).toHaveBeenCalledWith(invalidPhone, "BR");
    });

    it("deve propagar corretamente um ServerError existente", () => {
      // Arrange
      const phone = "+5511999999999";
      const serverError = new ServerError(new Error("erro do servidor"));
      mockIsValid.mockImplementation(() => {
        throw serverError;
      });

      // Act & Assert
      expect(() => validator.validate(phone)).toThrow(ServerError);
      expect(() => validator.validate(phone)).toThrow(serverError);
      expect(parsePhoneNumber).toHaveBeenCalledWith(phone, "BR");
    });

    it("deve converter um erro genérico para ServerError", () => {
      // Arrange
      const phone = "+5511999999999";
      const genericError = new Error("erro genérico da biblioteca");

      // Mock para simular um erro da biblioteca
      (parsePhoneNumber as jest.Mock).mockImplementation(() => {
        throw genericError;
      });

      // Act & Assert
      expect(() => validator.validate(phone)).toThrow(ServerError);
      try {
        validator.validate(phone);
      } catch (error) {
        expect(error).toBeInstanceOf(ServerError);
        expect((error as ServerError).message).toContain(
          "Erro genérico da biblioteca",
        );
      }
      expect(parsePhoneNumber).toHaveBeenCalledWith(phone, "BR");
    });

    it("deve lidar com diferentes formatos de números de telefone", () => {
      // Arrange
      const phoneFormats = [
        "+5511999999999", // Formato internacional
        "11999999999", // Formato nacional
        "(11) 99999-9999", // Formato com formatação
      ];

      mockIsValid.mockReturnValue(true);

      // Act & Assert
      phoneFormats.forEach((phone) => {
        expect(() => validator.validate(phone)).not.toThrow();
        expect(parsePhoneNumber).toHaveBeenCalledWith(phone, "BR");
      });
    });
  });
});
