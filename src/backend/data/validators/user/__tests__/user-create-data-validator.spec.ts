/**
 * Testes unitários para a classe UserCreateDataValidator
 *
 * Este arquivo contém testes que verificam o comportamento da implementação
 * UserCreateDataValidator do contrato UserCreateDataValidatorUseCase.
 *
 * @group Unit
 * @group Validators
 * @group User
 */

import { UserCreateDataValidator } from "@/backend/data/validators/user";
import { UserCreateData } from "@/backend/domain/entities";
import {
  DuplicateResourceError,
  InvalidParamError,
  MissingParamError,
} from "@/backend/domain/errors";
import {
  UserBirthdateValidatorUseCase,
  UserEmailValidatorUseCase,
  UserPasswordValidatorUseCase,
  UserPhoneValidatorUseCase,
  UserUniqueEmailValidatorUseCase,
} from "@/backend/domain/validators";

// Mocks para os validadores especializados
const mockEmailValidator: jest.Mocked<UserEmailValidatorUseCase> = {
  validate: jest.fn(),
};

const mockUniqueEmailValidator: jest.Mocked<UserUniqueEmailValidatorUseCase> = {
  validate: jest.fn(),
};

const mockPhoneValidator: jest.Mocked<UserPhoneValidatorUseCase> = {
  validate: jest.fn(),
};

const mockBirthdateValidator: jest.Mocked<UserBirthdateValidatorUseCase> = {
  validate: jest.fn(),
};

const mockPasswordValidator: jest.Mocked<UserPasswordValidatorUseCase> = {
  validate: jest.fn(),
};

describe("UserCreateDataValidator", () => {
  let validator: UserCreateDataValidator;
  let validUserData: UserCreateData;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create validator instance with mocked dependencies
    validator = new UserCreateDataValidator({
      userEmailValidator: mockEmailValidator,
      userUniqueEmailValidator: mockUniqueEmailValidator,
      userPhoneValidator: mockPhoneValidator,
      userBirthdateValidator: mockBirthdateValidator,
      userPasswordValidator: mockPasswordValidator,
    });

    // Sample valid user data
    validUserData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "11987654321",
      birthdate: new Date("1990-01-01"),
      password: "StrongP@ssw0rd",
    };

    // Configure default mock behavior (success case)
    mockEmailValidator.validate.mockImplementation(() => {});
    mockUniqueEmailValidator.validate.mockResolvedValue();
    mockPhoneValidator.validate.mockImplementation(() => {});
    mockBirthdateValidator.validate.mockImplementation(() => {});
    mockPasswordValidator.validate.mockImplementation(() => {});
  });

  describe("validate method", () => {
    it("deve validar com sucesso dados completos e válidos", async () => {
      // Act
      await validator.validate(validUserData);

      // Assert
      expect(mockEmailValidator.validate).toHaveBeenCalledWith(
        validUserData.email,
      );
      expect(mockUniqueEmailValidator.validate).toHaveBeenCalledWith(
        validUserData.email,
      );
      expect(mockPhoneValidator.validate).toHaveBeenCalledWith(
        validUserData.phone,
      );
      expect(mockBirthdateValidator.validate).toHaveBeenCalledWith(
        validUserData.birthdate,
      );
      expect(mockPasswordValidator.validate).toHaveBeenCalledWith(
        validUserData.password,
      );
    });

    it("deve lançar MissingParamError quando o nome não é fornecido", async () => {
      // Arrange
      const dataWithoutName = { ...validUserData, name: "" };

      // Act & Assert
      await expect(validator.validate(dataWithoutName)).rejects.toThrow(
        new MissingParamError("nome"),
      );

      // Verify no validators were called
      expect(mockEmailValidator.validate).not.toHaveBeenCalled();
      expect(mockUniqueEmailValidator.validate).not.toHaveBeenCalled();
      expect(mockPhoneValidator.validate).not.toHaveBeenCalled();
      expect(mockBirthdateValidator.validate).not.toHaveBeenCalled();
      expect(mockPasswordValidator.validate).not.toHaveBeenCalled();
    });

    it("deve lançar MissingParamError quando o email não é fornecido", async () => {
      // Arrange
      const dataWithoutEmail = {
        ...validUserData,
        email: null as unknown as string,
      };

      // Act & Assert
      await expect(validator.validate(dataWithoutEmail)).rejects.toThrow(
        new MissingParamError("email"),
      );
    });

    it("deve lançar MissingParamError quando o telefone não é fornecido", async () => {
      // Arrange
      const dataWithoutPhone = {
        ...validUserData,
        phone: undefined as unknown as string,
      };

      // Act & Assert
      await expect(validator.validate(dataWithoutPhone)).rejects.toThrow(
        new MissingParamError("telefone"),
      );
    });

    it("deve lançar MissingParamError quando a data de nascimento não é fornecida", async () => {
      // Arrange
      const dataWithoutBirthdate = {
        ...validUserData,
        birthdate: null as unknown as Date,
      };

      // Act & Assert
      await expect(validator.validate(dataWithoutBirthdate)).rejects.toThrow(
        new MissingParamError("data de nascimento"),
      );
    });

    it("deve lançar MissingParamError quando a senha não é fornecida", async () => {
      // Arrange
      const dataWithoutPassword = { ...validUserData, password: "" };

      // Act & Assert
      await expect(validator.validate(dataWithoutPassword)).rejects.toThrow(
        new MissingParamError("senha"),
      );
    });

    it("deve propagar erro quando o validador de email falha", async () => {
      // Arrange
      const emailError = new InvalidParamError("email", "formato inválido");
      mockEmailValidator.validate.mockImplementation(() => {
        throw emailError;
      });

      // Act & Assert
      await expect(validator.validate(validUserData)).rejects.toThrow(
        emailError,
      );

      // Verify only email validator was called
      expect(mockEmailValidator.validate).toHaveBeenCalled();
      expect(mockUniqueEmailValidator.validate).not.toHaveBeenCalled();
      expect(mockPhoneValidator.validate).not.toHaveBeenCalled();
      expect(mockBirthdateValidator.validate).not.toHaveBeenCalled();
      expect(mockPasswordValidator.validate).not.toHaveBeenCalled();
    });

    it("deve propagar erro quando o validador de email único falha", async () => {
      // Arrange
      const duplicateEmailError = new DuplicateResourceError("email");
      mockUniqueEmailValidator.validate.mockRejectedValue(duplicateEmailError);

      // Act & Assert
      await expect(validator.validate(validUserData)).rejects.toThrow(
        duplicateEmailError,
      );

      // Verify email validators were called but not the others
      expect(mockEmailValidator.validate).toHaveBeenCalled();
      expect(mockUniqueEmailValidator.validate).toHaveBeenCalled();
      expect(mockPhoneValidator.validate).not.toHaveBeenCalled();
      expect(mockBirthdateValidator.validate).not.toHaveBeenCalled();
      expect(mockPasswordValidator.validate).not.toHaveBeenCalled();
    });

    it("deve propagar erro quando o validador de telefone falha", async () => {
      // Arrange
      const phoneError = new InvalidParamError("telefone", "formato inválido");
      mockPhoneValidator.validate.mockImplementation(() => {
        throw phoneError;
      });

      // Act & Assert
      await expect(validator.validate(validUserData)).rejects.toThrow(
        phoneError,
      );

      // Verify validators up to phone were called
      expect(mockEmailValidator.validate).toHaveBeenCalled();
      expect(mockUniqueEmailValidator.validate).toHaveBeenCalled();
      expect(mockPhoneValidator.validate).toHaveBeenCalled();
      expect(mockBirthdateValidator.validate).not.toHaveBeenCalled();
      expect(mockPasswordValidator.validate).not.toHaveBeenCalled();
    });

    it("deve propagar erro quando o validador de data de nascimento falha", async () => {
      // Arrange
      const birthdateError = new InvalidParamError(
        "data de nascimento",
        "usuário deve ter pelo menos 18 anos",
      );
      mockBirthdateValidator.validate.mockImplementation(() => {
        throw birthdateError;
      });

      // Act & Assert
      await expect(validator.validate(validUserData)).rejects.toThrow(
        birthdateError,
      );

      // Verify validators up to birthdate were called
      expect(mockEmailValidator.validate).toHaveBeenCalled();
      expect(mockUniqueEmailValidator.validate).toHaveBeenCalled();
      expect(mockPhoneValidator.validate).toHaveBeenCalled();
      expect(mockBirthdateValidator.validate).toHaveBeenCalled();
      expect(mockPasswordValidator.validate).not.toHaveBeenCalled();
    });

    it("deve propagar erro quando o validador de senha falha", async () => {
      // Arrange
      const passwordError = new InvalidParamError(
        "senha",
        "deve conter pelo menos uma letra maiúscula",
      );
      mockPasswordValidator.validate.mockImplementation(() => {
        throw passwordError;
      });

      // Act & Assert
      await expect(validator.validate(validUserData)).rejects.toThrow(
        passwordError,
      );

      // Verify all validators were called
      expect(mockEmailValidator.validate).toHaveBeenCalled();
      expect(mockUniqueEmailValidator.validate).toHaveBeenCalled();
      expect(mockPhoneValidator.validate).toHaveBeenCalled();
      expect(mockBirthdateValidator.validate).toHaveBeenCalled();
      expect(mockPasswordValidator.validate).toHaveBeenCalled();
    });
  });
});
