import {
  Controller,
  HttpRequest,
  HttpResponse,
  RequestValidator,
} from "../../protocols";
import { created, errorHandler } from "../../helpers";
import { LoggerProvider } from "@/backend/domain/providers";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateUseCase } from "@/backend/domain/usecases";

interface UserCreateControllerProps {
  userCreateService: UserCreateUseCase;
  userCreateRequestValidator: RequestValidator<UserCreateData>;
  logger: LoggerProvider;
}

/**
 * Controller para operações de criação de usuário
 * @implements {Controller}
 */
export class UserCreateController implements Controller<UserCreateData> {
  constructor(private readonly props: UserCreateControllerProps) {}

  /**
   * Trata a requisição HTTP para criação de usuário
   * @param request Requisição HTTP
   * @returns Resposta HTTP
   */
  async handle(request: HttpRequest<UserCreateData>): Promise<HttpResponse> {
    const { userCreateService, userCreateRequestValidator, logger } =
      this.props;

    try {
      // Log com informações seguras (sem dados sensíveis)
      userCreateRequestValidator.validate(request.body!);
      logger.info("Iniciando criação de usuário via controller", {
        action: "user_create_controller_start",
        metadata: {
          email: request.body?.email,
        },
      });

      // Processamento da requisição
      await userCreateService.create(request.body!);

      logger.info("Usuário criado com sucesso via controller", {
        action: "user_create_controller_success",
        metadata: { email: request.body?.email },
      });

      return created();
    } catch (error) {
      // Log de erro com informações seguras
      logger.error("Erro no controller de criação de usuário", {
        error,
        action: "user_create_controller_error",
        metadata: request.body ? { email: request.body.email } : undefined,
      });

      // Usa o errorHandler para todos os erros
      return errorHandler(error);
    }
  }
}
