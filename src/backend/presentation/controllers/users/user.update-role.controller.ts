import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UserRole } from "@/backend/domain/entities";
import { UserUpdateRoleService } from "@/backend/data/services";

interface UserUpdateRoleControllerProps {
  userUpdateRoleService: UserUpdateRoleService;
  httpResponsesHelper: HttpResponsesHelper;
}

/**
 * Implementa o controller de atualização de papel do usuário
 */
export class UserUpdateRoleController implements Controller {
  constructor(private readonly props: UserUpdateRoleControllerProps) {}

  /**
   * Processa uma requisição de atualização de papel do usuário
   * @param request Dados da requisição HTTP contendo ID e novo papel
   * @returns Promise com resposta HTTP
   */
  public readonly handle = async (
    request: HttpRequest<{ role: UserRole }>
  ): Promise<HttpResponse<void>> => {
    const { userUpdateRoleService, httpResponsesHelper } = this.props;

    try {
      const id: string = request.dynamicParams.id;
      const role = request.body.role;

      await userUpdateRoleService.updateRole({ id, role });

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
