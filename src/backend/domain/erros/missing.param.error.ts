import { ApplicationError } from "./application.error";

/**
 * Erro lançado quando um parâmetro obrigatório não foi informado
 * @param param Nome do parâmetro que está faltando
 */
export class MissingParamError extends ApplicationError {
  constructor(param: string) {
    super(`Parâmetro obrigatório não informado: ${param}`, 400);
  }
}
