import { UserCreateService } from "@/backend/data/services";
import { UserCreateData } from "@/backend/domain/entities";
import { ApplicationError, MissingParamError } from "@/backend/domain/errors";
import { LoggerProvider } from "@/backend/domain/providers";

import { Controller, HttpRequest, HttpResponse } from "../../protocols";

interface UserCreateControllerProps {
  userCreateService: UserCreateService;
  loggerProvider: LoggerProvider;
}

export class UserCreateController implements Controller<UserCreateData> {
  constructor(private readonly props: UserCreateControllerProps) {}

  public readonly handle = async (
    request: HttpRequest<UserCreateData>,
  ): Promise<HttpResponse> => {
    const { userCreateService, loggerProvider } = this.props;

    try {
      loggerProvider.info("Iniciando criação de usuário via controller", {
        action: "user.create.controller.start",
        metadata: {
          email: request.body?.email,
        },
      });

      if (!request.body) {
        throw new MissingParamError("corpo da requisição não informado");
      }

      loggerProvider.info("Requisição validada com sucesso", {
        action: "request.body.validated",
      });

      await userCreateService.create(request.body as UserCreateData);

      loggerProvider.info("Usuário criado com sucesso", {
        action: "user.created.controller",
      });

      return {
        body: {
          success: true,
          metadata: {
            timestamp: new Date().toISOString(),
          },
        },
        statusCode: 201,
      };
    } catch (error: unknown) {
      loggerProvider.error("Erro ao criar usuário", {
        action: "user.creation.failed.controller",
        metadata: {
          email: request.body?.email,
        },
        error,
      });

      if (error instanceof ApplicationError) {
        return {
          body: {
            success: false,
            errorMessage: error.message,
            metadata: {
              timestamp: new Date().toISOString(),
            },
          },
          statusCode: error.statusCode,
        };
      }
      return {
        body: {
          success: false,
          errorMessage: "Erro inesperado do servidor",
          metadata: {
            timestamp: new Date().toISOString(),
          },
        },
        statusCode: 500,
      };
    }
  };
}
