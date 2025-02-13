/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UserFindAllUseCase } from "@/backend/domain/use-cases";
import { UserMapped } from "@/backend/domain/entities";

interface UserFindAllControllerProps {
  userFindAllService: UserFindAllUseCase;
  httpResponsesHelper: HttpResponsesHelper;
}

/**
 * Implementa o controller de listagem de usuários
 */
export class UserFindAllController implements Controller {
  constructor(private readonly props: UserFindAllControllerProps) {}

  /**
   * Processa uma requisição de listagem de usuários
   * @param request Dados da requisição HTTP
   * @returns Promise com resposta HTTP
   */
  public readonly handle = async (
    request: HttpRequest
  ): Promise<HttpResponse<UserMapped[]>> => {
    const { userFindAllService, httpResponsesHelper } = this.props;

    try {
      const users = await userFindAllService.findAll();

      return httpResponsesHelper.ok(users);
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
