import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UserCreateUseCase } from "@/backend/domain/use-cases";
import { UserProps } from "@/backend/domain/entities";

interface UserCreateControllerProps {
  userCreateService: UserCreateUseCase;
  httpResponsesHelper: HttpResponsesHelper;
}

/**
 * Implementa o controller de criação de usuário
 */
export class UserCreateController implements Controller {
  constructor(private readonly props: UserCreateControllerProps) {}

  /**
   * Processa uma requisição de criação de usuário
   * @param request Dados da requisição HTTP
   * @returns Promise com resposta HTTP
   */
  public readonly handle = async (
    request: HttpRequest<UserProps>
  ): Promise<HttpResponse> => {
    const { userCreateService, httpResponsesHelper } = this.props;

    try {
      await userCreateService.create(request.body);

      return httpResponsesHelper.created();
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
