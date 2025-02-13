import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UserFindByIdService } from "@/backend/data/services";
import { UserMapped } from "@/backend/domain/entities";

interface UserFindByIdControllerProps {
  userFindByIdService: UserFindByIdService;
  httpResponsesHelper: HttpResponsesHelper;
}

/**
 * Implementa o controller de busca de usuário por ID
 */
export class UserFindByIdController implements Controller {
  constructor(private readonly props: UserFindByIdControllerProps) {}

  /**
   * Processa uma requisição de busca de usuário por ID
   * @param request Dados da requisição HTTP
   * @returns Promise com resposta HTTP
   */
  public readonly handle = async (
    request: HttpRequest
  ): Promise<HttpResponse<UserMapped | null>> => {
    const { userFindByIdService, httpResponsesHelper } = this.props;

    try {
      const id: string = request.dynamicParams.id;
      const user = await userFindByIdService.findById(id);

      return httpResponsesHelper.ok(user);
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
