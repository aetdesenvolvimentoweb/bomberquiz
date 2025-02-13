import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UserProfileProps } from "@/backend/domain/entities";
import { UserUpdateProfileService } from "@/backend/data/services";

interface UserUpdateProfileControllerProps {
  userUpdateProfileService: UserUpdateProfileService;
  httpResponsesHelper: HttpResponsesHelper;
}

/**
 * Implementa o controller de atualização de perfil do usuário
 */
export class UserUpdateProfileController implements Controller {
  constructor(private readonly props: UserUpdateProfileControllerProps) {}

  /**
   * Processa uma requisição de atualização de perfil do usuário
   * @param request Dados da requisição HTTP contendo ID e dados do perfil
   * @returns Promise com resposta HTTP
   */
  public readonly handle = async (
    request: HttpRequest<UserProfileProps>
  ): Promise<HttpResponse<void>> => {
    const { userUpdateProfileService, httpResponsesHelper } = this.props;

    try {
      const id: string = request.dynamicParams.id;
      const props = request.body;

      await userUpdateProfileService.updateProfile({ id, props });

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
