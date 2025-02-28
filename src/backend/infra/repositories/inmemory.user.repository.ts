import {
  USER_DEFAULT_AVATAR_URL,
  USER_DEFAULT_ROLE,
  User,
  UserCreateData,
} from "@/backend/domain/entities";
import { ObjectId } from "mongodb";
import { UserRepository } from "@/backend/domain/repositories/user.repository";

/**
 * Implementação em memória do repositório de usuários
 * Útil para testes e desenvolvimento sem necessidade de banco de dados
 * @implements {UserRepository}
 */
export class InMemoryUserRepository implements UserRepository {
  /** Array que armazena os usuários em memória */
  private users: User[] = [];

  /**
   * Cria um novo usuário no repositório em memória
   * @param data Dados do usuário a ser criado
   * @returns Promise que resolve quando o usuário é criado com sucesso
   */
  public readonly create = async (data: UserCreateData): Promise<void> => {
    const id = new ObjectId().toString();
    const createdAt = new Date();
    const updatedAt = new Date();
    this.users.push({
      ...data,
      id,
      avatarUrl: USER_DEFAULT_AVATAR_URL,
      role: USER_DEFAULT_ROLE,
      createdAt,
      updatedAt,
    });
  };

  /**
   * Busca um usuário pelo email
   * @param email Email do usuário a ser consultado
   * @returns Promise que resolve com o usuário encontrado ou null se não existir
   */
  public readonly findByEmail = async (email: string): Promise<User | null> => {
    const user = this.users.find((user) => user.email === email);

    return user || null;
  };
}
