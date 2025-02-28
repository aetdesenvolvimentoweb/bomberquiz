import { LoggerProvider } from "@/backend/domain/providers";
import { UserCreateController } from "../user.create.controller";
import { UserCreateDataValidator } from "@/backend/presentation/validators/user/user-create-request.validator";
import { UserCreateUseCase } from "@/backend/domain/usecases";

/**
 * Factory para criar o UserCreateController com suas dependências
 * @param userCreateService Serviço de criação de usuário
 * @param logger Provedor de logs
 * @returns Controller de criação de usuário
 */
export const makeUserCreateController = (
  userCreateService: UserCreateUseCase,
  logger: LoggerProvider,
): UserCreateController => {
  // Criar o validator
  const validator = new UserCreateDataValidator(logger);

  // Criar o controller com suas dependências
  return new UserCreateController({
    userCreateService,
    validator,
    logger,
  });
};
