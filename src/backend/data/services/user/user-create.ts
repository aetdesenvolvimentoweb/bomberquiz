/**
 * Serviço para criação de usuários
 *
 * Esta classe implementa o caso de uso UserCreateUseCase e é responsável por
 * orquestrar o processo completo de criação de um novo usuário, incluindo:
 * - Sanitização dos dados de entrada
 * - Validação dos dados sanitizados
 * - Persistência do usuário no repositório
 * - Registro de logs durante todo o processo
 *
 * @implements {UserCreateUseCase}
 */
import { UserCreateData } from "@/backend/domain/entities";
import { LoggerProvider } from "@/backend/domain/providers";
import { UserRepository } from "@/backend/domain/repositories";
import { UserCreateDataSanitizerUseCase } from "@/backend/domain/sanitizers";
import { UserCreateUseCase } from "@/backend/domain/usecases";
import { UserCreateDataValidatorUseCase } from "@/backend/domain/validators";

/**
 * Propriedades necessárias para a criação do serviço
 *
 * @interface UserCreateServiceProps
 */
interface UserCreateServiceProps {
  /** Repositório para persistência de usuários */
  userRepository: UserRepository;
  /** Sanitizador para limpeza e normalização dos dados de entrada */
  userCreateDataSanitizer: UserCreateDataSanitizerUseCase;
  /** Validador para garantir a integridade dos dados do usuário */
  userCreateValidator: UserCreateDataValidatorUseCase;
  /** Provedor de logs para registro de eventos e erros */
  loggerProvider: LoggerProvider;
}

/**
 * Implementação do serviço de criação de usuários
 */
export class UserCreateService implements UserCreateUseCase {
  constructor(private readonly props: UserCreateServiceProps) {}

  /**
   * Cria um novo usuário no sistema
   *
   * @param {UserCreateData} data - Dados brutos do usuário a ser criado
   * @returns {Promise<void>} - Promise que resolve quando o usuário é criado com sucesso
   * @throws {MissingParamError} - Se algum parâmetro obrigatório estiver ausente
   * @throws {InvalidParamError} - Se algum parâmetro tiver formato ou valor inválido
   * @throws {DuplicateResourceError} - Se o email já estiver em uso
   */
  public readonly create = async (data: UserCreateData): Promise<void> => {
    const {
      userCreateDataSanitizer,
      userCreateValidator,
      loggerProvider,
      userRepository,
    } = this.props;

    const logContext = {
      service: "UserCreateService",
      method: "create",
      metadata: {
        userEmail: data?.email,
      },
    };

    try {
      loggerProvider.debug(
        "Iniciando processo de criação de usuário",
        logContext,
      );

      // Sanitiza os dados de entrada
      const sanitizedData = userCreateDataSanitizer.sanitize(data);
      loggerProvider.trace("Dados sanitizados com sucesso", {
        ...logContext,
        metadata: {
          ...logContext.metadata,
          sanitizedData: { ...sanitizedData, password: "[REDACTED]" },
        },
      });

      // Valida os dados sanitizados
      await userCreateValidator.validate(sanitizedData);
      loggerProvider.debug("Dados validados com sucesso", logContext);

      // Persiste o usuário no repositório
      await userRepository.create(sanitizedData);

      loggerProvider.info("Usuário criado com sucesso", {
        ...logContext,
        metadata: {
          ...logContext.metadata,
          userEmail: sanitizedData.email,
        },
      });
    } catch (error: unknown) {
      loggerProvider.error("Erro ao criar usuário", {
        ...logContext,
        metadata: {
          ...logContext.metadata,
          error: {
            name: (error as Error).name,
            message: (error as Error).message,
            stack: (error as Error).stack,
          },
        },
      });

      throw error;
    }
  };
}
