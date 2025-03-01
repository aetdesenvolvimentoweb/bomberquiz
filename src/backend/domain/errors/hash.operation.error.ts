import { ApplicationError } from "./application.error";

/**
 * Erro específico para problemas relacionados ao hash provider
 * @extends {ApplicationError}
 */
export class HashOperationError extends ApplicationError {
  /**
   * @param message Mensagem descritiva do erro
   * @param originalError Erro original que causou o problema (opcional)
   */
  constructor(message: string) {
    super(message, 500); // Código 500 - Internal Server Error
    this.name = "HashOperationError";
  }
}
