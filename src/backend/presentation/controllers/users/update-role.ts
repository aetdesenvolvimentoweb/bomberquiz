import { HttpRequest, HttpResponse } from "../../protocols";
import { AppError } from "@/backend/data/errors";
import { Controller } from "../../protocols/controller";
import { HttpResponsesHelper } from "../../helpers/http-responses";
import { UpdateUserRoleService } from "@/backend/data/services";
import { UserRole } from "@/backend/domain/entities";

interface ConstructorProps {
  updateUserRoleService: UpdateUserRoleService;
  httpResponsesHelper: HttpResponsesHelper;
}

export class UpdateUserRoleController implements Controller {
  constructor(private readonly constructorProps: ConstructorProps) {}

  public readonly handle = async (
    request: HttpRequest<{ role: UserRole }>
  ): Promise<HttpResponse> => {
    const { updateUserRoleService, httpResponsesHelper } =
      this.constructorProps;

    try {
      const id: string = request.dynamicParams.id;
      const role = request.body.role;

      await updateUserRoleService.updateRole({ id, role });

      return httpResponsesHelper.noContent();
    } catch (error) {
      if (error instanceof AppError) {
        return httpResponsesHelper.badRequest(error);
      }

      return httpResponsesHelper.serverError();
    }
  };
}
