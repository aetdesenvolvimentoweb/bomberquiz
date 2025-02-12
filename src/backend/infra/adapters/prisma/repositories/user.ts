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
import { UserRepository } from "@/backend/data/repositories";
import { db } from "../prisma-client";

export class PrismaUserRepositoryAdapter implements UserRepository {
  private dbConnect = async (): Promise<void> => {
    await db.$connect().catch(async () => {
      throw prismaConnectionError();
    });
  };

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

  public readonly create = async (userProps: UserProps): Promise<void> => {
    await this.dbConnect();
    await db.user
      .create({
        data: userProps,
      })
      .catch(async () => {
        throw prismaOperationError("criar");
      })
      .finally(async () => {
        await db.$disconnect();
      });
  };

  public readonly delete = async (id: string): Promise<void> => {
    await this.dbConnect();
    await db.user
      .delete({
        where: {
          id,
        },
      })
      .catch(async () => {
        throw prismaOperationError("excluir");
      })
      .finally(async () => {
        await db.$disconnect();
      });
  };

  public readonly findAll = async (): Promise<UserMapped[]> => {
    await this.dbConnect();
    const users: User[] = await db.user
      .findMany({})
      .catch(async () => {
        throw prismaOperationError("consultar");
      })
      .finally(async () => {
        await db.$disconnect();
      });

    return users.map((user) => this.userMapper(user));
  };

  public readonly findByEmail = async (email: string): Promise<User | null> => {
    await this.dbConnect();
    return await db.user
      .findUnique({
        where: {
          email,
        },
      })
      .catch(async () => {
        throw prismaOperationError("consultar");
      })
      .finally(async () => {
        await db.$disconnect();
      });
  };

  public readonly findById = async (id: string): Promise<UserMapped | null> => {
    await this.dbConnect();
    const user: User | null = await db.user
      .findFirst({
        where: {
          id,
        },
      })
      .catch(async () => {
        throw prismaOperationError("consultar");
      })
      .finally(async () => {
        await db.$disconnect();
      });

    if (!user) {
      return null;
    }

    return this.userMapper(user);
  };

  public readonly updatePassword = async (updatePasswordProps: {
    id: string;
    props: UpdateUserPasswordProps;
  }) => {
    const { id, props } = updatePasswordProps;

    await this.dbConnect();
    await db.user
      .update({
        where: {
          id,
        },
        data: {
          password: props.newPassword,
        },
      })
      .catch(async () => {
        throw prismaOperationError("atualizar");
      })
      .finally(async () => {
        await db.$disconnect();
      });
  };

  public readonly updateProfile = async (updateProfileProps: {
    id: string;
    props: UserProfileProps;
  }): Promise<void> => {
    const { id, props } = updateProfileProps;

    await this.dbConnect();
    await db.user
      .update({
        where: {
          id,
        },
        data: {
          ...props,
        },
      })
      .catch(async () => {
        throw prismaOperationError("atualizar");
      })
      .finally(async () => {
        await db.$disconnect();
      });
  };

  public readonly updateRole = async (updateRoleProps: {
    id: string;
    role: UserRole;
  }) => {
    const { id, role } = updateRoleProps;

    await this.dbConnect();
    await db.user
      .update({
        where: {
          id,
        },
        data: {
          role,
        },
      })
      .catch(async () => {
        throw prismaOperationError("atualizar");
      })
      .finally(async () => {
        await db.$disconnect();
      });
  };
}
