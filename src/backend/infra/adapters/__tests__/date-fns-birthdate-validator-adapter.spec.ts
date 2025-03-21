/**
 * Testes unitários para a classe DateFnsBirthdateValidatorAdapter
 *
 * Este arquivo contém testes que verificam o comportamento da implementação
 * DateFnsBirthdateValidatorAdapter do contrato UserBirthdateValidatorUseCase.
 *
 * @group Unit
 * @group Adapters
 * @group Validators
 */

import { DateFnsBirthdateValidatorAdapter } from "@/backend/infra/adapters";
import { InvalidParamError, ServerError } from "@/backend/domain/errors";
import { differenceInYears, isValid, isPast } from "date-fns";

// Mock para date-fns
jest.mock("date-fns", () => ({
  differenceInYears: jest.fn(),
  isValid: jest.fn(),
  isPast: jest.fn(),
}));

describe("DateFnsBirthdateValidatorAdapter", () => {
  let validator: DateFnsBirthdateValidatorAdapter;

  beforeEach(() => {
    validator = new DateFnsBirthdateValidatorAdapter();
    jest.clearAllMocks();

    // Mock padrão para os casos de sucesso
    (isValid as jest.Mock).mockReturnValue(true);
    (isPast as jest.Mock).mockReturnValue(true);
    (differenceInYears as jest.Mock).mockReturnValue(30); // Idade válida por padrão
  });

  it("deve aceitar uma data de nascimento válida", () => {
    // Act & Assert
    expect(() => validator.validate(new Date("1990-01-01"))).not.toThrow();
  });

  it("deve lançar InvalidParamError quando a data não é válida", () => {
    // Arrange
    (isValid as jest.Mock).mockReturnValue(false);

    // Act & Assert
    expect(() => validator.validate(new Date("invalid-date"))).toThrow(
      InvalidParamError,
    );
  });

  it("deve lançar InvalidParamError quando a data está no futuro", () => {
    // Arrange
    (isPast as jest.Mock).mockReturnValue(false);

    // Act & Assert
    expect(() => validator.validate(new Date("2050-01-01"))).toThrow(
      InvalidParamError,
    );
  });

  it("deve lançar InvalidParamError quando idade abaixo do mínimo", () => {
    // Arrange
    (differenceInYears as jest.Mock).mockReturnValue(17); // Abaixo do mínimo de 18

    // Act & Assert
    expect(() => validator.validate(new Date("2010-01-01"))).toThrow(
      InvalidParamError,
    );
  });

  it("deve lançar InvalidParamError quando idade acima do máximo", () => {
    // Arrange
    (differenceInYears as jest.Mock).mockReturnValue(71); // Acima do máximo de 70

    // Act & Assert
    expect(() => validator.validate(new Date("1950-01-01"))).toThrow(
      InvalidParamError,
    );
  });

  // Teste para cobrir a linha 38 - erro que não é nem ServerError nem InvalidParamError
  it("deve converter outros erros para ServerError", () => {
    // Arrange
    const genericError = new Error("Erro genérico da biblioteca");
    (isValid as jest.Mock).mockImplementation(() => {
      throw genericError;
    });

    // Act & Assert
    expect(() => validator.validate(new Date())).toThrow(ServerError);
  });

  // Teste para cobrir a linha 76 (ou similar)
  it("deve propagar InvalidParamError sem envolvê-lo em outro erro", () => {
    // Arrange
    const specificError = new InvalidParamError(
      "data de nascimento",
      "erro específico",
    );
    (isValid as jest.Mock).mockImplementation(() => {
      throw specificError;
    });

    // Act & Assert
    expect(() => validator.validate(new Date())).toThrow(specificError);
    expect(() => validator.validate(new Date())).toThrow(InvalidParamError);
  });

  // Teste adicional para cobrir qualquer caso de ServerError que possa ser propagado
  it("deve propagar ServerError sem envolvê-lo em outro erro", () => {
    // Arrange
    const serverError = new ServerError(new Error("erro interno"));
    (isValid as jest.Mock).mockImplementation(() => {
      throw serverError;
    });

    // Act & Assert
    expect(() => validator.validate(new Date())).toThrow(serverError);
    expect(() => validator.validate(new Date())).toThrow(ServerError);
  });

  it("deve lançar InvalidParamError quando a data de nascimento não é fornecida", () => {
    // Act & Assert
    expect(() => validator.validate(null as unknown as Date)).toThrow(
      InvalidParamError,
    );
    expect(() => validator.validate(undefined as unknown as Date)).toThrow(
      InvalidParamError,
    );
  });
});
