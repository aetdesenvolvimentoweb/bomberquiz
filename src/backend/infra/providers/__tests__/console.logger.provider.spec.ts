import { LogLevel, LogPayload } from "@/backend/domain/providers";
import { ConsoleLoggerProvider } from "../console.logger.provider";

describe("ConsoleLoggerProvider", () => {
  let logger: ConsoleLoggerProvider;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new ConsoleLoggerProvider();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    consoleInfoSpy = jest.spyOn(console, "info").mockImplementation();
    consoleDebugSpy = jest.spyOn(console, "debug").mockImplementation();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("log method", () => {
    it("should call console.error for ERROR level", () => {
      const message = "Error message";
      const payload: LogPayload = { action: "test_action" };

      logger.log(LogLevel.ERROR, message, payload);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });

    it("should call console.warn for WARN level", () => {
      const message = "Warning message";
      const payload: LogPayload = { action: "test_action" };

      logger.log(LogLevel.WARN, message, payload);

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });

    it("should call console.info for INFO level", () => {
      const message = "Info message";
      const payload: LogPayload = { action: "test_action" };

      logger.log(LogLevel.INFO, message, payload);

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });

    it("should call console.debug for DEBUG level", () => {
      const message = "Debug message";
      const payload: LogPayload = { action: "test_action" };

      logger.log(LogLevel.DEBUG, message, payload);

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      expect(consoleDebugSpy).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });

    it("should call console.log for unknown level", () => {
      const message = "Unknown level message";
      const payload: LogPayload = { action: "test_action" };
      const unknownLevel = "UNKNOWN" as LogLevel;

      logger.log(unknownLevel, message, payload);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining(message),
      );
    });

    it("should include error stack in log for ERROR level with Error object", () => {
      const message = "Error with stack";
      const error = new Error("Test error");
      const payload: LogPayload = { action: "test_action", error };

      logger.log(LogLevel.ERROR, message, payload);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("stack"),
      );
    });

    it("should handle circular references in payload", () => {
      const message = "Circular reference";
      const circularObj: Record<string, unknown> = { name: "circular" };
      circularObj.self = circularObj;
      const payload: LogPayload = {
        action: "test_action",
        metadata: circularObj,
      };

      // This should not throw an error
      expect(() => {
        logger.log(LogLevel.INFO, message, payload);
      }).not.toThrow();
    });
  });

  describe("convenience methods", () => {
    it("should call log with ERROR level from error method", () => {
      const logSpy = jest.spyOn(logger, "log");
      const message = "Error method";
      const payload: LogPayload = { action: "test_action" };

      logger.error(message, payload);

      expect(logSpy).toHaveBeenCalledWith(LogLevel.ERROR, message, payload);
    });

    it("should call log with WARN level from warn method", () => {
      const logSpy = jest.spyOn(logger, "log");
      const message = "Warn method";
      const payload: LogPayload = { action: "test_action" };

      logger.warn(message, payload);

      expect(logSpy).toHaveBeenCalledWith(LogLevel.WARN, message, payload);
    });

    it("should call log with INFO level from info method", () => {
      const logSpy = jest.spyOn(logger, "log");
      const message = "Info method";
      const payload: LogPayload = { action: "test_action" };

      logger.info(message, payload);

      expect(logSpy).toHaveBeenCalledWith(LogLevel.INFO, message, payload);
    });

    it("should call log with DEBUG level from debug method", () => {
      const logSpy = jest.spyOn(logger, "log");
      const message = "Debug method";
      const payload: LogPayload = { action: "test_action" };

      logger.debug(message, payload);

      expect(logSpy).toHaveBeenCalledWith(LogLevel.DEBUG, message, payload);
    });
  });
});
