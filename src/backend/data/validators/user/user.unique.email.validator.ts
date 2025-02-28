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
   * @param repository Repositório de usuários para consulta
   */
  constructor(private readonly repository: UserRepository) {}

  /**
   * Valida se um email é único no sistema
   * @param data Objeto contendo o email a ser validado e opcionalmente um ID de usuário
   * @param data.id ID do usuário (opcional, usado para permitir que o próprio usuário mantenha seu email em atualizações)
   * @param data.email Email a ser validado
   * @throws {DuplicateResourceError} Se o email já estiver cadastrado para outro usuário
   * @returns Promise que resolve se o email for único
   */
  public readonly validate = async (data: {
    id?: string;
    email: string;
  }): Promise<void> => {
    const user = await this.repository.findByEmail(data.email);

    if (user) {
      throw new DuplicateResourceError("Email já cadastrado no sistema");
    }
  };
}
