import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { DeleteUserService } from "@/backend/data/services";
import { HttpResponses } from "../../helpers/http-responses";

interface DeleteUserControllerProps {
  deleteUserService: DeleteUserService;
  httpResponses: HttpResponses;
}

export class DeleteUserController implements Controller {
  constructor(private readonly props: DeleteUserControllerProps) {}

  public readonly handle = async (
    request: HttpRequest
  ): Promise<HttpResponse> => {
    const { deleteUserService, httpResponses } = this.props;

    try {
      const id: string = request.dynamicParams.id;

      await deleteUserService.delete(id);

      return httpResponses.noContent();
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponses.badRequest(error);
      }

      return httpResponses.serverError();
    }
  };
}
