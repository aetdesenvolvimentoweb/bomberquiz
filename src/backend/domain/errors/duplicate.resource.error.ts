import { ApplicationError } from "@/backend/domain/errors";

/**
 * Erro lançado quando um parâmetro já está cadastrado no sistema
 * @param param Nome do parâmetro duplicado
 */
export class DuplicateResourceError extends ApplicationError {
  constructor(resource: string) {
    const capitalizedResource =
      resource.charAt(0).toUpperCase() + resource.slice(1);
    super(`${capitalizedResource} já cadastrado no sistema`, 409);
  }
}
