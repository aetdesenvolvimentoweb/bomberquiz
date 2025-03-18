/**
 * Testes unitários para a classe ConsoleLogger
 *
 * Este arquivo contém testes que verificam o comportamento da implementação
 * ConsoleLogger do contrato LoggerProvider.
 *
 * @group Unit
 * @group Providers
 * @group Logger
 */

import { ConsoleLogger } from "@/backend/infra/providers";
import {
  LogLevel,
  LogPayload,
} from "@/backend/domain/providers/logger-provider";

describe("ConsoleLogger", () => {
  // Backup dos métodos originais do console
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleInfo = console.info;
  const originalConsoleDebug = console.debug;
  const originalConsoleTrace = console.trace;

  // Mocks para os métodos do console
  let consoleLogMock: jest.Mock;
  let consoleErrorMock: jest.Mock;
  let consoleWarnMock: jest.Mock;
  let consoleInfoMock: jest.Mock;
  let consoleDebugMock: jest.Mock;
  let consoleTraceMock: jest.Mock;

  // Setup antes de cada teste
  beforeEach(() => {
    // Cria mocks para todos os métodos do console
    consoleLogMock = jest.fn();
    consoleErrorMock = jest.fn();
    consoleWarnMock = jest.fn();
    consoleInfoMock = jest.fn();
    consoleDebugMock = jest.fn();
    consoleTraceMock = jest.fn();

    // Substitui os métodos originais pelos mocks
    console.log = consoleLogMock;
    console.error = consoleErrorMock;
    console.warn = consoleWarnMock;
    console.info = consoleInfoMock;
    console.debug = consoleDebugMock;
    console.trace = consoleTraceMock;

    // Mock para Date.toISOString para tornar os testes determinísticos
    jest
      .spyOn(Date.prototype, "toISOString")
      .mockReturnValue("2023-01-01T00:00:00.000Z");
  });

  // Cleanup após cada teste
  afterEach(() => {
    // Restaura os métodos originais do console
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.info = originalConsoleInfo;
    console.debug = originalConsoleDebug;
    console.trace = originalConsoleTrace;

    // Limpa todos os mocks
    jest.restoreAllMocks();
  });

  describe("constructor", () => {
    it("deve criar uma instância sem contexto inicial", () => {
      // Act
      const logger = new ConsoleLogger();

      // Assert
      expect(logger).toBeInstanceOf(ConsoleLogger);
    });

    it("deve criar uma instância com contexto inicial", () => {
      // Arrange
      const initialContext: Partial<LogPayload> = {
        requestId: "123",
        userId: "user-456",
      };

      // Act
      const logger = new ConsoleLogger(initialContext);

      // Assert
      expect(logger).toBeInstanceOf(ConsoleLogger);

      // Verificar se o contexto é aplicado nos logs
      logger.info("Test message");
      expect(consoleInfoMock).toHaveBeenCalledWith(
        expect.stringContaining("[INFO] Test message"),
        expect.objectContaining(initialContext),
      );
    });
  });

  describe("log method", () => {
    it("deve chamar o método correto do console com base no nível", () => {
      // Arrange
      const logger = new ConsoleLogger();
      const message = "Test message";

      // Act & Assert
      logger.log(LogLevel.ERROR, message);
      expect(consoleErrorMock).toHaveBeenCalledWith(
        expect.stringContaining("[ERROR] Test message"),
        expect.any(Object),
      );

      logger.log(LogLevel.WARN, message);
      expect(consoleWarnMock).toHaveBeenCalledWith(
        expect.stringContaining("[WARN] Test message"),
        expect.any(Object),
      );

      logger.log(LogLevel.INFO, message);
      expect(consoleInfoMock).toHaveBeenCalledWith(
        expect.stringContaining("[INFO] Test message"),
        expect.any(Object),
      );

      logger.log(LogLevel.DEBUG, message);
      expect(consoleDebugMock).toHaveBeenCalledWith(
        expect.stringContaining("[DEBUG] Test message"),
        expect.any(Object),
      );

      logger.log(LogLevel.TRACE, message);
      expect(consoleTraceMock).toHaveBeenCalledWith(
        expect.stringContaining("[TRACE] Test message"),
        expect.any(Object),
      );

      // Teste para nível desconhecido (fallback para console.log)
      logger.log("unknown" as LogLevel, message);
      expect(consoleLogMock).toHaveBeenCalledWith(
        expect.stringContaining("[UNKNOWN] Test message"),
        expect.any(Object),
      );
    });

    it("deve incluir timestamp na mensagem formatada", () => {
      // Arrange
      const logger = new ConsoleLogger();
      const message = "Test message";

      // Act
      logger.log(LogLevel.INFO, message);

      // Assert
      expect(consoleInfoMock).toHaveBeenCalledWith(
        "[2023-01-01T00:00:00.000Z] [INFO] Test message",
        expect.any(Object),
      );
    });

    it("deve combinar o contexto padrão com o payload específico", () => {
      // Arrange
      const initialContext: Partial<LogPayload> = {
        requestId: "123",
        source: "test-service",
      };

      const specificPayload: Partial<LogPayload> = {
        action: "test-action",
        userId: "user-456",
      };

      const logger = new ConsoleLogger(initialContext);

      // Act
      logger.log(LogLevel.INFO, "Test message", specificPayload);

      // Assert
      expect(consoleInfoMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          ...initialContext,
          ...specificPayload,
        }),
      );
    });
  });

  describe("convenience methods", () => {
    it("deve chamar log com o nível ERROR para o método error", () => {
      // Arrange
      const logger = new ConsoleLogger();
      const message = "Error message";
      const payload: Partial<LogPayload> = { error: new Error("Test error") };

      // Act
      logger.error(message, payload);

      // Assert
      expect(consoleErrorMock).toHaveBeenCalledWith(
        expect.stringContaining("[ERROR] Error message"),
        expect.objectContaining(payload),
      );
    });

    it("deve chamar log com o nível WARN para o método warn", () => {
      // Arrange
      const logger = new ConsoleLogger();
      const message = "Warning message";

      // Act
      logger.warn(message);

      // Assert
      expect(consoleWarnMock).toHaveBeenCalledWith(
        expect.stringContaining("[WARN] Warning message"),
        expect.any(Object),
      );
    });

    it("deve chamar log com o nível INFO para o método info", () => {
      // Arrange
      const logger = new ConsoleLogger();
      const message = "Info message";

      // Act
      logger.info(message);

      // Assert
      expect(consoleInfoMock).toHaveBeenCalledWith(
        expect.stringContaining("[INFO] Info message"),
        expect.any(Object),
      );
    });

    it("deve chamar log com o nível DEBUG para o método debug", () => {
      // Arrange
      const logger = new ConsoleLogger();
      const message = "Debug message";

      // Act
      logger.debug(message);

      // Assert
      expect(consoleDebugMock).toHaveBeenCalledWith(
        expect.stringContaining("[DEBUG] Debug message"),
        expect.any(Object),
      );
    });

    it("deve chamar log com o nível TRACE para o método trace", () => {
      // Arrange
      const logger = new ConsoleLogger();
      const message = "Trace message";

      // Act
      logger.trace(message);

      // Assert
      expect(consoleTraceMock).toHaveBeenCalledWith(
        expect.stringContaining("[TRACE] Trace message"),
        expect.any(Object),
      );
    });
  });

  describe("withContext method", () => {
    it("deve criar uma nova instância com o contexto combinado", () => {
      // Arrange
      const initialContext: Partial<LogPayload> = {
        requestId: "123",
        source: "test-service",
      };

      const additionalContext: Partial<LogPayload> = {
        userId: "user-456",
        action: "test-action",
      };

      const logger = new ConsoleLogger(initialContext);

      // Act
      const contextualLogger = logger.withContext(additionalContext);

      // Assert
      expect(contextualLogger).toBeInstanceOf(ConsoleLogger);
      expect(contextualLogger).not.toBe(logger); // Deve ser uma nova instância

      // Verificar se o contexto combinado é aplicado
      contextualLogger.info("Test message");
      expect(consoleInfoMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          ...initialContext,
          ...additionalContext,
        }),
      );
    });

    it("deve sobrescrever propriedades de contexto com o mesmo nome", () => {
      // Arrange
      const initialContext: Partial<LogPayload> = {
        requestId: "123",
        userId: "old-user",
      };

      const newContext: Partial<LogPayload> = {
        userId: "new-user", // Deve sobrescrever o userId anterior
      };

      const logger = new ConsoleLogger(initialContext);

      // Act
      const contextualLogger = logger.withContext(newContext);
      contextualLogger.info("Test message");

      // Assert
      expect(consoleInfoMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          requestId: "123",
          userId: "new-user", // Valor atualizado
        }),
      );
    });

    it("deve permitir encadeamento de contextos", () => {
      // Arrange
      const logger = new ConsoleLogger();

      // Act
      const contextualLogger1 = logger.withContext({ requestId: "123" });
      const contextualLogger2 = contextualLogger1.withContext({
        userId: "user-456",
      });
      const contextualLogger3 = contextualLogger2.withContext({
        action: "test-action",
      });

      contextualLogger3.info("Test message");

      // Assert
      expect(consoleInfoMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          requestId: "123",
          userId: "user-456",
          action: "test-action",
        }),
      );
    });
  });

  describe("integração com objetos de erro", () => {
    it("deve lidar corretamente com objetos Error no payload", () => {
      // Arrange
      const logger = new ConsoleLogger();
      const testError = new Error("Test error message");
      testError.stack = "Error: Test error message\n    at TestFunction";

      const payload: Partial<LogPayload> = {
        error: testError,
      };

      // Act
      logger.error("An error occurred", payload);

      // Assert
      expect(consoleErrorMock).toHaveBeenCalledWith(
        expect.stringContaining("[ERROR] An error occurred"),
        expect.objectContaining({
          error: expect.objectContaining({
            message: "Test error message",
            stack: expect.stringContaining("Error: Test error message"),
          }),
        }),
      );
    });
  });
});
