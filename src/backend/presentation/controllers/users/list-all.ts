import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { HttpResponsesHelper } from "../../helpers/http-responses";
import { ListAllUsersService } from "@/backend/data/services";
import { UserMapped } from "@/backend/domain/entities";

interface ListAllUsersControllerProps {
  listAllUsersService: ListAllUsersService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class ListAllUsersController implements Controller {
  constructor(private readonly props: ListAllUsersControllerProps) {}

  public readonly handle = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    request: HttpRequest
  ): Promise<HttpResponse<UserMapped[]>> => {
    const { listAllUsersService, httpResponsesHelper } = this.props;

    try {
      const users = await listAllUsersService.listAll();

      return httpResponsesHelper.ok(users);
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
