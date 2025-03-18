import {
  LoggerProvider,
  LogLevel,
  LogPayload,
} from "@/backend/domain/providers/logger-provider";

/**
 * Implementação do LoggerProvider utilizando console.log do Node.js
 *
 * Esta classe fornece uma implementação simples do contrato LoggerProvider
 * utilizando as funções nativas de console do Node.js para registrar logs
 * em diferentes níveis.
 *
 * @implements {LoggerProvider}
 */
export class ConsoleLogger implements LoggerProvider {
  /**
   * Contexto padrão que será incluído em todos os logs
   */
  private context: Partial<LogPayload>;

  /**
   * Cria uma nova instância do ConsoleLogger
   *
   * @param {Partial<LogPayload>} [initialContext={}] - Contexto inicial opcional para todos os logs
   */
  constructor(initialContext: Partial<LogPayload> = {}) {
    this.context = initialContext;
  }

  /**
   * Método principal para registrar logs em qualquer nível
   *
   * @param {LogLevel} level - Nível de severidade do log
   * @param {string} message - Mensagem descritiva do evento
   * @param {LogPayload} [payload] - Dados contextuais adicionais
   */
  log(level: LogLevel, message: string, payload?: LogPayload): void {
    // Combina o contexto padrão com o payload específico deste log
    const combinedPayload = {
      ...this.context,
      ...payload,
    };

    // Formata a mensagem com timestamp
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    // Determina qual método do console usar com base no nível
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage, combinedPayload);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, combinedPayload);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, combinedPayload);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage, combinedPayload);
        break;
      case LogLevel.TRACE:
        console.trace(formattedMessage, combinedPayload);
        break;
      default:
        console.log(formattedMessage, combinedPayload);
    }
  }

  /**
   * Registra um log de nível ERROR
   *
   * @param {string} message - Mensagem descritiva do erro
   * @param {LogPayload} [payload] - Dados contextuais adicionais
   */
  error(message: string, payload?: LogPayload): void {
    this.log(LogLevel.ERROR, message, payload);
  }

  /**
   * Registra um log de nível WARN
   *
   * @param {string} message - Mensagem descritiva do aviso
   * @param {LogPayload} [payload] - Dados contextuais adicionais
   */
  warn(message: string, payload?: LogPayload): void {
    this.log(LogLevel.WARN, message, payload);
  }

  /**
   * Registra um log de nível INFO
   *
   * @param {string} message - Mensagem informativa
   * @param {LogPayload} [payload] - Dados contextuais adicionais
   */
  info(message: string, payload?: LogPayload): void {
    this.log(LogLevel.INFO, message, payload);
  }

  /**
   * Registra um log de nível DEBUG
   *
   * @param {string} message - Mensagem de debug
   * @param {LogPayload} [payload] - Dados contextuais adicionais
   */
  debug(message: string, payload?: LogPayload): void {
    this.log(LogLevel.DEBUG, message, payload);
  }

  /**
   * Registra um log de nível TRACE
   *
   * @param {string} message - Mensagem de rastreamento detalhada
   * @param {LogPayload} [payload] - Dados contextuais adicionais
   */
  trace(message: string, payload?: LogPayload): void {
    this.log(LogLevel.TRACE, message, payload);
  }

  /**
   * Cria uma nova instância do logger com contexto adicional
   *
   * @param {Partial<LogPayload>} context - Contexto a ser incluído em todos os logs
   * @returns {LoggerProvider} Nova instância do logger com o contexto incorporado
   */
  withContext(context: Partial<LogPayload>): LoggerProvider {
    // Cria um novo logger com o contexto combinado
    return new ConsoleLogger({
      ...this.context,
      ...context,
    });
  }
}
