import { HttpRequest, HttpResponse } from "../../protocols";
import { LoginProps, UserLogged } from "@/backend/domain/entities";
import { AppError } from "@/backend/data/errors";
import { AuthorizeService } from "@/backend/data/services";
import { Controller } from "../../protocols/controller";
import { HttpResponses } from "../../helpers/http-responses";

interface LoginControllerProps {
  authorizeService: AuthorizeService;
  httpResponses: HttpResponses;
}

export class LoginController implements Controller {
  constructor(private readonly props: LoginControllerProps) {}

  public readonly handle = async (
    request: HttpRequest<LoginProps>
  ): Promise<HttpResponse> => {
    const { authorizeService, httpResponses } = this.props;

    try {
      const loginProps: LoginProps = request.body;

      const userLogged: UserLogged =
        await authorizeService.authorize(loginProps);

      return httpResponses.ok(userLogged);
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponses.badRequest(error);
      }

      return httpResponses.serverError();
    }
  };
}
