import {
  LogLevel,
  LogPayload,
  LoggerProvider,
} from "@/backend/domain/providers";

export class ConsoleLoggerProvider implements LoggerProvider {
  private formatLog(
    level: LogLevel,
    message: string,
    payload?: LogPayload,
  ): string {
    const timestamp = new Date().toISOString();
    let logObject: Record<string, unknown> = {
      timestamp,
      level,
      message,
      ...payload,
    };

    // Para error, incluímos o stack trace se disponível
    if (level === LogLevel.ERROR && payload?.error instanceof Error) {
      logObject = {
        ...logObject,
        stack: payload.error.stack,
      };
    }

    return JSON.stringify(logObject, null, 2);
  }

  log(level: LogLevel, message: string, payload?: LogPayload): void {
    const formattedLog = this.formatLog(level, message, payload);

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
      default:
        console.log(formattedLog);
    }
  }

  error(message: string, payload?: LogPayload): void {
    this.log(LogLevel.ERROR, message, payload);
  }

  warn(message: string, payload?: LogPayload): void {
    this.log(LogLevel.WARN, message, payload);
  }

  info(message: string, payload?: LogPayload): void {
    this.log(LogLevel.INFO, message, payload);
  }

  debug(message: string, payload?: LogPayload): void {
    this.log(LogLevel.DEBUG, message, payload);
  }
}
