import { ApplicationError } from "./application.error";

/**
 * Erro lançado quando um parâmetro já está cadastrado no sistema
 * @param param Nome do parâmetro duplicado
 */
export class DuplicateResourceError extends ApplicationError {
  constructor(param: string) {
    super(`${param} já está cadastrado no sistema`, 400);
  }
}
