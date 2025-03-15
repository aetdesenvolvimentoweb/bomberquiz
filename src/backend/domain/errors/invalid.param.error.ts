import { ApplicationError } from "@/backend/domain/errors";

/**
 * Erro lançado quando um parâmetro informado é inválido
 * @param param Nome do parâmetro que é inválido
 */
export class InvalidParamError extends ApplicationError {
  constructor(param: string, reason?: string) {
    const capitalizedParam = param.charAt(0).toUpperCase() + param.slice(1);
    const capitalizedReason = reason
      ? `(${reason.charAt(0).toUpperCase() + reason.slice(1)})`
      : "";
    const message = `Parâmetro inválido: ${capitalizedParam}. ${capitalizedReason}`;
    super(message, 400);
  }
}
