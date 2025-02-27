import { ApplicationError } from "./application.error";

/**
 * Erro lançado quando um parâmetro fornecido é inválido
 * @param param Nome do parâmetro inválido
 */
export class InvalidParamError extends ApplicationError {
  constructor(param: string) {
    super(`Parâmetro inválido: ${param}`, 400);
  }
}
