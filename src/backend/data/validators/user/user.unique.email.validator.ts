import { DuplicateResourceError } from "@/backend/domain/errors";
import { UserRepository } from "@/backend/domain/repositories";
import { UserUniqueEmailValidatorUseCase } from "@/backend/domain/validators";

/**
 * Implementação do validador de email único
 * Verifica se um email já está cadastrado no sistema
 * @implements {UserUniqueEmailValidatorUseCase}
 */
export class UserUniqueEmailValidator
  implements UserUniqueEmailValidatorUseCase
{
  /**
   * Cria uma instância do validador de email único
   * @param userRepository Repositório de usuários para consulta
   */
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Valida se um email é único no sistema
   * @param data Objeto contendo o email a ser validado e opcionalmente um ID de usuário
   * @param data.id ID do usuário (opcional, usado para permitir que o próprio usuário mantenha seu email em atualizações)
   * @param data.email Email a ser validado
   * @throws {DuplicateResourceError} Se o email já estiver cadastrado para outro usuário
   *         A mensagem de erro será "Email já cadastrado no sistema"
   * @returns Promise que resolve se o email for único
   */
  public readonly validate = async (data: {
    id?: string;
    email: string;
  }): Promise<void> => {
    const email = data.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new DuplicateResourceError("Email");
    }
  };
}
