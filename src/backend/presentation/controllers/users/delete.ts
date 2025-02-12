import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UserDeleteService } from "@/backend/data/services";

interface ConstructorProps {
  userDeleteService: UserDeleteService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class DeleteUserController implements Controller {
  constructor(private readonly constructorProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest
  ): Promise<HttpResponse> => {
    const { userDeleteService, httpResponsesHelper } = this.constructorProps;

    try {
      const id: string = request.dynamicParams.id;

      await userDeleteService.delete(id);

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
