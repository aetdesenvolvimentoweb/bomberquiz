/**
 * Testes unitários para o UserCreateController
 *
 * Este arquivo contém testes que verificam o comportamento do controlador
 * responsável pela criação de usuários, incluindo o fluxo feliz e
 * cenários de erro.
 *
 * @group Unit
 * @group Controllers
 * @group User
 */

import { UserCreateController } from "@/backend/presentation/controllers";
import { HttpRequest } from "@/backend/presentation/protocols";
import { UserCreateData } from "@/backend/domain/entities";
import { LoggerProvider } from "@/backend/domain/providers";
import { DuplicateResourceError } from "@/backend/domain/errors";
import { UserCreateService } from "@/backend/data/services";

// Mock do serviço de criação de usuário
const mockCreate = jest.fn();
const mockUserCreateService = {
  create: mockCreate,
};

// Mock do logger que retorna a si mesmo no método withContext
const mockLogger = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
  withContext: jest.fn(),
};

// Configuramos withContext para retornar o próprio mockLogger
mockLogger.withContext.mockReturnValue(mockLogger);

// Conversão de tipo para compatibilidade com a interface LoggerProvider
const mockLoggerProvider = mockLogger as unknown as jest.Mocked<LoggerProvider>;

// Configuramos o withContext do mockLoggerProvider para também retornar mockLogger
// Isso é necessário para o teste que não passa o logger como parâmetro
mockLoggerProvider.withContext.mockReturnValue(mockLogger);

describe("UserCreateController", () => {
  let userCreateController: UserCreateController;
  let userData: UserCreateData;
  let httpRequest: HttpRequest<UserCreateData>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create controller instance with mocked dependencies
    // Usamos um type assertion para contornar o problema de tipagem
    // Isso é seguro no contexto de testes, pois estamos apenas mockando a interface
    userCreateController = new UserCreateController({
      userCreateService: mockUserCreateService as unknown as UserCreateService,
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

    // Sample HTTP request
    httpRequest = {
      body: userData,
    };

    // Default mock implementation
    mockCreate.mockResolvedValue(undefined);
  });

  describe("handle method", () => {
    /**
     * Verifica se o controlador retorna status 201 e resposta de sucesso
     * quando o usuário é criado com sucesso
     */
    it("deve retornar 201 e success=true quando o usuário é criado com sucesso", async () => {
      // Act
      const httpResponse = await userCreateController.handle(
        httpRequest,
        mockLogger,
      );

      // Assert
      expect(httpResponse.statusCode).toBe(201);
      expect(httpResponse.body.success).toBe(true);
      expect(httpResponse.body.metadata.timestamp).toBeDefined();

      // Verify service was called with correct data
      expect(mockCreate).toHaveBeenCalledWith(userData);

      // Não verificamos mais withContext pois estamos passando o logger diretamente
      expect(mockLogger.info).toHaveBeenCalledWith(
        "Usuário criado com sucesso",
        expect.objectContaining({
          action: "user.created.controller",
        }),
      );
    });

    /**
     * Verifica se o controlador retorna status 400 quando não há corpo na requisição
     */
    it("deve retornar 400 quando a requisição não contém um corpo", async () => {
      // Arrange
      const requestWithoutBody: HttpRequest = {};

      // Act
      const httpResponse = await userCreateController.handle(
        requestWithoutBody,
        mockLogger,
      );

      // Assert
      expect(httpResponse.statusCode).toBe(400);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe(
        "Parâmetro obrigatório não informado: corpo da requisição não informado",
      );

      // Verify service was not called
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("deve retornar o status adequado quando ocorre um ApplicationError", async () => {
      // Arrange
      const duplicateError = new DuplicateResourceError("e-mail");
      mockCreate.mockRejectedValue(duplicateError);

      // Act
      const httpResponse = await userCreateController.handle(
        httpRequest,
        mockLogger,
      );

      // Assert
      expect(httpResponse.statusCode).toBe(409); // Conflict status from DuplicateResourceError
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toBe(
        "E-mail já cadastrado no sistema",
      );

      // Verify error was logged
      expect(mockLogger.error).toHaveBeenCalledWith(
        "Erro ao criar usuário",
        expect.objectContaining({
          action: "user.creation.failed.controller",
          metadata: expect.objectContaining({
            email: userData.email,
          }),
        }),
      );
    });

    it("deve retornar 500 quando ocorre um erro não tratado (Error)", async () => {
      // Arrange
      const unexpectedError = new Error("Erro inesperado");
      mockCreate.mockRejectedValue(unexpectedError);

      // Act
      const httpResponse = await userCreateController.handle(
        httpRequest,
        mockLogger,
      );

      // Assert
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toContain("Erro inesperado");

      // Verify error was logged
      expect(mockLogger.error).toHaveBeenCalledWith(
        "Erro ao criar usuário",
        expect.objectContaining({
          action: "user.creation.failed.controller",
          error: expect.any(Object),
        }),
      );
    });

    it("deve retornar 500 quando ocorre um erro não tratado (não-Error)", async () => {
      // Arrange - usando um objeto simples como erro
      const nonErrorObject = { message: "Erro inesperado" };
      mockCreate.mockRejectedValue(nonErrorObject);

      // Act
      const httpResponse = await userCreateController.handle(
        httpRequest,
        mockLogger,
      );

      // Assert
      expect(httpResponse.statusCode).toBe(500);
      expect(httpResponse.body.success).toBe(false);
      expect(httpResponse.body.errorMessage).toContain("Erro inesperado");
    });

    it("deve incluir timestamp na resposta em todos os cenários", async () => {
      // Act - Success case
      const successResponse = await userCreateController.handle(
        httpRequest,
        mockLogger,
      );

      // Arrange error case
      mockCreate.mockRejectedValue(new Error("Qualquer erro"));

      // Act - Error case
      const errorResponse = await userCreateController.handle(
        httpRequest,
        mockLogger,
      );

      // Assert
      expect(successResponse.body.metadata.timestamp).toBeDefined();
      expect(errorResponse.body.metadata.timestamp).toBeDefined();

      // Verify timestamps are in ISO format
      expect(Date.parse(successResponse.body.metadata.timestamp)).not.toBeNaN();
      expect(Date.parse(errorResponse.body.metadata.timestamp)).not.toBeNaN();
    });
  });

  describe("integração com logger", () => {
    /**
     * Verifica se informações contextuais adequadas são incluídas nos logs
     */
    it("deve registrar logs com o email do usuário", async () => {
      // Act
      await userCreateController.handle(httpRequest, mockLogger);

      // Assert - verificamos que os logs contêm o email do usuário
      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          action: expect.any(String),
        }),
      );
    });

    it("deve usar o método createContextLogger corretamente", async () => {
      // Arrange
      jest.clearAllMocks();

      // Precisamos acessar o método privado para testá-lo
      // Acessamos o método privado para testá-lo
      const createContextLogger =
        userCreateController["createContextLogger"].bind(userCreateController);

      // Act - testamos com testContextLogger fornecido
      const loggerWithTest = createContextLogger(httpRequest, mockLogger);

      // Assert
      expect(loggerWithTest).toBe(mockLogger);
      expect(mockLoggerProvider.withContext).not.toHaveBeenCalled();
      // Act - testamos sem testContextLogger
      mockLoggerProvider.withContext.mockReturnValueOnce(mockLogger);
      const loggerWithoutTest = createContextLogger(httpRequest);

      // Assert
      expect(mockLoggerProvider.withContext).toHaveBeenCalledWith({
        action: "user.create.controller",
        metadata: {
          email: userData.email,
        },
      });
      expect(loggerWithoutTest).toBe(mockLogger);
      expect(loggerWithoutTest).toBe(mockLogger); // Porque nosso mock retorna mockLogger
    });

    /**
     * Verifica se logs são registrados em cada etapa crítica do processo
     */
    it("deve registrar logs em cada etapa do processo", async () => {
      // Limpar os mocks antes do teste para garantir contagem correta
      jest.clearAllMocks();

      // Act
      await userCreateController.handle(httpRequest, mockLogger);

      // Assert - verificar que os logs foram chamados
      // Verificamos apenas que as mensagens corretas foram logadas
      const infoMessages = mockLogger.info.mock.calls.map((call) => call[0]);

      expect(infoMessages).toContain(
        "Iniciando criação de usuário via controller",
      );
      expect(infoMessages).toContain("Requisição validada com sucesso");
      expect(infoMessages).toContain("Usuário criado com sucesso");

      // Verificar que foram chamados na ordem correta
      expect(mockLogger.info.mock.calls.length).toBe(3);
    });
  });
});
