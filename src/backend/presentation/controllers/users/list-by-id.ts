import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { HttpResponsesHelper } from "../../helpers/http-responses";
import { ListUserByIdService } from "@/backend/data/services";
import { UserMapped } from "@/backend/domain/entities";

interface ConstructorProps {
  listUserByIdService: ListUserByIdService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class ListUserByIdController implements Controller {
  constructor(private readonly constructroProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest
  ): Promise<HttpResponse> => {
    const { listUserByIdService, httpResponsesHelper } = this.constructroProps;

    try {
      const id: string = request.dynamicParams.id;

      const user: UserMapped | null = await listUserByIdService.listById(id);

      return httpResponsesHelper.ok(user);
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
