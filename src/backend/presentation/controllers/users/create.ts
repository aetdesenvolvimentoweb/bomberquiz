import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UserCreateService } from "@/backend/data/services";
import { UserProps } from "@/backend/domain/entities";

interface ConstructorProps {
  userCreateService: UserCreateService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class CreateUserController implements Controller {
  constructor(private readonly constructorProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest<UserProps>
  ): Promise<HttpResponse> => {
    const { userCreateService, httpResponsesHelper } = this.constructorProps;

    try {
      const userProps = request.body;

      await userCreateService.create(userProps);

      return httpResponsesHelper.created();
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
