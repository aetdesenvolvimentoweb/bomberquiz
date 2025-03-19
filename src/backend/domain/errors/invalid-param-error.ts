import { ApplicationError } from "@/backend/domain/errors";

/**
 * Erro lançado quando um parâmetro informado é inválido
 *
 * Esta classe representa erros de validação para parâmetros que foram
 * fornecidos, mas contêm valores inválidos ou em formato incorreto.
 * Estende a classe base ApplicationError e define um código de status HTTP 400
 * (Bad Request), adequado para erros de validação de entrada.
 *
 * @remarks
 * Este erro deve ser utilizado em camadas de validação, como middlewares,
 * controladores ou casos de uso, para indicar claramente quais parâmetros
 * estão com valores inválidos e, opcionalmente, o motivo da invalidação.
 *
 * @example
 *
 * // Erro básico de parâmetro inválido
 * throw new InvalidParamError("email");
 * // Resultado: "Parâmetro inválido: Email."
 *
 *
 * @example
 *
 * // Erro com razão específica
 * throw new InvalidParamError("email", "formato inválido");
 * // Resultado: "Parâmetro inválido: Email. (Formato inválido)"
 *
 * // Validação em um caso de uso
 * function validateUser(userData: any) {
 *   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 *   if (!emailRegex.test(userData.email)) {
 *     throw new InvalidParamError("email", "formato inválido");
 *   }
 * }
 *
 *
 * @extends {ApplicationError}
 */
export class InvalidParamError extends ApplicationError {
  /**
   * Cria uma nova instância de InvalidParamError
   *
   * @param {string} param - Nome do parâmetro que é inválido
   * @param {string} [reason] - Razão opcional para o parâmetro ser inválido
   */
  constructor(param: string, reason: string = "") {
    const capitalizedParam = param.charAt(0).toUpperCase() + param.slice(1);
    const capitalizedReason = reason.charAt(0).toUpperCase() + reason.slice(1);
    let message: string;
    if (capitalizedReason) {
      message = `Parâmetro inválido: ${capitalizedParam}. ${capitalizedReason}.`;
    } else {
      message = `Parâmetro inválido: ${capitalizedParam}.`;
    }
    super(message, 400);
  }
}
