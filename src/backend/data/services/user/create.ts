import { UserCreateData } from "@/backend/domain/entities";
import { LoggerProvider } from "@/backend/domain/providers";
import { UserRepository } from "@/backend/domain/repositories";
import { UserCreateUseCase } from "@/backend/domain/usecases";

interface UserCreateServiceProps {
  userRepository: UserRepository;
  loggerProvider: LoggerProvider;
}

export class UserCreateService implements UserCreateUseCase {
  constructor(private readonly props: UserCreateServiceProps) {}

  public readonly create = async (data: UserCreateData): Promise<void> => {
    const { userRepository, loggerProvider } = this.props;

    try {
      loggerProvider.info("Iniciando a criação de usuário", {
        action: "user.create.start",
        metadata: { email: data.email },
      });

      await userRepository.create(data);

      loggerProvider.info("user.created");
    } catch (error: unknown) {
      loggerProvider.error("Erro ao criar usuário", {
        action: "user.creation.failed",
        metadata: { email: data.email },
        error,
      });

      throw error;
    }
  };
}
