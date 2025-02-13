import { AuthRepository, UserRepository } from "@/backend/data/repository";
import { LoginProps, UserLogged } from "@/backend/domain/entities";

/**
 * Implementa o repositório de autenticação em memória
 */
export class AuthRepositoryInMemory implements AuthRepository {
  /**
   * Cria uma instância do repositório de autenticação
   * @param userRepository Repositório de usuários
   */
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Autoriza um usuário com base nas credenciais fornecidas
   * @param loginProps Credenciais do usuário
   * @returns Usuário autenticado ou null
   */
  public readonly authorize = async (
    loginProps: LoginProps
  ): Promise<UserLogged | null> => {
    const user = await this.userRepository.findByEmail(loginProps.email);

    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password,
      };
    }

    return null;
  };
}
