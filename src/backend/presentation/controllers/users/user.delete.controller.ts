import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UserDeleteUseCase } from "@/backend/domain/use-cases";

interface UserDeleteControllerProps {
  userDeleteService: UserDeleteUseCase;
  httpResponsesHelper: HttpResponsesHelper;
}

/**
 * Implementa o controller de remoção de usuário
 */
export class UserDeleteController implements Controller {
  constructor(private readonly props: UserDeleteControllerProps) {}

  /**
   * Processa uma requisição de remoção de usuário
   * @param request Dados da requisição HTTP
   * @returns Promise com resposta HTTP
   */
  public readonly handle = async (
    request: HttpRequest
  ): Promise<HttpResponse> => {
    const { userDeleteService, httpResponsesHelper } = this.props;

    try {
      const id: string = request.dynamicParams.id;

      await userDeleteService.delete(id);

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
