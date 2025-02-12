import { HttpRequest, HttpResponse } from "../../protocols";
import { Controller } from "../../protocols/controller";
import { ErrorApp } from "@/backend/data/shared/errors";
import { HttpResponsesHelper } from "../../helpers";
import { UserFindByIdService } from "@/backend/data/services";
import { UserMapped } from "@/backend/domain/entities";

interface ConstructorProps {
  userFindByIdService: UserFindByIdService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class ListUserByIdController implements Controller {
  constructor(private readonly constructroProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest
  ): Promise<HttpResponse> => {
    const { userFindByIdService, httpResponsesHelper } = this.constructroProps;

    try {
      const id: string = request.dynamicParams.id;

      const user: UserMapped | null = await userFindByIdService.findById(id);

      return httpResponsesHelper.ok(user);
    } catch (error) {
      if (error instanceof ErrorApp) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
