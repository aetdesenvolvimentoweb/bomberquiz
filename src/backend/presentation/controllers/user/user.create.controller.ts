import { UserCreateService } from "@/backend/data/services";
import { UserCreateData } from "@/backend/domain/entities";
import { ApplicationError } from "@/backend/domain/errors";

import { Controller, HttpRequest, HttpResponse } from "../../protocols";

interface UserCreateControllerProps {
  userCreateService: UserCreateService;
}

export class UserCreateController implements Controller<UserCreateData> {
  constructor(private readonly props: UserCreateControllerProps) {}

  public readonly handle = async (
    request: HttpRequest<UserCreateData>,
  ): Promise<HttpResponse> => {
    try {
      const { userCreateService } = this.props;

      await userCreateService.create(request.body as UserCreateData);

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
