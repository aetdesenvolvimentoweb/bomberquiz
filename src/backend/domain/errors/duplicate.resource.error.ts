import { ApplicationError } from "./application.error";

/**
 * Erro lançado quando se tenta criar um recurso que já existe no sistema
 * @param resource Nome do recurso que está duplicado
 */
export class DuplicateResourceError extends ApplicationError {
  constructor(resource: string) {
    super(`${resource} já cadastrado no sistema`, 409);
  }
}
