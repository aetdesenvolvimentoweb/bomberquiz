import { ApplicationError } from "./application.error";

/**
 * Erro lançado quando um parâmetro informado é inválido
 * @param param Nome do parâmetro que é inválido
 */
export class InvalidParamError extends ApplicationError {
  constructor(param: string) {
    super(`Parâmetro inválido: ${param}`, 400);
  }
}
