/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const logObject = {
      level,
      message,
      timestamp: new Date().toISOString(),
      payload: payload || {},
    };

    // Handle circular references
    const getCircularReplacer = () => {
      const seen = new WeakSet();
      return (key: string, value: any) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular Reference]";
          }
          seen.add(value);
        }
        // Include error stack for Error objects
        if (value instanceof Error) {
          return {
            ...value,
            stack: value.stack, // Only add the stack, no need to repeat message
          };
        }
        return value;
      };
    };

    return JSON.stringify(logObject, getCircularReplacer(), 2);
  }

  log(level: LogLevel, message: string, payload?: LogPayload): void {
    const formattedLog = this.formatLog(level, message, payload);

    // Use appropriate console method based on log level
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

  info(message: string, payload?: LogPayload): void {
    this.log(LogLevel.INFO, message, payload);
  }

  error(message: string, payload?: LogPayload): void {
    this.log(LogLevel.ERROR, message, payload);
  }

  warn(message: string, payload?: LogPayload): void {
    this.log(LogLevel.WARN, message, payload);
  }

  debug(message: string, payload?: LogPayload): void {
    this.log(LogLevel.DEBUG, message, payload);
  }
}
