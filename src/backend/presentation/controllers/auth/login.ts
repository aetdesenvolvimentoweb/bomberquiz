import { HttpRequest, HttpResponse } from "../../protocols";
import { AuthLoginService } from "@/backend/data/services/auth/auth.login.service";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { LoginProps } from "@/backend/domain/entities";

interface ConstructorProps {
  httpResponsesHelper: HttpResponsesHelper;
  authLoginService: AuthLoginService;
}

export class LoginController implements Controller {
  constructor(private readonly constructorProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest<LoginProps>
  ): Promise<HttpResponse> => {
    const { httpResponsesHelper, authLoginService } = this.constructorProps;

    try {
      const loginProps: LoginProps = request.body;

      const token: string = await authLoginService.login(loginProps);

      const httpResponse: HttpResponse = httpResponsesHelper.noContent();
      httpResponse.headers = {
        tokenJwt: `Bearer_${token}`,
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
