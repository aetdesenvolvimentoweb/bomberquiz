import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UserFindAllService } from "@/backend/data/services";
import { UserMapped } from "@/backend/domain/entities";

interface ConstructorProps {
  userFindAllService: UserFindAllService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class ListAllUsersController implements Controller {
  constructor(private readonly constructorProps: ConstructorProps) {}

  public readonly handle = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: HttpRequest
  ): Promise<HttpResponse<UserMapped[]>> => {
    const { userFindAllService, httpResponsesHelper } = this.constructorProps;

    try {
      const users = await userFindAllService.findAll();

      return httpResponsesHelper.ok(users);
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
