import {
  UpdateUserPasswordProps,
  UpdateUserRoleProps,
  User,
  UserMapped,
  UserProfile,
  UserProps,
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

  public readonly listAll = async (): Promise<UserMapped[]> => {
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

  public readonly listByEmail = async (email: string): Promise<User | null> => {
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

  public readonly listById = async (id: string): Promise<UserMapped | null> => {
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

  public readonly updatePassword = async (
    updateUserPasswordProps: UpdateUserPasswordProps
  ) => {
    await this.dbConnect();
    await db.user
      .update({
        where: {
          id: updateUserPasswordProps.id,
        },
        data: {
          password: updateUserPasswordProps.newPassword,
        },
      })
      .catch(async () => {
        throw prismaOperationError("atualizar");
      })
      .finally(async () => {
        await db.$disconnect();
      });
  };

  public readonly updateProfile = async (
    userProfile: UserProfile
  ): Promise<void> => {
    await this.dbConnect();
    await db.user
      .update({
        where: {
          id: userProfile.id,
        },
        data: {
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          birthdate: userProfile.birthdate,
        },
      })
      .catch(async () => {
        throw prismaOperationError("atualizar");
      })
      .finally(async () => {
        await db.$disconnect();
      });
  };

  public readonly updateRole = async (
    updateUserRoleProps: UpdateUserRoleProps
  ) => {
    await this.dbConnect();
    await db.user
      .update({
        where: {
          id: updateUserRoleProps.id,
        },
        data: {
          role: updateUserRoleProps.role,
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
