/**
 * Testes de integração para UserCreateDataValidator
 *
 * Este arquivo contém testes que verificam a integração entre o
 * UserCreateDataValidator e o UserUniqueEmailValidator real,
 * que interage com o repositório de usuários.
 *
 * @group Integration
 * @group Validators
 * @group User
 */

import { InMemoryUserRepository } from "@/backend/data/repositories";
import {
  UserCreateDataValidator,
  UserUniqueEmailValidator,
} from "@/backend/data/validators/user";
import { UserCreateData } from "@/backend/domain/entities";
import { DuplicateResourceError } from "@/backend/domain/errors";
import { UserRepository } from "@/backend/domain/repositories";
import {
  UserBirthdateValidatorUseCase,
  UserEmailValidatorUseCase,
  UserPasswordValidatorUseCase,
  UserPhoneValidatorUseCase,
} from "@/backend/domain/validators";

// Ainda precisamos de mocks para os outros validadores
const mockEmailValidator: jest.Mocked<UserEmailValidatorUseCase> = {
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

describe("UserCreateDataValidator Integration", () => {
  let validator: UserCreateDataValidator;
  let userRepository: UserRepository;
  let uniqueEmailValidator: UserUniqueEmailValidator;
  let validUserData: UserCreateData;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create a test repository
    userRepository = new InMemoryUserRepository();

    // Create a real instance of UserUniqueEmailValidator
    uniqueEmailValidator = new UserUniqueEmailValidator(userRepository);

    // Create validator instance with real UserUniqueEmailValidator
    validator = new UserCreateDataValidator({
      userEmailValidator: mockEmailValidator,
      userUniqueEmailValidator: uniqueEmailValidator,
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

    // Configure default mock behavior for other validators
    mockEmailValidator.validate.mockImplementation(() => {});
    mockPhoneValidator.validate.mockImplementation(() => {});
    mockBirthdateValidator.validate.mockImplementation(() => {});
    mockPasswordValidator.validate.mockImplementation(() => {});
  });

  it("deve validar com sucesso quando o email não está em uso", async () => {
    // Act
    await validator.validate(validUserData);

    // Assert - não deve lançar exceção
  });

  it("deve rejeitar quando o email já está em uso", async () => {
    // Arrange - adicionar um usuário com o mesmo email
    await userRepository.create(validUserData);

    // Act & Assert
    await expect(validator.validate(validUserData)).rejects.toThrow(
      DuplicateResourceError,
    );
  });

  it("deve permitir validar dois usuários com emails diferentes", async () => {
    // Arrange
    const firstUser = { ...validUserData };
    const secondUser = {
      ...validUserData,
      email: "another.user@example.com",
    };

    // Act
    await validator.validate(firstUser);
    await userRepository.create(firstUser);
    await validator.validate(secondUser);

    // Assert - não deve lançar exceção
  });
});
