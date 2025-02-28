import { LogLevel, LogPayload } from "@/backend/domain/providers";
import { ConsoleLoggerProvider } from "../console.logger.provider";

interface SutResponses {
  logger: ConsoleLoggerProvider;
  consoleLogSpy: jest.SpyInstance;
  consoleInfoSpy: jest.SpyInstance;
  consoleWarnSpy: jest.SpyInstance;
  consoleErrorSpy: jest.SpyInstance;
  consoleDebugSpy: jest.SpyInstance;
}

/**
 * Teste de integração para o ConsoleLoggerProvider
 *
 * Este teste verifica a integração entre:
 * - ConsoleLoggerProvider
 * - Console do Node.js
 * - Tratamento de casos complexos (referências circulares, objetos de erro)
 */
describe("ConsoleLoggerProvider Integration", () => {
  const makeSut = (): SutResponses => {
    const logger = new ConsoleLoggerProvider();

    // Interceptar chamadas ao console
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    const consoleInfoSpy = jest.spyOn(console, "info").mockImplementation();
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const consoleDebugSpy = jest.spyOn(console, "debug").mockImplementation();

    return {
      logger,
      consoleLogSpy,
      consoleInfoSpy,
      consoleWarnSpy,
      consoleErrorSpy,
      consoleDebugSpy,
    };
  };

  afterEach(() => {
    // Restaurar o console original após cada teste
    jest.restoreAllMocks();
  });

  describe("Integration with Node.js console", () => {
    // Usando test.each para testar diferentes níveis de log
    const logLevelCases = [
      {
        level: "info",
        consoleMethod: "info",
        message: "Info test message",
      },
      {
        level: "error",
        consoleMethod: "error",
        message: "Error test message",
      },
      {
        level: "warn",
        consoleMethod: "warn",
        message: "Warning test message",
      },
      {
        level: "debug",
        consoleMethod: "debug",
        message: "Debug test message",
      },
      {
        level: "custom",
        consoleMethod: "log",
        message: "Custom log message",
      },
    ];

    test.each(logLevelCases)(
      "should call console.$consoleMethod for $level level logs",
      ({ level, message }) => {
        const {
          logger,
          consoleLogSpy,
          consoleInfoSpy,
          consoleWarnSpy,
          consoleErrorSpy,
          consoleDebugSpy,
        } = makeSut();

        // Chamar o método de log apropriado
        if (level === "custom") {
          logger.log(level as LogLevel, message);
          expect(consoleLogSpy).toHaveBeenCalledTimes(1);
          const logJson = JSON.parse(consoleLogSpy.mock.calls[0][0]);
          expect(logJson.level).toBe(level);
          expect(logJson.message).toBe(message);
        } else {
          logger[level as "info" | "error" | "warn" | "debug"](message);

          // Obter o spy correspondente
          const spyMap = {
            info: consoleInfoSpy,
            error: consoleErrorSpy,
            warn: consoleWarnSpy,
            debug: consoleDebugSpy,
          };

          const spy = spyMap[level as keyof typeof spyMap];
          expect(spy).toHaveBeenCalledTimes(1);
          const logJson = JSON.parse(spy.mock.calls[0][0]);
          expect(logJson.level).toBe(level);
          expect(logJson.message).toBe(message);
        }
      },
    );
  });

  describe("Complex cases handling", () => {
    it("should handle error objects correctly", () => {
      const { logger, consoleErrorSpy } = makeSut();

      // Vamos criar um objeto de erro manualmente para garantir que ele seja serializado corretamente
      const errorObj = {
        message: "Erro de teste",
        stack: "Stack simulado",
      };

      const payload: LogPayload = {
        error: errorObj as unknown as Error,
      };

      logger.error("Erro ocorreu", payload);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const logJson = JSON.parse(consoleErrorSpy.mock.calls[0][0]);

      // Verificar se o erro foi serializado corretamente
      expect(logJson.payload.error).toBeDefined();
      expect(logJson.payload.error.message).toBe("Erro de teste");
      expect(logJson.payload.error.stack).toBe("Stack simulado");
    });

    it("should handle circular references correctly", () => {
      const { logger, consoleInfoSpy } = makeSut();

      // Criar um objeto com referência circular
      interface CircularObject {
        name: string;
        self?: CircularObject;
      }

      const circularObj: CircularObject = { name: "objeto circular" };
      circularObj.self = circularObj; // Referência circular

      const payload: LogPayload = {
        metadata: {
          circularObj,
          normalData: "dados normais",
        },
      };

      logger.info("Objeto com referência circular", payload);

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      const logJson = JSON.parse(consoleInfoSpy.mock.calls[0][0]);

      // Verificar se a referência circular foi tratada
      expect(logJson.payload.metadata.circularObj.name).toBe("objeto circular");
      expect(logJson.payload.metadata.circularObj.self).toBe(
        "[Circular Reference]",
      );
      expect(logJson.payload.metadata.normalData).toBe("dados normais");
    });

    it("should handle nested objects with circular references", () => {
      const { logger, consoleInfoSpy } = makeSut();

      // Criar objetos aninhados com referências circulares
      interface NestedObject {
        name: string;
        parent?: NestedObject;
        child?: NestedObject;
      }

      const parent: NestedObject = { name: "parent" };
      const child: NestedObject = { name: "child", parent };
      parent.child = child; // Referência circular

      const payload: LogPayload = {
        metadata: {
          complexObject: parent,
        },
      };

      logger.info("Objeto aninhado com referência circular", payload);

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      const logJson = JSON.parse(consoleInfoSpy.mock.calls[0][0]);

      // Verificar se as referências circulares foram tratadas
      expect(logJson.payload.metadata.complexObject.name).toBe("parent");
      expect(logJson.payload.metadata.complexObject.child.name).toBe("child");
      expect(logJson.payload.metadata.complexObject.child.parent).toBe(
        "[Circular Reference]",
      );
    });

    it("should handle deeply nested objects with circular references", () => {
      const { logger, consoleInfoSpy } = makeSut();

      // Criar uma estrutura complexa com múltiplos níveis e referências circulares
      interface DeepObject {
        name: string;
        parent?: DeepObject;
        child?: DeepObject;
        root?: DeepObject;
      }

      const level1: DeepObject = { name: "level1" };
      const level2: DeepObject = { name: "level2", parent: level1 };
      const level3: DeepObject = { name: "level3", parent: level2 };
      level1.child = level2;
      level2.child = level3;
      level3.root = level1; // Referência circular

      const payload: LogPayload = {
        metadata: {
          deepStructure: level1,
          timestamp: new Date(),
          requestId: "123456",
        },
      };

      logger.info("Estrutura profundamente aninhada", payload);

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      const logJson = JSON.parse(consoleInfoSpy.mock.calls[0][0]);

      // Verificar se a estrutura foi serializada corretamente
      expect(logJson.payload.metadata.deepStructure.name).toBe("level1");
      expect(logJson.payload.metadata.deepStructure.child.name).toBe("level2");
      expect(logJson.payload.metadata.deepStructure.child.child.name).toBe(
        "level3",
      );
      expect(logJson.payload.metadata.deepStructure.child.child.root).toBe(
        "[Circular Reference]",
      );
      expect(logJson.payload.metadata.requestId).toBe("123456");
    });
  });

  describe("Log format", () => {
    it("should include timestamp in all logs", () => {
      const { logger, consoleInfoSpy } = makeSut();

      logger.info("Timestamp test");

      const logJson = JSON.parse(consoleInfoSpy.mock.calls[0][0]);
      expect(logJson.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // Formato ISO
    });

    it("should include empty payload when not provided", () => {
      const { logger, consoleInfoSpy } = makeSut();

      logger.info("No payload");

      const logJson = JSON.parse(consoleInfoSpy.mock.calls[0][0]);
      expect(logJson.payload).toEqual({});
    });

    it("should format log as indented JSON", () => {
      const { logger, consoleInfoSpy } = makeSut();

      logger.info("Format test", {
        metadata: {
          testKey: "value",
        },
      });

      const logString = consoleInfoSpy.mock.calls[0][0];
      expect(logString).toContain('\n  "level": "info"');
      expect(logString).toContain('\n  "message": "Format test"');
      expect(logString).toContain('\n  "payload": {');
      expect(logString).toContain('\n    "metadata": {');
      expect(logString).toContain('\n      "testKey": "value"');
    });
  });
});
