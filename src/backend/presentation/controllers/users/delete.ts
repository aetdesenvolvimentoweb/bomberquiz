import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { DeleteUserService } from "@/backend/data/services";
import { HttpResponsesHelper } from "../../helpers/http-responses";

interface ConstructorProps {
  deleteUserService: DeleteUserService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class DeleteUserController implements Controller {
  constructor(private readonly constructorProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest
  ): Promise<HttpResponse> => {
    const { deleteUserService, httpResponsesHelper } = this.constructorProps;

    try {
      const id: string = request.dynamicParams.id;

      await deleteUserService.delete(id);

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
