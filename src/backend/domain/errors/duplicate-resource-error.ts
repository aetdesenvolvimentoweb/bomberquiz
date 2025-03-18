import { ApplicationError } from "@/backend/domain/errors";

/**
 * Erro lançado quando um recurso já está cadastrado no sistema
 *
 * Esta classe representa um erro de conflito (HTTP 409) para recursos
 * que já existem no sistema, como tentativas de cadastrar um usuário
 * com e-mail já utilizado ou um produto com código duplicado.
 *
 * @remarks
 * Este erro deve ser utilizado em operações de criação ou atualização
 * de recursos quando a unicidade de um campo é violada. O código de status
 * 409 (Conflict) é adequado para indicar ao cliente que a operação não
 * pode ser concluída devido a um conflito com o estado atual do recurso.
 *
 * @example
 *
 * // Verificar se e-mail já existe antes de criar usuário
 * const existingUser = await userRepository.findByEmail(email);
 * if (existingUser) {
 *   throw new DuplicateResourceError("e-mail");
 * }
 * // Resultado: "E-mail já cadastrado no sistema"
 *
 *
 * @example
 *
 * // Verificar se código de produto já existe
 * const existingProduct = await productRepository.findByCode(code);
 * if (existingProduct) {
 *   throw new DuplicateResourceError("código do produto");
 * }
 * // Resultado: "Código do produto já cadastrado no sistema"
 *
 *
 * @extends {ApplicationError}
 */
export class DuplicateResourceError extends ApplicationError {
  /**
   * Cria uma nova instância de DuplicateResourceError
   *
   * @param {string} resource - Nome do recurso duplicado (ex: "usuário", "e-mail", "código do produto")
   */
  constructor(resource: string) {
    const capitalizedResource =
      resource.charAt(0).toUpperCase() + resource.slice(1);
    super(`${capitalizedResource} já cadastrado no sistema`, 409);
  }
}
