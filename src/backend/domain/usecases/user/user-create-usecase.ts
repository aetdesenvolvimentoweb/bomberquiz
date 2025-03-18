import { UserCreateData } from "@/backend/domain/entities";

/**
 * Interface para o caso de uso de criação de usuário
 *
 * Esta interface deve ser implementada por repositórios ou serviços
 * que têm a capacidade de persistir novos usuários.
 *
 * @interface
 *
 * @example
 * ```typescript
 * // Exemplo de implementação em um repositório
 * class UserRepositoryImpl implements UserCreateUseCase {
 *   async create(data: UserCreateData): Promise<void> {
 *     // Implementação da persistência do usuário
 *     await db.users.insert({
 *       ...data,
 *       id: generateUUID(),
 *       createdAt: new Date(),
 *       updatedAt: new Date(),
 *       role: USER_DEFAULT_ROLE,
 *       avatarUrl: USER_DEFAULT_AVATAR_URL
 *     });
 *   }
 * }
 * ```
 */
export interface UserCreateUseCase {
  /**
   * Cria um novo usuário no sistema
   *
   * Persiste os dados do usuário, gerando os campos adicionais necessários
   * como id, timestamps, e aplicando valores padrão para campos opcionais.
   *
   * @param {UserCreateData} data - Dados necessários para criar um usuário
   * @returns {Promise<void>} Promise que resolve quando a operação é concluída com sucesso
   *
   * @throws {MissingParamError} Se algum parâmetro obrigatório não for fornecido
   * @throws {InvalidParamError} Se algum parâmetro fornecido for inválido
   * @throws {DuplicateResourceError} Se o e-mail já estiver em uso
   * @throws {ServerError} Se ocorrer um erro durante a persistência
   */
  create: (data: UserCreateData) => Promise<void>;
}
