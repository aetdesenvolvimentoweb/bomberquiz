import { ApplicationError } from "@/backend/domain/errors";

/**
 * Erro lançado quando um erro inesperado acontece
 * @param error erro original
 */
export class ServerError extends ApplicationError {
  constructor(error: Error) {
    const capitalizedError =
      error.message.charAt(0).toUpperCase() + error.message.slice(1);

    super(`Erro inesperado do servidor. ${capitalizedError}`, 500);
  }
}
