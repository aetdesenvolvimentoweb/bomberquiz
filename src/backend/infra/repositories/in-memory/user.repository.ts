import {
  UpdateUserPasswordProps,
  User,
  UserMapped,
  UserProfileProps,
  UserProps,
  UserRole,
} from "@/backend/domain/entities";
import { UserRepository } from "@/backend/data/repository";
import { randomUUID } from "crypto";

/**
 * Implementa o repositório de usuários em memória
 */
export class UserRepositoryInMemory implements UserRepository {
  private users: User[];

  constructor() {
    this.users = [];
  }

  /**
   * Mapeia um usuário para o formato sem senha
   * @param user Usuário a ser mapeado
   * @returns Usuário mapeado sem senha
   */
  private userMapped = (user: User): UserMapped => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthdate: user.birthdate,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  /**
   * Cria um novo usuário
   * @param userProps Propriedades do usuário
   */
  public readonly create = async (userProps: UserProps): Promise<void> => {
    const user: User = {
      ...userProps,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);
  };

  /**
   * Remove um usuário pelo ID
   * @param id ID do usuário
   */
  public readonly delete = async (id: string): Promise<void> => {
    this.users = this.users.filter((user) => user.id !== id);
  };

  /**
   * Lista todos os usuários
   * @returns Lista de usuários mapeados
   */
  public readonly findAll = async (): Promise<UserMapped[]> => {
    return this.users.map((user) => this.userMapped(user));
  };

  /**
   * Busca um usuário pelo email
   * @param email Email do usuário
   * @returns Usuário encontrado ou null
   */
  public readonly findByEmail = async (email: string): Promise<User | null> => {
    return this.users.find((user) => user.email === email) || null;
  };

  /**
   * Busca um usuário pelo ID
   * @param id ID do usuário
   * @returns Usuário mapeado encontrado ou null
   */
  public readonly findById = async (id: string): Promise<UserMapped | null> => {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      return this.userMapped(user);
    }
    return null;
  };

  /**
   * Atualiza a senha de um usuário
   * @param updatePasswordProps Dados para atualização de senha
   */
  public readonly updatePassword = async (updatePasswordProps: {
    id: string;
    props: UpdateUserPasswordProps;
  }): Promise<void> => {
    const { id, props } = updatePasswordProps;
    this.users = this.users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          password: props.newPassword,
          updatedAt: new Date(),
        };
      }
      return user;
    });
  };

  /**
   * Atualiza o perfil de um usuário
   * @param updateProfileProps Dados para atualização de perfil
   */
  public readonly updateProfile = async (updateProfileProps: {
    id: string;
    props: UserProfileProps;
  }): Promise<void> => {
    const { id, props } = updateProfileProps;

    this.users = this.users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          name: props.name,
          email: props.email,
          phone: props.phone,
          birthdate: props.birthdate,
          updatedAt: new Date(),
        };
      }
      return user;
    });
  };

  /**
   * Atualiza o papel de um usuário
   * @param updateRoleProps Dados para atualização de papel
   */
  public readonly updateRole = async (updateRoleProps: {
    id: string;
    role: UserRole;
  }): Promise<void> => {
    const { id, role } = updateRoleProps;

    this.users = this.users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          role,
          updatedAt: new Date(),
        };
      }
      return user;
    });
  };
}
