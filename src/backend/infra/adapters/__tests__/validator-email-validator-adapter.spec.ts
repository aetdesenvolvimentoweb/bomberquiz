import { ValidatorEmailValidatorAdapter } from "@/backend/infra/adapters";
import { InvalidParamError, ServerError } from "@/backend/domain/errors";
import validator from "validator";

// Mock da biblioteca validator
jest.mock("validator", () => ({
  isEmail: jest.fn(),
}));

describe("ValidatorEmailValidatorAdapter", () => {
  let emailValidator: ValidatorEmailValidatorAdapter;

  beforeEach(() => {
    emailValidator = new ValidatorEmailValidatorAdapter();
    jest.clearAllMocks();
    (validator.isEmail as jest.Mock).mockReturnValue(true); // Valor padrão
  });

  it("deve aceitar um email válido", () => {
    // Arrange
    const validEmail = "test@example.com";
    (validator.isEmail as jest.Mock).mockReturnValue(true);

    // Act & Assert
    expect(() => emailValidator.validate(validEmail)).not.toThrow();
  });

  it("deve lançar InvalidParamError para email inválido", () => {
    // Arrange
    const invalidEmail = "invalid-email";
    (validator.isEmail as jest.Mock).mockReturnValue(false);

    // Act & Assert
    expect(() => emailValidator.validate(invalidEmail)).toThrow(
      InvalidParamError,
    );
  });

  // Este teste cobrirá a linha 36
  it("deve converter erros inesperados da biblioteca para ServerError", () => {
    // Arrange
    const email = "test@example.com";
    const unexpectedError = new Error("Unexpected library error");

    // Simula a biblioteca lançando um erro inesperado
    (validator.isEmail as jest.Mock).mockImplementation(() => {
      throw unexpectedError;
    });

    // Act & Assert
    expect(() => emailValidator.validate(email)).toThrow(ServerError);
  });

  // Teste adicional para garantir que InvalidParamError seja propagado
  it("deve propagar InvalidParamError sem convertê-lo", () => {
    // Arrange
    const email = "test@example.com";
    const specificError = new InvalidParamError("e-mail", "erro específico");

    // Simula a função lançando um InvalidParamError
    (validator.isEmail as jest.Mock).mockImplementation(() => {
      throw specificError;
    });

    // Act & Assert
    expect(() => emailValidator.validate(email)).toThrow(specificError);
  });

  // Teste adicional para garantir que ServerError seja propagado
  it("deve propagar ServerError sem convertê-lo", () => {
    // Arrange
    const email = "test@example.com";
    const serverError = new ServerError(new Error("erro interno"));

    // Simula a função lançando um ServerError
    (validator.isEmail as jest.Mock).mockImplementation(() => {
      throw serverError;
    });

    // Act & Assert
    expect(() => emailValidator.validate(email)).toThrow(serverError);
  });
});
