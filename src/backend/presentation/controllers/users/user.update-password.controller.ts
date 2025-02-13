import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UpdateUserPasswordProps } from "@/backend/domain/entities";
import { UserUpdatePasswordService } from "@/backend/data/services";

interface UserUpdatePasswordControllerProps {
  userUpdatePasswordService: UserUpdatePasswordService;
  httpResponsesHelper: HttpResponsesHelper;
}

/**
 * Implementa o controller de atualização de senha do usuário
 */
export class UserUpdatePasswordController implements Controller {
  constructor(private readonly props: UserUpdatePasswordControllerProps) {}

  /**
   * Processa uma requisição de atualização de senha do usuário
   * @param request Dados da requisição HTTP contendo ID e nova senha
   * @returns Promise com resposta HTTP
   */
  public readonly handle = async (
    request: HttpRequest<UpdateUserPasswordProps>
  ): Promise<HttpResponse<void>> => {
    const { userUpdatePasswordService, httpResponsesHelper } = this.props;

    try {
      const id: string = request.dynamicParams.id;
      const props = request.body;

      await userUpdatePasswordService.updatePassword({
        id,
        props,
      });

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
