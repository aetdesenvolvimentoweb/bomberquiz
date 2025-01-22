import { AuthRepository, UserRepository } from "@/backend/data/repositories";
import { LoginProps, UserLogged } from "@/backend/domain/entities";

export class AuthRepositoryInMemory implements AuthRepository {
  constructor(private readonly userRepository: UserRepository) {}

  public readonly login = async (
    loginProps: LoginProps
  ): Promise<UserLogged | null> => {
    const user = await this.userRepository.listByEmail(loginProps.email);

    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password,
      } as UserLogged;
    }

    return null;
  };
}
