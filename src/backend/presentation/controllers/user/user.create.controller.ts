import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/backend/presentation/protocols";
import { badRequest, created, errorHandler } from "../../helpers";
import { LoggerProvider } from "@/backend/domain/providers";
import { UserCreateData } from "@/backend/domain/entities";
import { UserCreateUseCase } from "@/backend/domain/usecases";

interface UserCreateControllerProps {
  userCreateService: UserCreateUseCase;
  logger: LoggerProvider;
}

/**
 * Controller para operações de criação de usuário
 * @implements {Controller}
 */
export class UserCreateController implements Controller<UserCreateData> {
  constructor(private readonly props: UserCreateControllerProps) {}

  async handle(request: HttpRequest<UserCreateData>): Promise<HttpResponse> {
    const { userCreateService, logger } = this.props;

    try {
      // Verificação mais robusta do body
      if (!request.body || Object.keys(request.body).length === 0) {
        logger.warn("Requisição sem corpo ou com corpo vazio", {
          action: "user_create_controller_missing_body",
        });
        return badRequest("Dados não fornecidos");
      }

      // Verificação básica de tipos (apenas para campos que existem)
      const { name, email, phone, password, birthdate } = request.body;

      // Só validamos os tipos se os campos existirem
      if (
        (name !== undefined && typeof name !== "string") ||
        (email !== undefined && typeof email !== "string") ||
        (phone !== undefined && typeof phone !== "string") ||
        (password !== undefined && typeof password !== "string") ||
        (birthdate !== undefined && !(birthdate instanceof Date))
      ) {
        logger.warn("Dados com tipos inválidos", {
          action: "user_create_controller_invalid_types",
          metadata: {
            hasName: !!name,
            hasEmail: !!email,
            hasPhone: !!phone,
            hasPassword: !!password,
            hasBirthdate: !!birthdate,
            birthdateIsDate: birthdate instanceof Date,
          },
        });
        return badRequest("Dados com formato inválido");
      }

      // Log com informações seguras (sem dados sensíveis)
      logger.info("Iniciando criação de usuário via controller", {
        action: "user_create_controller_start",
        metadata: {
          email: request.body.email,
          // Não incluir password ou outros dados sensíveis
        },
      });

      await userCreateService.create(request.body);

      logger.info("Usuário criado com sucesso via controller", {
        action: "user_create_controller_success",
        metadata: { email: request.body.email },
      });

      return created();
    } catch (error) {
      logger.error("Erro no controller de criação de usuário", {
        action: "user_create_controller_error",
        error,
        metadata: request.body
          ? {
              email: request.body.email,
              // Não incluir password ou outros dados sensíveis
            }
          : undefined,
      });

      return errorHandler(error);
    }
  }
}
