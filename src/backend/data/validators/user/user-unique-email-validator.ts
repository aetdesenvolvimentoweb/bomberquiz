import { DuplicateResourceError } from "@/backend/domain/errors";
import { UserRepository } from "@/backend/domain/repositories/user-repository";
import { UserUniqueEmailValidatorUseCase } from "@/backend/domain/validators/user/user-unique-email-validator";

/**
 * Implementação concreta do validador de unicidade de email
 *
 * Esta classe implementa a verificação se um email já está em uso
 * no sistema, consultando o repositório de usuários.
 */
export class UserUniqueEmailValidator
  implements UserUniqueEmailValidatorUseCase
{
  /**
   * Cria uma nova instância do validador de unicidade de email
   *
   * @param userRepository - Repositório para consulta de usuários
   */
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Valida se um endereço de email é único no sistema
   *
   * @param email - Endereço de email a ser verificado
   * @throws {DuplicateResourceError} Quando o email já está em uso por outro usuário
   */
  async validate(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new DuplicateResourceError("e-mail");
    }
  }
}
