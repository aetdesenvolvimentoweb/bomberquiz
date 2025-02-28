import {
  LogLevel,
  LogPayload,
  LoggerProvider,
} from "../domain/providers/logger.provider";

export class LoggerProviderMock implements LoggerProvider {
  public logs: Array<{
    level: LogLevel;
    message: string;
    payload?: LogPayload;
  }> = [];

  public readonly log = (
    level: LogLevel,
    message: string,
    payload?: LogPayload,
  ): void => {
    this.logs.push({ level, message, payload });
  };

  public readonly debug = (message: string, payload?: LogPayload): void => {
    this.log(LogLevel.DEBUG, message, payload);
  };

  public readonly info = (message: string, payload?: LogPayload): void => {
    this.log(LogLevel.INFO, message, payload);
  };

  public readonly warn = (message: string, payload?: LogPayload): void => {
    this.log(LogLevel.WARN, message, payload);
  };

  public readonly error = (message: string, payload?: LogPayload): void => {
    this.log(LogLevel.ERROR, message, payload);
  };
}
