export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

export interface LogPayload {
  action?: string;
  userId?: string; // Opcional, será usado quando tivermos autenticação
  metadata?: Record<string, unknown>;
  error?: Error | unknown;
}

export interface LoggerProvider {
  log(level: LogLevel, message: string, payload?: LogPayload): void;
  error(message: string, payload?: LogPayload): void;
  warn(message: string, payload?: LogPayload): void;
  info(message: string, payload?: LogPayload): void;
  debug(message: string, payload?: LogPayload): void;
}
