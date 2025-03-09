import { ApplicationError } from "@/backend/domain/errors";

/**
 * Erro lançado quando um erro inesperado acontece
 * @param error erro original
 */
export class ServerError extends ApplicationError {
  constructor(error: Error) {
    super(`Erro inesperado do servidor. ${error.message}`, 500);
  }
}
