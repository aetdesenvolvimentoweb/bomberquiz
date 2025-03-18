import { ApplicationError } from "@/backend/domain/errors";

/**
 * Erro lançado quando ocorre um erro inesperado no servidor
 *
 * Esta classe representa erros internos do servidor que não foram tratados
 * especificamente por outras classes de erro. Estende a classe base ApplicationError
 * e define um código de status HTTP 500 (Internal Server Error).
 *
 * @remarks
 * Este erro deve ser utilizado como um mecanismo de fallback para capturar e
 * encapsular exceções não tratadas, permitindo uma resposta consistente ao cliente
 * enquanto preserva informações sobre o erro original para fins de log e depuração.
 *
 * O uso típico é em blocos try/catch que envolvem operações que podem falhar
 * por razões imprevistas, como falhas de conexão com banco de dados, timeout
 * em serviços externos, ou bugs não detectados.
 *
 * @example
 *
 * // Uso em um controlador ou middleware
 * try {
 *   await userService.performOperation();
 * } catch (error) {
 *   if (error instanceof ApplicationError) {
 *     // Propaga erros de aplicação conhecidos
 *     throw error;
 *   }
 *   // Encapsula erros desconhecidos
 *   throw new ServerError(error instanceof Error ? error : new Error(String(error)));
 * }
 *
 *
 * @extends {ApplicationError}
 */
export class ServerError extends ApplicationError {
  /**
   * Cria uma nova instância de ServerError
   *
   * @param {Error} error - O erro original que causou a falha
   */
  constructor(error: Error) {
    const capitalizedError =
      error.message.charAt(0).toUpperCase() + error.message.slice(1);

    super(`Erro inesperado do servidor. ${capitalizedError}`, 500);

    // Preserva o stack trace original se disponível
    if (error.stack) {
      this.stack = error.stack;
    }
  }
}
