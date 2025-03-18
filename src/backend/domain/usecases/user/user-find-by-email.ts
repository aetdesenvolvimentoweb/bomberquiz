import { User } from "@/backend/domain/entities";

/**
 * Interface para o caso de uso de busca de usuário por e-mail
 *
 * Esta interface deve ser implementada por repositórios ou serviços
 * que têm acesso aos dados de usuários.
 *
 * @interface
 *
 * @example
 * ```typescript
 * // Exemplo de implementação em um repositório
 * class UserRepositoryImpl implements UserFindByEmailUseCase {
 *   async findByEmail(email: string): Promise<User | null> {
 *     // Implementação da busca por e-mail
 *     const normalizedEmail = email.toLowerCase().trim();
 *     const result = await db.users.findOne({ email: normalizedEmail });
 *     return result || null;
 *   }
 * }
 * ```
 *
 */
export interface UserFindByEmailUseCase {
  /**
   * Busca um usuário pelo endereço de e-mail
   *
   * Localiza um usuário no sistema utilizando seu endereço de e-mail como
   * critério de busca. A comparação deve ser case-insensitive.
   *
   * @param {string} email - Endereço de e-mail do usuário a ser localizado
   * @returns {Promise<User | null>} Promise que resolve com o usuário encontrado ou null se não existir
   *
   * @throws {MissingParamError} se o e-mail não for fornecido
   * @throws {InvalidParamError} Se o e-mail fornecido for inválido
   * @throws {ServerError} Se ocorrer um erro durante a consulta
   */
  findByEmail: (email: string) => Promise<User | null>;
}
