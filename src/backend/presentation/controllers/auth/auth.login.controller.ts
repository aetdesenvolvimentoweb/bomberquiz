import { HttpRequest, HttpResponse } from "../../protocols";
import { AuthLoginUseCase } from "@/backend/domain/use-cases";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { LoginProps } from "@/backend/domain/entities";

interface ConstructorProps {
  httpResponsesHelper: HttpResponsesHelper;
  authLoginService: AuthLoginUseCase;
}

/**
 * Implementa o controller de autenticação no sistema
 */
export class AuthLoginController implements Controller {
  constructor(private readonly props: ConstructorProps) {}

  /**
   * Processa uma requisição de login
   * @param request Dados da requisição HTTP
   * @returns Promise com resposta HTTP
   */
  public readonly handle = async (
    request: HttpRequest<LoginProps>
  ): Promise<HttpResponse> => {
    const { httpResponsesHelper, authLoginService } = this.props;

    try {
      const tokenJwt = await authLoginService.login(request.body);

      const httpResponse = httpResponsesHelper.noContent();
      httpResponse.headers = {
        tokenJwt,
      };

      return httpResponse;
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
