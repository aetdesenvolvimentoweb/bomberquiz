import { ApplicationError } from "./application.error";

/**
 * Erro específico para problemas relacionados ao banco de dados
 * @extends {ApplicationError}
 */
export class DatabaseError extends ApplicationError {
  /**
   * @param message Mensagem descritiva do erro
   * @param originalError Erro original que causou o problema (opcional)
   */
  constructor(
    message: string,
    readonly originalError?: unknown,
  ) {
    super(message, 500); // Código 500 - Internal Server Error
    this.name = "DatabaseError";
  }
}
