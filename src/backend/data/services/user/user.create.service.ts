import { UserCreateData } from "@/backend/domain/entities";
import { LoggerProvider } from "@/backend/domain/providers";
import { UserRepository } from "@/backend/domain/repositories";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import { UserCreateUseCase } from "@/backend/domain/usecases";
import { UserCreateDataValidatorUseCase } from "@/backend/domain/validators";

interface UserCreateServiceProps {
  userRepository: UserRepository;
  loggerProvider: LoggerProvider;
  userCreateDataSanitizer: UserCreateDataSanitizerUseCase;
  userCreateDataValidator: UserCreateDataValidatorUseCase;
}

export class UserCreateService implements UserCreateUseCase {
  constructor(private readonly props: UserCreateServiceProps) {}

  public readonly create = async (data: UserCreateData): Promise<void> => {
    const {
      userRepository,
      loggerProvider,
      userCreateDataSanitizer,
      userCreateDataValidator,
    } = this.props;

    try {
      loggerProvider.info("Iniciando a criação de usuário", {
        action: "user.create.service.start",
        metadata: { email: data.email },
      });

      const sanitizedData = userCreateDataSanitizer.sanitize(data);

      loggerProvider.info("Dados sanitizados", {
        action: "user.create.data.sanitized",
      });

      await userCreateDataValidator.validate(sanitizedData);

      loggerProvider.info("Dados validados", {
        action: "user.create.data.validated",
      });

      await userRepository.create(sanitizedData);

      loggerProvider.info("Usuário criado com sucesso", {
        action: "user.created.service",
      });
    } catch (error: unknown) {
      loggerProvider.error("Erro ao criar usuário", {
        action: "user.creation.failed.service",
        metadata: { email: data.email },
        error,
      });

      throw error;
    }
  };
}
