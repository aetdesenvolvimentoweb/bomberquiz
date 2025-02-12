import { AuthRepository, UserRepository } from "@/backend/data/repository";
import { LoginProps, UserLogged } from "@/backend/domain/entities";
import { db } from "../prisma-client";
import { prismaConnectionError } from "@/backend/infra/helpers";

export class PrismaAuthRepositoryAdapter implements AuthRepository {
  constructor(private readonly userRepository: UserRepository) {}

  private dbConnect = async (): Promise<void> => {
    await db.$connect().catch(async () => {
      throw prismaConnectionError();
    });
  };

  public readonly authorize = async (
    loginProps: LoginProps
  ): Promise<UserLogged | null> => {
    await this.dbConnect();
    const user = await this.userRepository.findByEmail(loginProps.email);

    if (user) {
      return {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        password: user?.password,
      } as UserLogged;
    }

    return null;
  };
}
