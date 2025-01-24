import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { HttpResponses } from "../../helpers/http-responses";
import { ListUserByIdService } from "@/backend/data/services";
import { UserMapped } from "@/backend/domain/entities";

interface ListUserByIdControllerProps {
  listUserByIdService: ListUserByIdService;
  httpResponses: HttpResponses;
}

export class ListUserByIdController implements Controller {
  constructor(private readonly props: ListUserByIdControllerProps) {}

  public readonly handle = async (
    request: HttpRequest
  ): Promise<HttpResponse> => {
    const { listUserByIdService, httpResponses } = this.props;

    try {
      const id: string = request.dynamicParams.id;

      const user: UserMapped | null = await listUserByIdService.listById(id);

      return httpResponses.ok(user);
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponses.badRequest(error);
      }

      return httpResponses.serverError();
    }
  };
}
