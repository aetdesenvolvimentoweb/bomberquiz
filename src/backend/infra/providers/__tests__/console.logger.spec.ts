/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogLevel, LogPayload } from "@/backend/domain/providers";
import { ConsoleLoggerProvider } from "@/backend/infra/providers";

describe("ConsoleLoggerProvider", () => {
  let consoleLoggerProvider: ConsoleLoggerProvider;
  let consoleLogSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLoggerProvider = new ConsoleLoggerProvider();
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    consoleInfoSpy = jest.spyOn(console, "info").mockImplementation();
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    consoleDebugSpy = jest.spyOn(console, "debug").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("log method", () => {
    it("should log using console.log for unrecognized log levels", () => {
      const message = "Test message";
      const payload: LogPayload = { action: "test data" };

      // @ts-expect-error - Testing with invalid log level
      consoleLoggerProvider.log("INVALID_LEVEL", message, payload);

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy.mock.calls[0][0]).toContain(message);
      expect(consoleLogSpy.mock.calls[0][0]).toContain("test data");
    });

    it("should log using console.error for ERROR level", () => {
      const message = "Error message";
      consoleLoggerProvider.log(LogLevel.ERROR, message);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy.mock.calls[0][0]).toContain(message);
      expect(consoleErrorSpy.mock.calls[0][0]).toContain(LogLevel.ERROR);
    });

    it("should log using console.warn for WARN level", () => {
      const message = "Warning message";
      consoleLoggerProvider.log(LogLevel.WARN, message);

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy.mock.calls[0][0]).toContain(message);
      expect(consoleWarnSpy.mock.calls[0][0]).toContain(LogLevel.WARN);
    });

    it("should log using console.info for INFO level", () => {
      const message = "Info message";
      consoleLoggerProvider.log(LogLevel.INFO, message);

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy.mock.calls[0][0]).toContain(message);
      expect(consoleInfoSpy.mock.calls[0][0]).toContain(LogLevel.INFO);
    });

    it("should log using console.debug for DEBUG level", () => {
      const message = "Debug message";
      consoleLoggerProvider.log(LogLevel.DEBUG, message);

      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
      expect(consoleDebugSpy.mock.calls[0][0]).toContain(message);
      expect(consoleDebugSpy.mock.calls[0][0]).toContain(LogLevel.DEBUG);
    });
  });

  describe("convenience methods", () => {
    it("should call log with INFO level when using info method", () => {
      const logSpy = jest.spyOn(consoleLoggerProvider, "log");
      const message = "Info message";
      const payload = { action: "test" };

      consoleLoggerProvider.info(message, payload);

      expect(logSpy).toHaveBeenCalledWith(LogLevel.INFO, message, payload);
      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
    });

    it("should call log with ERROR level when using error method", () => {
      const logSpy = jest.spyOn(consoleLoggerProvider, "log");
      const message = "Error message";
      const payload = { error: new Error("Test error") };

      consoleLoggerProvider.error(message, payload);

      expect(logSpy).toHaveBeenCalledWith(LogLevel.ERROR, message, payload);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it("should call log with WARN level when using warn method", () => {
      const logSpy = jest.spyOn(consoleLoggerProvider, "log");
      const message = "Warning message";

      consoleLoggerProvider.warn(message);

      expect(logSpy).toHaveBeenCalledWith(LogLevel.WARN, message, undefined);
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    });

    it("should call log with DEBUG level when using debug method", () => {
      const logSpy = jest.spyOn(consoleLoggerProvider, "log");
      const message = "Debug message";

      consoleLoggerProvider.debug(message);

      expect(logSpy).toHaveBeenCalledWith(LogLevel.DEBUG, message, undefined);
      expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("formatLog functionality", () => {
    it("should handle circular references in payload", () => {
      const message = "Circular reference test";

      const circularObj: any = { name: "circular" };
      circularObj.self = circularObj;

      consoleLoggerProvider.info(message, { action: circularObj });

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      expect(consoleInfoSpy.mock.calls[0][0]).toContain("[Circular Reference]");
    });

    it("should format Error objects correctly", () => {
      const message = "Error object test";
      const error = new Error("Test error");

      consoleLoggerProvider.error(message, { error });

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      const logString = consoleErrorSpy.mock.calls[0][0];
      expect(logString).toContain("Test error");
      expect(logString).toContain("stack");
    });

    it("should include timestamp in log output", () => {
      const message = "Timestamp test";

      consoleLoggerProvider.info(message);

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      const logString = consoleInfoSpy.mock.calls[0][0];

      // Check for ISO date format pattern
      const isoDatePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
      expect(logString).toMatch(isoDatePattern);
    });

    it("should handle empty payload gracefully", () => {
      const message = "Empty payload test";

      consoleLoggerProvider.info(message);

      expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
      const logString = consoleInfoSpy.mock.calls[0][0];
      expect(logString).toContain('"payload": {}');
    });
  });
});
