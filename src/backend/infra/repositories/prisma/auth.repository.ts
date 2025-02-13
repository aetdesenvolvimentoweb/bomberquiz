import { AuthRepository, UserRepository } from "@/backend/data/repository";
import { LoginProps, UserLogged } from "@/backend/domain/entities";
import { db } from "@/backend/infra/adapters";
import { prismaConnectionError } from "@/backend/infra/helpers";

/**
 * Implementa o repositório de autenticação usando Prisma
 */
export class PrismaAuthRepository implements AuthRepository {
  /**
   * Cria uma instância do repositório de autenticação
   * @param userRepository Repositório de usuários
   */
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Conecta ao banco de dados
   * @throws Error se a conexão falhar
   */
  private dbConnect = async (): Promise<void> => {
    await db.$connect().catch(async () => {
      throw prismaConnectionError();
    });
  };

  /**
   * Autoriza um usuário com base nas credenciais fornecidas
   * @param loginProps Credenciais do usuário
   * @returns Usuário autenticado ou null
   * @throws Error se a operação falhar
   */
  public readonly authorize = async (
    loginProps: LoginProps
  ): Promise<UserLogged | null> => {
    await this.dbConnect();
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
