import {
  UpdateUserPasswordProps,
  User,
  UserMapped,
  UserProfileProps,
  UserProps,
  UserRole,
} from "@/backend/domain/entities";
import {
  prismaConnectionError,
  prismaOperationError,
} from "@/backend/infra/helpers";
import { PrismaClient } from "@prisma/client";
import { UserRepository } from "@/backend/data/repository";

/**
 * Implementa o repositório de usuários usando Prisma
 */
export class PrismaUserRepository implements UserRepository {
  /**
   * Conecta ao banco de dados
   * @throws Error se a conexão falhar
   */

  constructor(private db: PrismaClient) {}
  private dbConnect = async (): Promise<void> => {
    await this.db.$connect().catch(async () => {
      throw prismaConnectionError();
    });
  };

  /**
   * Mapeia um usuário para o formato sem senha
   * @param user Usuário a ser mapeado
   * @returns Usuário mapeado sem senha
   */
  private userMapper = (user: User): UserMapped => {
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
   * @throws Error se a operação falhar
   */
  public readonly create = async (userProps: UserProps): Promise<void> => {
    await this.dbConnect();
    await this.db.user
      .create({
        data: userProps,
      })
      .catch(async () => {
        throw prismaOperationError("criar");
      })
      .finally(async () => {
        await this.db.$disconnect();
      });
  };

  /**
   * Remove um usuário pelo ID
   * @param id ID do usuário
   * @throws Error se a operação falhar
   */
  public readonly delete = async (id: string): Promise<void> => {
    await this.dbConnect();
    await this.db.user
      .delete({
        where: { id },
      })
      .catch(async () => {
        throw prismaOperationError("excluir");
      })
      .finally(async () => {
        await this.db.$disconnect();
      });
  };

  /**
   * Lista todos os usuários
   * @returns Lista de usuários mapeados
   * @throws Error se a operação falhar
   */
  public readonly findAll = async (): Promise<UserMapped[]> => {
    await this.dbConnect();
    const users: User[] = await this.db.user
      .findMany({})
      .catch(async () => {
        throw prismaOperationError("consultar");
      })
      .finally(async () => {
        await this.db.$disconnect();
      });

    return users.map((user) => this.userMapper(user));
  };

  /**
   * Busca um usuário pelo email
   * @param email Email do usuário
   * @returns Usuário encontrado ou null
   * @throws Error se a operação falhar
   */
  public readonly findByEmail = async (email: string): Promise<User | null> => {
    await this.dbConnect();
    return await this.db.user
      .findUnique({
        where: { email },
      })
      .catch(async () => {
        throw prismaOperationError("consultar");
      })
      .finally(async () => {
        await this.db.$disconnect();
      });
  };

  /**
   * Busca um usuário pelo ID
   * @param id ID do usuário
   * @returns Usuário mapeado encontrado ou null
   * @throws Error se a operação falhar
   */
  public readonly findById = async (id: string): Promise<UserMapped | null> => {
    await this.dbConnect();
    const user: User | null = await this.db.user
      .findFirst({
        where: { id },
      })
      .catch(async () => {
        throw prismaOperationError("consultar");
      })
      .finally(async () => {
        await this.db.$disconnect();
      });

    if (!user) {
      return null;
    }

    return this.userMapper(user);
  };

  /**
   * Atualiza a senha de um usuário
   * @param updatePasswordProps Dados para atualização de senha
   * @throws Error se a operação falhar
   */
  public readonly updatePassword = async (updatePasswordProps: {
    id: string;
    props: UpdateUserPasswordProps;
  }): Promise<void> => {
    const { id, props } = updatePasswordProps;

    await this.dbConnect();
    await this.db.user
      .update({
        where: { id },
        data: {
          password: props.newPassword,
        },
      })
      .catch(async () => {
        throw prismaOperationError("atualizar");
      })
      .finally(async () => {
        await this.db.$disconnect();
      });
  };

  /**
   * Atualiza o perfil de um usuário
   * @param updateProfileProps Dados para atualização de perfil
   * @throws Error se a operação falhar
   */
  public readonly updateProfile = async (updateProfileProps: {
    id: string;
    props: UserProfileProps;
  }): Promise<void> => {
    const { id, props } = updateProfileProps;

    await this.dbConnect();
    await this.db.user
      .update({
        where: { id },
        data: { ...props },
      })
      .catch(async () => {
        throw prismaOperationError("atualizar");
      })
      .finally(async () => {
        await this.db.$disconnect();
      });
  };

  /**
   * Atualiza o papel de um usuário
   * @param updateRoleProps Dados para atualização de papel
   * @throws Error se a operação falhar
   */
  public readonly updateRole = async (updateRoleProps: {
    id: string;
    role: UserRole;
  }): Promise<void> => {
    const { id, role } = updateRoleProps;

    await this.dbConnect();
    await this.db.user
      .update({
        where: { id },
        data: { role },
      })
      .catch(async () => {
        throw prismaOperationError("atualizar");
      })
      .finally(async () => {
        await this.db.$disconnect();
      });
  };
}
