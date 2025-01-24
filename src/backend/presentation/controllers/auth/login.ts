import { HttpRequest, HttpResponse } from "../../protocols";
import { LoginProps, UserLogged } from "@/backend/domain/entities";
import { AppError } from "@/backend/data/errors";
import { AuthorizeService } from "@/backend/data/services";
import { Controller } from "../../protocols/controller";
import { HttpResponses } from "../../helpers/http-responses";
import { LoginService } from "@/backend/data/services/auth/login";

interface LoginControllerProps {
  authorizeService: AuthorizeService;
  httpResponses: HttpResponses;
  loginService: LoginService;
}

export class LoginController implements Controller {
  constructor(private readonly props: LoginControllerProps) {}

  public readonly handle = async (
    request: HttpRequest<LoginProps>
  ): Promise<HttpResponse> => {
    const { authorizeService, httpResponses, loginService } = this.props;

    try {
      const loginProps: LoginProps = request.body;

      const userLogged: UserLogged =
        await authorizeService.authorize(loginProps);

      const token: string = loginService.login(userLogged);

      const httpResponse: HttpResponse = httpResponses.noContent();
      httpResponse.headers = {
        tokenJwt: `Bearer_${token}`,
      };

      return httpResponse;
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponses.badRequest(error);
      }

      return httpResponses.serverError();
    }
  };
}
