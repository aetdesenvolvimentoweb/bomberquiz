/**
 * Definições de contratos para o serviço de logs da aplicação
 *
 * Este módulo define a interface e tipos relacionados ao serviço de logs,
 * permitindo a implementação de diferentes estratégias de logging sem
 * alterar o código do domínio.
 */

/**
 * Níveis de log suportados pelo sistema
 *
 * Seguem a convenção padrão de níveis de log, do mais crítico (ERROR)
 * ao mais detalhado (TRACE)
 *
 * @enum {string}
 */
export enum LogLevel {
  /** Erros graves que impedem o funcionamento da aplicação */
  ERROR = "error",
  /** Avisos sobre situações potencialmente problemáticas */
  WARN = "warn",
  /** Informações gerais sobre o fluxo da aplicação */
  INFO = "info",
  /** Informações detalhadas úteis durante o desenvolvimento */
  DEBUG = "debug",
  /** Informações extremamente detalhadas para rastreamento */
  TRACE = "trace",
}

/**
 * Estrutura de dados que contém informações contextuais dos logs
 *
 * @interface
 */
export interface LogPayload {
  /** Ação sendo executada (ex: "user.create", "auth.login") */
  action?: string;
  /** Identificador do usuário que realizou a ação */
  userId?: string; // Opcional, será usado quando tivermos autenticação
  /** Identificador único da requisição para rastreabilidade */
  requestId?: string;
  /** Dados adicionais relevantes para o contexto do log */
  metadata?: Record<string, unknown>;
  /** Objeto de erro quando aplicável */
  error?: Error | unknown;
  /** Tempo de execução em milissegundos */
  duration?: number;
  /** Origem do log (ex: nome do serviço, componente) */
  source?: string;
}

/**
 * Contrato para implementações de serviços de log
 *
 * Define os métodos que qualquer implementação de logger deve fornecer.
 * Suporta diferentes níveis de log e contexto estruturado.
 *
 * @interface
 */
export interface LoggerProvider {
  /**
   * Método principal para registrar logs em qualquer nível
   *
   * @param {LogLevel} level - Nível de severidade do log
   * @param {string} message - Mensagem descritiva do evento
   * @param {LogPayload} [payload] - Dados contextuais adicionais
   */
  log(level: LogLevel, message: string, payload?: LogPayload): void;

  /**
   * Registra um log de nível ERROR
   *
   * @param {string} message - Mensagem descritiva do erro
   * @param {LogPayload} [payload] - Dados contextuais adicionais
   */
  error(message: string, payload?: LogPayload): void;

  /**
   * Registra um log de nível WARN
   *
   * @param {string} message - Mensagem descritiva do aviso
   * @param {LogPayload} [payload] - Dados contextuais adicionais
   */
  warn(message: string, payload?: LogPayload): void;

  /**
   * Registra um log de nível INFO
   *
   * @param {string} message - Mensagem informativa
   * @param {LogPayload} [payload] - Dados contextuais adicionais
   */
  info(message: string, payload?: LogPayload): void;

  /**
   * Registra um log de nível DEBUG
   *
   * @param {string} message - Mensagem de debug
   * @param {LogPayload} [payload] - Dados contextuais adicionais
   */
  debug(message: string, payload?: LogPayload): void;

  /**
   * Registra um log de nível TRACE
   *
   * @param {string} message - Mensagem de rastreamento detalhada
   * @param {LogPayload} [payload] - Dados contextuais adicionais
   */
  trace(message: string, payload?: LogPayload): void;

  /**
   * Cria uma nova instância do logger com contexto adicional
   *
   * Este método permite criar um logger que inclui automaticamente
   * determinado contexto em todas as chamadas subsequentes, útil para
   * injetar informações como requestId ou userId em todos os logs
   * de um mesmo fluxo.
   *
   * @param {Partial<LogPayload>} context - Contexto a ser incluído em todos os logs
   * @returns {LoggerProvider} Nova instância do logger com o contexto incorporado
   *
   * @example
   * // Criar um logger específico para uma requisição
   * const requestLogger = logger.withContext({
   *   requestId: '123abc',
   *   userId: 'user456'
   * });
   *
   * // Todos os logs usarão automaticamente o contexto
   * requestLogger.info('Processando pedido');
   */
  withContext(context: Partial<LogPayload>): LoggerProvider;
}
