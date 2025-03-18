import { ApplicationError } from "@/backend/domain/errors";

/**
 * Erro lançado quando um parâmetro obrigatório não foi informado
 *
 * Esta classe representa erros de validação para parâmetros que são
 * obrigatórios, mas não foram fornecidos na requisição ou em um objeto.
 * Estende a classe base ApplicationError e define um código de status HTTP 400
 * (Bad Request), adequado para erros de validação de entrada.
 *
 * @remarks
 * Este erro deve ser utilizado em camadas de validação, como middlewares,
 * controladores ou casos de uso, para indicar claramente quais parâmetros
 * estão faltando em uma operação.
 *
 * @example
 *
 * // Validação em um controlador
 * if (!request.body.nome) {
 *   throw new MissingParamError("nome");
 * }
 *
 * // Validação em um caso de uso
 * function createUser(userData: any) {
 *   if (!userData.email) {
 *     throw new MissingParamError("email");
 *   }
 *   // Continua processamento...
 * }
 *
 *
 * @extends {ApplicationError}
 */
export class MissingParamError extends ApplicationError {
  /**
   * Cria uma nova instância de MissingParamError
   *
   * @param {string} param - Nome do parâmetro que está faltando
   */
  constructor(param: string) {
    super(`Parâmetro obrigatório não informado: ${param}`, 400);
  }
}
