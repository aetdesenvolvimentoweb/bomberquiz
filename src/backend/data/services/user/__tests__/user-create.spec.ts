/**
 * Testes unitários para a classe UserCreateService
 *
 * Este arquivo contém testes que verificam o comportamento do serviço
 * de criação de usuários, incluindo o fluxo feliz e cenários de erro.
 *
 * @group Unit
 * @group Services
 * @group User
 */

import { UserCreateService } from "@/backend/data/services/user/user-create";
import { UserCreateData } from "@/backend/domain/entities";
import { InvalidParamError, MissingParamError } from "@/backend/domain/errors";
import { LoggerProvider } from "@/backend/domain/providers";
import { UserRepository } from "@/backend/domain/repositories";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import { UserCreateDataValidatorUseCase } from "@/backend/domain/validators";

// Mocks
const mockUserRepository: jest.Mocked<UserRepository> = {
  create: jest.fn(),
  findByEmail: jest.fn(),
};

const mockUserCreateDataSanitizer: jest.Mocked<UserCreateDataSanitizerUseCase> =
  {
    sanitize: jest.fn(),
  };

const mockUserCreateValidator: jest.Mocked<UserCreateDataValidatorUseCase> = {
  validate: jest.fn(),
};

const mockLoggerProvider: jest.Mocked<LoggerProvider> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  withContext: jest.fn().mockReturnThis(), // Adicionando o método withContext
};

describe("UserCreateService", () => {
  let userCreateService: UserCreateService;
  let userData: UserCreateData;
  let sanitizedUserData: UserCreateData;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create service instance with mocked dependencies
    userCreateService = new UserCreateService({
      userRepository: mockUserRepository,
      userCreateDataSanitizer: mockUserCreateDataSanitizer,
      userCreateValidator: mockUserCreateValidator,
      loggerProvider: mockLoggerProvider,
    });

    // Sample user data
    userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "Password123!",
      phone: "(11) 98765-4321",
      birthdate: new Date("1990-01-01"),
    };

    // Sample sanitized data (typically this would have trimmed strings, etc.)
    sanitizedUserData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "Password123!",
      phone: "11987654321",
      birthdate: new Date("1990-01-01"),
    };

    // Configure default mock behavior
    mockUserCreateDataSanitizer.sanitize.mockReturnValue(sanitizedUserData);
    mockUserCreateValidator.validate.mockResolvedValue(undefined);
    mockUserRepository.create.mockResolvedValue(undefined);
  });

  describe("create method", () => {
    it("deve criar um usuário com sucesso quando todos os dados são válidos", async () => {
      // Act
      await userCreateService.create(userData);

      // Assert
      expect(mockUserCreateDataSanitizer.sanitize).toHaveBeenCalledWith(
        userData,
      );
      expect(mockUserCreateValidator.validate).toHaveBeenCalledWith(
        sanitizedUserData,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith(sanitizedUserData);

      // Verify logs
      expect(mockLoggerProvider.debug).toHaveBeenCalledWith(
        "Iniciando processo de criação de usuário",
        expect.objectContaining({
          service: "UserCreateService",
          method: "create",
          metadata: expect.objectContaining({
            userEmail: userData.email,
          }),
        }),
      );

      expect(mockLoggerProvider.info).toHaveBeenCalledWith(
        "Usuário criado com sucesso",
        expect.objectContaining({
          metadata: expect.objectContaining({
            userEmail: sanitizedUserData.email,
          }),
        }),
      );
    });

    it("deve propagar erro quando a validação falha", async () => {
      // Arrange
      const validationError = new InvalidParamError(
        "email",
        "formato inválido",
      );
      mockUserCreateValidator.validate.mockRejectedValue(validationError);

      // Act & Assert
      await expect(userCreateService.create(userData)).rejects.toThrow(
        validationError,
      );

      // Verify sanitization was called
      expect(mockUserCreateDataSanitizer.sanitize).toHaveBeenCalledWith(
        userData,
      );

      // Verify validation was called
      expect(mockUserCreateValidator.validate).toHaveBeenCalledWith(
        sanitizedUserData,
      );

      // Verify repository was NOT called (because validation failed)
      expect(mockUserRepository.create).not.toHaveBeenCalled();

      // Verify error was logged
      expect(mockLoggerProvider.error).toHaveBeenCalledWith(
        "Erro ao criar usuário",
        expect.objectContaining({
          metadata: expect.objectContaining({
            error: expect.objectContaining({
              name: validationError.name,
              message: validationError.message,
            }),
          }),
        }),
      );
    });

    it("deve propagar erro quando o repositório falha", async () => {
      // Arrange
      const repositoryError = new Error(
        "Falha na conexão com o banco de dados",
      );
      mockUserRepository.create.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(userCreateService.create(userData)).rejects.toThrow(
        repositoryError,
      );

      // Verify sanitization and validation were called
      expect(mockUserCreateDataSanitizer.sanitize).toHaveBeenCalledWith(
        userData,
      );
      expect(mockUserCreateValidator.validate).toHaveBeenCalledWith(
        sanitizedUserData,
      );

      // Verify repository was called
      expect(mockUserRepository.create).toHaveBeenCalledWith(sanitizedUserData);

      // Verify error was logged
      expect(mockLoggerProvider.error).toHaveBeenCalledWith(
        "Erro ao criar usuário",
        expect.objectContaining({
          metadata: expect.objectContaining({
            error: expect.objectContaining({
              name: repositoryError.name,
              message: repositoryError.message,
            }),
          }),
        }),
      );
    });

    it("deve lidar com dados nulos ou indefinidos", async () => {
      // Arrange
      const nullData = null as unknown as UserCreateData;
      mockUserCreateDataSanitizer.sanitize.mockReturnValue(
        {} as UserCreateData,
      );

      // Configure o validador para rejeitar o objeto vazio
      const validationError = new MissingParamError("email");
      mockUserCreateValidator.validate.mockRejectedValue(validationError);

      // Act & Assert
      await expect(userCreateService.create(nullData)).rejects.toThrow(
        validationError,
      );

      // Verify sanitization was called with null data
      expect(mockUserCreateDataSanitizer.sanitize).toHaveBeenCalledWith(
        nullData,
      );

      // Verify validation was called with empty object
      expect(mockUserCreateValidator.validate).toHaveBeenCalledWith({});

      // Verify repository was NOT called
      expect(mockUserRepository.create).not.toHaveBeenCalled();

      // Verify error was logged
      expect(mockLoggerProvider.error).toHaveBeenCalledWith(
        "Erro ao criar usuário",
        expect.objectContaining({
          metadata: expect.objectContaining({
            error: expect.objectContaining({
              name: validationError.name,
              message: validationError.message,
            }),
          }),
        }),
      );
    });

    it("deve registrar logs de trace com dados sanitizados", async () => {
      // Act
      await userCreateService.create(userData);

      // Assert - verify trace log with sanitized data (password redacted)
      expect(mockLoggerProvider.trace).toHaveBeenCalledWith(
        "Dados sanitizados com sucesso",
        expect.objectContaining({
          metadata: expect.objectContaining({
            sanitizedData: expect.objectContaining({
              password: "[REDACTED]",
            }),
          }),
        }),
      );
    });
  });
});
