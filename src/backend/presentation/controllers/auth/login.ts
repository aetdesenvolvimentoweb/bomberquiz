import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { HttpResponsesHelper } from "../../helpers/http-responses";
import { LoginProps } from "@/backend/domain/entities";
import { LoginService } from "@/backend/data/services/auth/login";

interface ConstructorProps {
  httpResponsesHelper: HttpResponsesHelper;
  loginService: LoginService;
}

export class LoginController implements Controller {
  constructor(private readonly constructorProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest<LoginProps>
  ): Promise<HttpResponse> => {
    const { httpResponsesHelper, loginService } = this.constructorProps;

    try {
      const loginProps: LoginProps = request.body;

      const token: string = await loginService.login(loginProps);

      const httpResponse: HttpResponse = httpResponsesHelper.noContent();
      httpResponse.headers = {
        tokenJwt: `Bearer_${token}`,
      };

      return httpResponse;
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
